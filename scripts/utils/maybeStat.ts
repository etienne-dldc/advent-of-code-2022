export async function maybeStat(path: string) {
  try {
    return await Deno.stat(path);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
}
