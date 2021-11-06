export const concurrentPromise = async <T>(
  promises: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> => {
  const results: T[] = []
  let currentIndex = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const chunks = promises.slice(currentIndex, currentIndex + concurrency)
    if (chunks.length === 0) {
      break
    }
    Array.prototype.push.apply(
      results,
      await Promise.allSettled(chunks.map(c => c()))
    )
    currentIndex += concurrency
  }
  return results
}
