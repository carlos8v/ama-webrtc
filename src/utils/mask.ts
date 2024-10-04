export const mask = (value: string, pattern: string): string => {
  let i = 0
  const v = value.toString()
  const accValues = pattern
    .substring(0, v.length - 1)
    .replace(/[^#]/g, '').length
  const accMaskedValues = pattern
    .substring(0, v.length)
    .replace(/#/g, '').length
  const inputLen = pattern
    .substring(0, v.length + accValues + accMaskedValues)
    .replace(/#/g, '').length
  return pattern
    .substring(0, v.length + inputLen)
    .replace(/#[^#]*$/g, '#')
    .replace(/#/g, () => v[i++] || '')
}
