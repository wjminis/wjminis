import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => {
  return new Response('{ "schemaVersion": 1, "label": "", "message": "live", "color": "000" }');
};
