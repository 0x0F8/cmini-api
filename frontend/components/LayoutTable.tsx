import { SearchApiData } from "app/api/search/route";
import Link from "next/link";
import useAppState from "@frontend/hooks/useAppState";
import MetricChip from "@frontend/components/MetricChip";
import { Typography } from "@mui/material";
import HandUseDisplay from "./HandUseDisplay";
import { AppState } from "../state/AppStateProvider";
import { SearchSortField } from "../feature/search/types";
import RollRatioDisplay from "./RollRatioDisplay";

// const colors = [
//   "#20de2e",
//   "#63de6c",
//   "#dedd20",
//   "#de6563",
//   "#de2020",
// ];

const colors = ["#20de2e", "#dedd20", "#dea020", "#de2020", "#8b1717"];
const centeredColors = [
  "#8b1717",
  "#de2020",
  "#dea020",
  "#dedd20",
  "#dedd20",
  "#20de2e",
  "#20de2e",
  "#20de2e",
  "#dedd20",
  "#dedd20",
  "#dea020",
  "#de2020",
  "#8b1717",
];

export function LayoutRow({
  stats,
  meta,
  metrics,
}: {
  stats: any;
  meta: any;
  metrics: AppState["metrics"];
}) {
  const handMin =
    metrics.get(SearchSortField.RightHand)!.min /
    metrics.get(SearchSortField.LeftHand)!.max;
  const handMax =
    metrics.get(SearchSortField.RightHand)!.max /
    metrics.get(SearchSortField.LeftHand)!.min;
  return (
    <tr>
      <td>
        <Typography sx={{ minWidth: 220 }}>
          <Link prefetch={false} href={`/layout/${meta[0].layoutHash}`}>
            {meta[0].name}
          </Link>
        </Typography>
        <Typography>&nbsp;</Typography>
      </td>
      <td>
        <Typography sx={{ minWidth: 170 }}>
          <Link prefetch={false} href={`/author/${meta[0].authorId}`}>
            {meta[0].author}
          </Link>
        </Typography>
        <Typography>&nbsp;</Typography>
      </td>
      <td>
        <MetricChip
          min={metrics.get(SearchSortField.Sfb)!.min}
          max={metrics.get(SearchSortField.Sfb)!.max}
          colors={colors}
          decimals={2}
        >
          {stats.sfb}
        </MetricChip>
        <Typography>&nbsp;</Typography>
      </td>
      <td>
        <MetricChip
          min={metrics.get(SearchSortField.Sfs)!.min}
          max={metrics.get(SearchSortField.Sfs)!.max}
          colors={colors}
          decimals={2}
        >
          {stats.sfs + stats.sfsAlt}
        </MetricChip>
        <Typography>&nbsp;</Typography>
      </td>
      <td>
        <MetricChip
          min={metrics.get(SearchSortField.Fsb)!.min}
          max={metrics.get(SearchSortField.Fsb)!.max}
          colors={colors}
          decimals={2}
        >
          {stats.fsb}
        </MetricChip>
        <Typography>&nbsp;</Typography>
      </td>
      <td>
        <MetricChip
          min={metrics.get(SearchSortField.Redirect)!.min}
          max={metrics.get(SearchSortField.Redirect)!.max}
          colors={colors}
          decimals={1}
        >
          {stats.redirect + stats.badRedirect}
        </MetricChip>
        <Typography>&nbsp;</Typography>
      </td>
      <td>
        <MetricChip
          min={metrics.get(SearchSortField.PinkyOff)!.min}
          max={metrics.get(SearchSortField.PinkyOff)!.max}
          colors={colors}
          decimals={1}
        >
          {stats.pinkyOff}
        </MetricChip>
        <Typography>&nbsp;</Typography>
      </td>
      <td>&nbsp;</td>
      <td>
        <MetricChip
          min={metrics.get(SearchSortField.Alternate)!.min}
          max={metrics.get(SearchSortField.Alternate)!.max}
          colors={colors}
          decimals={1}
          reverse
        >
          {stats.alternate}
        </MetricChip>
        <Typography>&nbsp;</Typography>
      </td>
      <td>
        <MetricChip
          min={metrics.get(SearchSortField.Roll)!.min}
          max={metrics.get(SearchSortField.Roll)!.max}
          colors={colors}
          decimals={1}
          reverse
        >
          {stats.rollIn + stats.rollOut}
        </MetricChip>
        <Typography>&nbsp;</Typography>
      </td>

      <td>
        <MetricChip
          min={metrics.get(SearchSortField.RollRatio)!.min}
          max={metrics.get(SearchSortField.RollRatio)!.max}
          colors={colors}
          decimals={2}
          center={1}
          reverse
        >
          {stats.rollIn / stats.rollOut}
        </MetricChip>
        <RollRatioDisplay
          colors={colors}
          ratio={stats.rollIn / stats.rollOut}
          min={metrics.get(SearchSortField.RollRatio)!.min}
          max={metrics.get(SearchSortField.RollRatio)!.max}
          reverse
        />
      </td>

      <td>
        <MetricChip
          min={Math.max(handMin, handMax) * -1}
          max={Math.max(handMin, handMax)}
          colors={centeredColors}
          decimals={0}
        >
          {stats.rightHand - stats.leftHand}
        </MetricChip>
        <HandUseDisplay
          colors={centeredColors}
          left={stats.leftHand}
          right={stats.rightHand}
          min={Math.max(handMin, handMax) * -1}
          max={Math.max(handMin, handMax)}
        />
      </td>
    </tr>
  );
}

export function LayoutTableHeader() {
  return (
    <tr>
      <td>
        <Typography>Name</Typography>
      </td>
      <td>
        <Typography>Author</Typography>
      </td>
      <td>
        <Typography>SFB</Typography>
      </td>
      <td>
        <Typography>SFS</Typography>
      </td>
      <td>
        <Typography>Scissors</Typography>
      </td>
      <td>
        <Typography>Redirects</Typography>
      </td>
      <td>
        <Typography>Pinky Off</Typography>
      </td>
      <td></td>
      <td>
        <Typography>Alternation</Typography>
      </td>
      <td>
        <Typography>Roll Ratio</Typography>
      </td>

      <td>
        <Typography>Roll Ratio</Typography>
      </td>
      <td>
        <Typography>Hand Use</Typography>
      </td>
    </tr>
  );
}

export default function LayoutTable({
  data,
  Header,
}: {
  data: SearchApiData[];
  Header: () => React.ReactElement;
}) {
  const { metrics } = useAppState();
  return (
    <table>
      <tbody>
        <Header />
        {data.map((row) => (
          <LayoutRow
            key={row.layout.boardIds[0] + row.layout.layoutId}
            metrics={metrics}
            {...row}
          />
        ))}
      </tbody>
    </table>
  );
}
