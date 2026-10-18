import { MOBILE_REFERENCE } from '../constants/composition'
import { protectMessage } from './protectMessage'

/** Scale the two decorative clusters; the message keeps its native text size. */
export function fitMobileComposition(scene: HTMLElement, message: HTMLElement) {
  const reference = MOBILE_REFERENCE
  const width = scene.clientWidth
  const height = parseFloat(getComputedStyle(scene).height)
  const messageHeight = parseFloat(getComputedStyle(message).height)
  const compositionWidth = Math.min(width, message.offsetWidth + 20)
  const widthScale = compositionWidth / reference.sceneWidth
  const free = Math.max(0, scene.clientHeight - message.offsetHeight - 10)
  const topSpace = free * reference.topShare
  const bottomSpace = Math.max(0, height - topSpace - messageHeight)

  const topScale = Math.min(widthScale, topSpace / reference.topSpace)
  // Short screens keep the lower objects larger, allowing controlled frame overlaps.
  const baseScale = Math.min(widthScale, Math.max(widthScale * 0.82, bottomSpace / reference.bottomSpace))
  const variables = {
    '--drink-safe-x': '0px',
    '--drink-safe-y': '0px',
    '--collage-top': `${topSpace}px`,
    '--collage-base': `${free * (1 - reference.topShare)}px`,
    '--composition-width': `${compositionWidth}px`,
    '--composition-unit': `${widthScale}px`,
    '--collage-top-unit': `${topScale}px`,
    '--collage-top-x': `${(width - reference.sceneWidth * topScale) / 2}px`,
    '--collage-top-y': `${topSpace - reference.topSpace * topScale}px`,
    '--collage-base-unit': `${baseScale}px`,
    '--collage-base-x': `${(width - reference.sceneWidth * baseScale) / 2}px`,
    '--collage-base-bottom': `${Math.max(0, (bottomSpace - reference.bottomSpace * baseScale) / 2)}px`,
  }
  for (const [name, value] of Object.entries(variables)) scene.style.setProperty(name, value)
  protectMessage(scene, message)
}
