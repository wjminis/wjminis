import type {  HandleClientError } from "@sveltejs/kit";

export const handleError: HandleClientError = async ({ error, event }) => {
  const id = crypto.randomUUID();
  return { id, message: "Error" };
};
