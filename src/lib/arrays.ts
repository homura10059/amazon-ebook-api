export const unique = <T>(array: T[]) =>
  array.filter((elem, index, self) => self.indexOf(elem) === index)

export const sliceByNumber = <T>(array: T[], number: number) => {
  const length = Math.ceil(array.length / number)
  return new Array(length)
    .fill([])
    .map((_, i) => array.slice(i * number, (i + 1) * number))
}
