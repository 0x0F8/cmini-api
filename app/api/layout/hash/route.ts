import * as z from "zod/v4";
import CminiController from "@backend/cmini/controller";
import { parseQuery } from "@util/url";

const schema = z.object({
  id: z.number().gt(-1).lt(100000).optional(),
  name: z.string().min(1).max(55).optional(),
});

export async function GET(req) {
  const queryObj = parseQuery(req.url!);
  const validation = schema.safeParse(queryObj);
  if (validation.error) {
    return Response.json({
      error: validation.error!.issues,
      success: false,
    });
  }

  const { id, name } = queryObj;
  let row: any = undefined;

  if (typeof id !== "undefined") {
    row = CminiController.getLayoutHash(String(id));
  } else if (!!name) {
    const result = CminiController.getLayoutByName(name as string);
    if (result) {
      row = CminiController.getLayoutHash(result.layout.layoutId);
    }
  }

  if (!row) {
    return Response.json({
      success: false,
    });
  }

  return Response.json({
    data: row,
    success: true,
  });
}
