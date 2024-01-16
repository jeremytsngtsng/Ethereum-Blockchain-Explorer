export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export const calc = (
  x: number,
  y: number,
  rect: { top: number; height: number; left: number; width: number }
) => [
  -(y - rect.top - rect.height / 2) / 120,
  (x - rect.left - rect.width / 2) / 120,
  1.02
]

export const trans = (x: number, y: number, s: number) =>
  `perspective(5000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

export const truncateAddress = (address: string | any[] | null) => {
  return `${address?.slice(0, 4)}...${address?.slice(-4)}`
}
