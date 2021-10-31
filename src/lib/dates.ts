export const getUnixTimeInSec = (date: Date): number =>
  Math.floor(date.getTime() / 1000)

export const getUnixTimeNow = (): number => Math.floor(Date.now() / 1000)
