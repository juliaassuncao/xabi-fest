type Rect = { left: number; right: number; top: number; bottom: number }
type Silhouette = { src: string; bands: Rect[] }
const silhouettes = new WeakMap<HTMLImageElement, Silhouette>()

function imageBands(image: HTMLImageElement) {
  if (!image.naturalWidth || !image.complete) return []
  const cached = silhouettes.get(image)
  if (cached?.src === image.currentSrc) return cached.bands
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = Math.max(1, Math.round(64 * image.naturalHeight / image.naturalWidth))
  const context = canvas.getContext('2d')
  if (!context) return []
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
  const bands: Rect[] = []
  for (let y = 0; y < canvas.height; y += 2) {
    let left = canvas.width, right = -1
    for (let row = y; row < Math.min(y + 2, canvas.height); row++) {
      for (let x = 0; x < canvas.width; x++) {
        if (pixels[(row * canvas.width + x) * 4 + 3] > 32) {
          left = Math.min(left, x)
          right = Math.max(right, x)
        }
      }
    }
    if (right >= left) bands.push({ left: left / canvas.width, right: (right + 1) / canvas.width, top: y / canvas.height, bottom: Math.min(y + 2, canvas.height) / canvas.height })
  }
  silhouettes.set(image, { src: image.currentSrc, bands })
  return bands
}

/** Recover layout coordinates even while GSAP rotates/scales the message. */
function textLines(scene: HTMLElement, message: HTMLElement) {
  let left = 0, top = 0
  for (let element: HTMLElement | null = message; element && element !== scene; element = element.offsetParent as HTMLElement | null) {
    left += element.offsetLeft
    top += element.offsetTop
  }
  const style = getComputedStyle(message)
  const matrix = new DOMMatrix(style.transform === 'none' ? undefined : style.transform)
  const inverse = matrix.inverse()
  const origin = style.transformOrigin.split(' ').map(parseFloat)
  const sceneBox = scene.getBoundingClientRect()
  const originX = left + origin[0], originY = top + origin[1]
  const determinant = Math.abs(matrix.a * matrix.d) - Math.abs(matrix.b * matrix.c)
  const walker = document.createTreeWalker(message, NodeFilter.SHOW_TEXT)
  const lines: (Rect & { signature: boolean })[] = []
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue
    const range = document.createRange()
    range.selectNodeContents(node)
    for (const box of range.getClientRects()) {
      const center = inverse.transformPoint({ x: box.x + box.width / 2 - sceneBox.x - originX, y: box.y + box.height / 2 - sceneBox.y - originY })
      const width = (Math.abs(matrix.d) * box.width - Math.abs(matrix.c) * box.height) / determinant
      const height = (Math.abs(matrix.a) * box.height - Math.abs(matrix.b) * box.width) / determinant
      lines.push({ left: originX + center.x - width / 2, right: originX + center.x + width / 2, top: originY + center.y - height / 2, bottom: originY + center.y + height / 2, signature: !!node.parentElement?.closest('.birthday-message__signature') })
    }
  }
  return lines
}

/** Move only the foreground cup when its opaque pixels invade the text zone. */
export function protectMessage(scene: HTMLElement, message: HTMLElement) {
  const cup = scene.querySelector<HTMLElement>('.party-item--drink')
  const image = cup?.querySelector('img')
  if (!cup || !image) return
  const bands = imageBands(image)
  if (!bands.length) return
  const style = getComputedStyle(cup)
  const width = parseFloat(style.width), height = parseFloat(style.height)
  const x = parseFloat(style.left), y = parseFloat(style.top)
  const angle = parseFloat(style.getPropertyValue('--sticker-tilt')) * Math.PI / 180
  const cos = Math.cos(angle), sin = Math.sin(angle)
  const projected = bands.map(band => {
    const points = [[band.left, band.top], [band.right, band.top], [band.right, band.bottom], [band.left, band.bottom]].map(([px, py]) => ({ x: width / 2 + cos * (px - .5) * width - sin * (py - .5) * height, y: height / 2 + sin * (px - .5) * width + cos * (py - .5) * height }))
    return { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)), top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) }
  })
  const lines = textLines(scene, message)
  const signatureLeft = Math.min(...lines.filter(line => line.signature).map(line => line.left))
  const minX = Math.min(...projected.map(band => band.left)), maxX = Math.max(...projected.map(band => band.right))
  const dx = Math.max(Math.min(0, 2 - x - minX), Math.min(0, signatureLeft - 2 - x - maxX))
  let dy = 0
  for (let pass = 0; pass < projected.length + 1; pass++) {
    let clearance = 0
    for (const band of projected) for (const line of lines) {
      if (x + dx + band.left < line.right && x + dx + band.right > line.left && y + dy + band.top < line.bottom && y + dy + band.bottom > line.top) {
        clearance = Math.max(clearance, line.bottom + 1 - y - dy - band.top)
      }
    }
    if (clearance <= 0) break
    dy += clearance
  }
  scene.style.setProperty('--drink-safe-x', `${dx}px`)
  scene.style.setProperty('--drink-safe-y', `${dy}px`)
}
