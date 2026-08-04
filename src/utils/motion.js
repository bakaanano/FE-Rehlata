export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0 },
}

export const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0 },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
}

export const zoomIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1 },
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}