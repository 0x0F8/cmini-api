import { CminiGlobal } from "../cmini/types";
import { format } from "../util/string";

function LayoutRow({
  layout, stats, meta
}: CminiGlobal) {
  return (
    <tr>
      <td>{meta[0].name}</td>
      <td>{meta[0].author}</td>
      <td>{format(stats.sfb * 100)}</td>
      <td>{format((stats.sfs + stats.sfsAlt) * 100)}</td>
      <td>{format(stats.fsb * 10, 2)}</td>
      <td>{format(stats.alternate * 100, 1)}</td>
      <td>{format((stats.rollIn + stats.rollOut) * 100, 1)}</td>
      <td>{format((stats.redirect + stats.badRedirect) * 100, 1)}</td>
      <td>{format(stats.rollIn / stats.rollOut, 1)}</td>
      <td>{format(stats.pinkyOff * 100, 1)}</td>
      <td>{format(stats.leftHand * 100, 0)} - {format(stats.rightHand * 100, 0)}</td>
    </tr>
  )
}

export default function LayoutTable({ data, hasMore }: { data: CminiGlobal[]; hasMore: boolean }) {
  return (
    <table>
      <tbody>
        <tr><td>Name</td><td>Author</td><td>SFB</td><td>SFS</td><td>Scissors</td><td>Alternate</td><td>Roll</td><td>Redir</td><td>In:out-roll</td><td>Pinky off</td><td>Hand use</td></tr>
        {data.map(row => <LayoutRow key={row.layout.boardHash}  {...row} />)}
      </tbody>
    </table>
  )
}