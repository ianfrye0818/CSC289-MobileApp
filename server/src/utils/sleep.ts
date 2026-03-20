/**
 * Returns a promise that resolves after the given number of milliseconds.
 *
 * Useful for adding artificial delays in development/tests (e.g. simulating
 * slow external API calls) or for retry back-off logic.
 *
 * @param ms - Number of milliseconds to wait before resolving.
 *
 * @example
 * await sleep(500); // pause for 500 ms
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
