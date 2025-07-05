import { format } from "@util/string";
import { SearchApiData, SearchApiResult } from "app/api/search/route";
import Link from "next/link";

export function LayoutRow({ stats, meta }: any) {
  return (
    <tr>
      <td>
        <Link href={`/layout/${meta[0].layoutHash}`}>{meta[0].name}</Link>
      </td>
      <td>
        <Link href={`/author/${meta[0].authorId}`}>{meta[0].author}</Link>
      </td>
      <td>{format(stats.sfb)}</td>
      <td>{format(stats.sfs + stats.sfsAlt)}</td>
      <td>{format(stats.fsb, 2)}</td>
      <td>{format(stats.alternate, 1)}</td>
      <td>{format(stats.rollIn + stats.rollOut, 1)}</td>
      <td>{format(stats.redirect + stats.badRedirect, 1)}</td>
      <td>{format(stats.rollIn / stats.rollOut, 1)}</td>
      <td>{format(stats.pinkyOff, 1)}</td>
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
  return (
    <table>
      <tbody>
        <LayoutTableHeader />
        {data.map((row) => (
          <LayoutRow
            key={row.layout.boardIds[0] + row.layout.layoutId}
            {...row}
          />
        ))}
      </tbody>
    </table>
  );
}
