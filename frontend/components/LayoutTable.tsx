import { format } from "@util/string";

export function LayoutRow({
  stats, meta
}: any) {
  return (
    <tr>
      <td>{meta[0].name}</td>
      <td>{meta[0].author}</td>
      <td>{format(stats.sfb)}</td>
      <td>{format((stats.sfs + stats.sfsAlt))}</td>
      <td>{format(stats.fsb, 2)}</td>
      <td>{format(stats.alternate, 1)}</td>
      <td>{format((stats.rollIn + stats.rollOut), 1)}</td>
      <td>{format((stats.redirect + stats.badRedirect), 1)}</td>
      <td>{format(stats.rollIn / stats.rollOut, 1)}</td>
      <td>{format(stats.pinkyOff, 1)}</td>
      <td>{format(stats.leftHand, 0)} - {format(stats.rightHand, 0)}</td>
    </tr>
  )
}

export default function LayoutTable({ data, hasMore = false }: { data: any; hasMore?: boolean }) {
  return (
    <table>
      <tbody>
        <tr><td>Name</td><td>Author</td><td>SFB</td><td>SFS</td><td>Scissors</td><td>Alternate</td><td>Roll</td><td>Redir</td><td>In:out-roll</td><td>Pinky off</td><td>Hand use</td></tr>
        {data.map(row => <LayoutRow key={row.layout.boardId}  {...row} />)}
      </tbody>
    </table>
  )
}