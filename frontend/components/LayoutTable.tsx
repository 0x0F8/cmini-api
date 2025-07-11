import { format } from "@util/string";
import { SearchApiData } from "app/api/search/route";
import Link from "next/link";
import useAppState from "@frontend/hooks/useAppState";
import MetricChip from "@frontend/feature/search/MetricChip";
import { Typography } from "@mui/material";

// const colors = [
//   "#20de2e",
//   "#63de6c",
//   "#dedd20",
//   "#de6563",
//   "#de2020",
// ];

const colors = ["#20de2e", "#dedd20", "#dea020", "#de2020", "#8b1717"];

export function LayoutRow({ stats, meta, metrics }: any) {
  return (
    <tr>
      <td>
        <Typography>
          <Link href={`/layout/${meta[0].layoutHash}`}>{meta[0].name}</Link>
        </Typography>
      </td>
      <td>
        <Typography>
          <Link href={`/author/${meta[0].authorId}`}>{meta[0].author}</Link>
        </Typography>
      </td>
      <td>
        <MetricChip
          min={metrics["sfb"][0]}
          max={metrics["sfb"][1]}
          colors={colors}
          decimals={2}
        >
          {stats.sfb}
        </MetricChip>
      </td>
      <td>
        <MetricChip
          min={metrics["sfs"][0]}
          max={metrics["sfs"][1]}
          colors={colors}
          decimals={2}
        >
          {stats.sfs + stats.sfsAlt}
        </MetricChip>
      </td>
      <td>
        <MetricChip
          min={metrics["scissors"][0]}
          max={metrics["scissors"][1]}
          colors={colors}
          decimals={2}
        >
          {stats.fsb}
        </MetricChip>
      </td>
      <td>
        <MetricChip
          min={metrics["alternate"][0]}
          max={metrics["alternate"][1]}
          colors={colors}
          decimals={1}
          reverse
        >
          {stats.alternate}
        </MetricChip>
      </td>
      <td>
        <MetricChip
          min={metrics["roll"][0]}
          max={metrics["roll"][1]}
          colors={colors}
          decimals={1}
        >
          {stats.rollIn + stats.rollOut}
        </MetricChip>
      </td>
      <td>
        <MetricChip
          min={metrics["redirect"][0]}
          max={metrics["redirect"][1]}
          colors={colors}
          decimals={1}
        >
          {stats.redirect + stats.badRedirect}
        </MetricChip>
      </td>

      <td>
        <Typography>{format(stats.rollIn / stats.rollOut, 1)}</Typography>
      </td>
      <td>
        <MetricChip
          min={metrics["pinkyOff"][0]}
          max={metrics["pinkyOff"][1]}
          colors={colors}
          decimals={1}
        >
          {stats.pinkyOff}
        </MetricChip>
      </td>
      <td>
        <Typography>
          {format(stats.leftHand, 0)} - {format(stats.rightHand, 0)}
        </Typography>
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
        <Typography>Alternate</Typography>
      </td>
      <td>
        <Typography>Roll</Typography>
      </td>
      <td>
        <Typography>Redir</Typography>
      </td>
      <td>
        <Typography>In:out-roll</Typography>
      </td>
      <td>
        <Typography>Pinky off</Typography>
      </td>
      <td>
        <Typography>Hand use</Typography>
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
