export const PAGE_LIMIT = !Number.isNaN(Number(process.env.PAGE_LIMIT))
  ? Number(process.env.PAGE_LIMIT)
  : 50;
