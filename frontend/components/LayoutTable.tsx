import { format } from "@util/string";
import { SearchApiData } from "app/api/search/route";
import Link from "next/link";
import ColoredChip from "./ColoredChip";
import useAppState from "@frontend/hooks/useAppState";
import MetricChip from "@frontend/feature/search/MetricChip";

// const colors = [
//   "#20de2e",
//   "#63de6c",
//   "#dedd20",
//   "#de6563",
//   "#de2020",
// ];

const colors = ["#20de2e", "#dedd20", "#dea020", "#de2020", "#8b1717"];

export function LayoutRow({ stats, meta, metrics }: any) {
  console.log(metrics);
  return (
    <tr>
      <td>
        <Link href={`/layout/${meta[0].layoutHash}`}>{meta[0].name}</Link>
      </td>
      <td>
        <Link href={`/author/${meta[0].authorId}`}>{meta[0].author}</Link>
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

      <td> {format(stats.rollIn / stats.rollOut, 1)}</td>
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
        {format(stats.leftHand, 0)} - {format(stats.rightHand, 0)}
      </td>
    </tr>
  );
}

export function LayoutTableHeader() {
  return (
    <tr>
      <td>Name</td>
      <td>Author</td>
      <td>SFB</td>
      <td>SFS</td>
      <td>Scissors</td>
      <td>Alternate</td>
      <td>Roll</td>
      <td>Redir</td>
      <td>In:out-roll</td>
      <td>Pinky off</td>
      <td>Hand use</td>
    </tr>
  );
}

export default function LayoutTable({ data }: { data: SearchApiData[] }) {
  const { metrics } = useAppState();
  return (
    <table>
      <tbody>
        <LayoutTableHeader />
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
