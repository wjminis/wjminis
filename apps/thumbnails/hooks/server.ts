import type { Handle, HandleServerError } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  return response;
};

export const handleError: HandleServerError = async ({ error, event }) => {
  const id = crypto.randomUUID();
  return { id, message: "Error" };
};
