export function classnames(obj: Record<string, boolean>) {
  const classes = []
  for (const [key, value] of Object.entries(obj)) {
    if (value) classes.push(key)
  }

  return classes.join(' ')
}
