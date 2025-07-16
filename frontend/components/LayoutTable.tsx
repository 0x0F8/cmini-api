import { SearchApiData } from "app/api/search/route";
import Link from "next/link";
import useAppState from "@frontend/hooks/useAppState";
import MetricChip from "@frontend/components/MetricChip";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableHeadProps,
  TableRow,
  TableRowProps,
  Typography,
} from "@mui/material";
import HandUseDisplay from "./HandUseDisplay";
import { AppState } from "../state/AppStateProvider";
import { SearchRangeField } from "../feature/search/types";
import RollRatioDisplay from "./RollRatioDisplay";
import { homerow } from "@/util/layout";
import Homerow from "./Homerow";

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
  layout,
  metrics,
  showText = false,
  ...props
}: {
  stats: any;
  meta: any;
  layout: any;
  metrics: AppState["metrics"];
  showText?: boolean;
} & TableRowProps) {
  const handMin =
    metrics.get(SearchRangeField.RightHand)!.min /
    metrics.get(SearchRangeField.LeftHand)!.max;
  const handMax =
    metrics.get(SearchRangeField.RightHand)!.max /
    metrics.get(SearchRangeField.LeftHand)!.min;
  return (
    <TableRow {...props}>
      <TableCell>
        <Typography sx={{ width: 250 }} noWrap>
          <Link prefetch={false} href={`/layout/${meta[0].layoutHash}`}>
            {meta[0].name}
          </Link>
          &nbsp;
          {showText && <br />}
          by&nbsp;
          <Link prefetch={false} href={`/author/${meta[0].authorId}`}>
            {meta[0].author}
          </Link>
        </Typography>
      </TableCell>
      <TableCell>
        <Homerow layout={layout} />{" "}
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>
      <TableCell>
        <MetricChip
          min={metrics.get(SearchRangeField.Sfb)!.min}
          max={metrics.get(SearchRangeField.Sfb)!.max}
          colors={colors}
          decimals={2}
        >
          {stats.sfb}
        </MetricChip>
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>
      <TableCell>
        <MetricChip
          min={metrics.get(SearchRangeField.Sfs)!.min}
          max={metrics.get(SearchRangeField.Sfs)!.max}
          colors={colors}
          decimals={2}
        >
          {stats.sfs + stats.sfsAlt}
        </MetricChip>
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>
      <TableCell>
        <MetricChip
          min={metrics.get(SearchRangeField.Fsb)!.min}
          max={metrics.get(SearchRangeField.Fsb)!.max}
          colors={colors}
          decimals={2}
        >
          {stats.fsb}
        </MetricChip>
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>
      <TableCell>
        <MetricChip
          min={metrics.get(SearchRangeField.Redirect)!.min}
          max={metrics.get(SearchRangeField.Redirect)!.max}
          colors={colors}
          decimals={1}
        >
          {stats.redirect + stats.badRedirect}
        </MetricChip>
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>
      <TableCell>
        <MetricChip
          min={metrics.get(SearchRangeField.PinkyOff)!.min}
          max={metrics.get(SearchRangeField.PinkyOff)!.max}
          colors={colors}
          decimals={1}
        >
          {stats.pinkyOff}
        </MetricChip>
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>
      <TableCell>&nbsp;</TableCell>
      <TableCell>
        <MetricChip
          min={metrics.get(SearchRangeField.Alternate)!.min}
          max={metrics.get(SearchRangeField.Alternate)!.max}
          colors={colors}
          decimals={1}
          reverse
        >
          {stats.alternate}
        </MetricChip>
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>
      <TableCell>
        <MetricChip
          min={metrics.get(SearchRangeField.Roll)!.min}
          max={metrics.get(SearchRangeField.Roll)!.max}
          colors={colors}
          decimals={1}
          reverse
        >
          {stats.rollIn + stats.rollOut}
        </MetricChip>
        {showText && <Typography>&nbsp;</Typography>}
      </TableCell>

      <TableCell>
        <RollRatioDisplay
          colors={colors}
          ratio={stats.rollIn / stats.rollOut}
          min={metrics.get(SearchRangeField.RollRatio)!.min}
          max={metrics.get(SearchRangeField.RollRatio)!.max}
          reverse
          showText={showText}
        />
      </TableCell>

      <TableCell>
        <HandUseDisplay
          colors={centeredColors}
          left={stats.leftHand}
          right={stats.rightHand}
          min={Math.max(handMin, handMax) * -1}
          max={Math.max(handMin, handMax)}
          showText={showText}
        />
      </TableCell>
    </TableRow>
  );
}

export function LayoutTableHeader(props?: TableHeadProps) {
  return (
    <TableHead {...props}>
      <TableRow>
        <TableCell>
          <Typography></Typography>
        </TableCell>
        <TableCell>
          <Stack flexDirection="row" justifyContent="space-between">
            <Box minWidth={0.1}>
              <Typography textAlign="center">LT</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">LI</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">LM</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">LR</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">LP</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">RT</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">RI</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">RM</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">RR</Typography>
            </Box>
            <Box minWidth={0.1}>
              <Typography textAlign="center">RP</Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">SFB</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">SFS</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">Scissors</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">Redirects</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">Pinky Off</Typography>
        </TableCell>
        <TableCell></TableCell>
        <TableCell>
          <Typography textAlign="center">Alternation</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">Roll Ratio</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">Roll Ratio</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">Hand Use</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function LayoutTable({
  data,
  Header,
  showText,
}: {
  data: SearchApiData[];
  Header: (props?: TableHeadProps) => React.ReactElement;
  showText?: boolean;
}) {
  const { metrics } = useAppState();
  return (
    <Table
      stickyHeader
      padding="none"
      size="small"
      sx={{
        ".MuiTableCell-root": {
          borderBottom: "none",
          px: 0.25,
        },
        minHeight: 400,
      }}
    >
      <Header />
      <TableBody>
        {data.map((row) => (
          <LayoutRow
            key={row.layout.boardIds[0] + row.layout.layoutId}
            metrics={metrics}
            showText={showText}
            stats={row.stats}
            meta={row.meta}
            layout={row.layout}
          />
        ))}
      </TableBody>
    </Table>
  );
}
