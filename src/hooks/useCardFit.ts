import { useLayoutEffect, useRef } from 'react'
import { MOBILE_REFERENCE } from '../constants/composition'
import { fitMobileComposition } from '../utils/mobileComposition'

/** Fit desktop as a whole; allocate mobile space without scaling its text. */
export function useCardFit() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const creditRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const card = cardRef.current
    const credit = creditRef.current
    if (!viewport || !card || !credit) return

    const desktop = window.matchMedia('(min-width: 960px)')
    const site = viewport.parentElement!
    const dynamicViewport = CSS.supports('height', '100dvh')
    const scene = card.querySelector<HTMLElement>('.party-scene')
    const message = card.querySelector<HTMLElement>('.birthday-message')
    const fit = () => {
      // Older Safari uses a large vh even while its address bar is visible.
      if (!dynamicViewport) {
        const visual = window.visualViewport
        const height = visual && Math.abs(visual.scale - 1) < .01 ? visual.height : window.innerHeight
        site.style.height = `${height}px`
      }
      if (!desktop.matches) {
        const height = parseFloat(getComputedStyle(site).height)
        const density = Math.min(1, Math.max(0, (height - 640) / (MOBILE_REFERENCE.viewport.height - 640)))
        site.style.setProperty('--message-density', String(density))
        viewport.style.removeProperty('--card-scale')
        viewport.style.removeProperty('--card-height')
        if (scene && message) {
          fitMobileComposition(scene, message)
        }
        return
      }
      const siteStyle = getComputedStyle(site)
      const creditStyle = getComputedStyle(credit)
      const shadowSpace = 24
      const available = (window.visualViewport?.height ?? window.innerHeight)
        - parseFloat(siteStyle.paddingTop) - parseFloat(siteStyle.paddingBottom)
        - credit.offsetHeight - parseFloat(creditStyle.marginTop)
        - parseFloat(creditStyle.marginBottom) - shadowSpace
      const scale = Math.min(1, Math.max(0, available) / card.offsetHeight)

      viewport.style.setProperty('--card-scale', String(scale))
      viewport.style.setProperty('--card-height', `${card.offsetHeight * scale + shadowSpace}px`)
    }

    const observer = new ResizeObserver(fit)
    observer.observe(card)
    observer.observe(credit)
    if (scene) observer.observe(scene)
    if (message) observer.observe(message)
    const images = [...card.querySelectorAll('img')]
    images.forEach(image => image.addEventListener('load', fit))
    document.fonts.addEventListener('loadingdone', fit)
    window.addEventListener('resize', fit)
    window.visualViewport?.addEventListener('resize', fit)
    desktop.addEventListener('change', fit)
    fit()

    return () => {
      if (!dynamicViewport) site.style.removeProperty('height')
      desktop.removeEventListener('change', fit)
      observer.disconnect()
      images.forEach(image => image.removeEventListener('load', fit))
      document.fonts.removeEventListener('loadingdone', fit)
      window.removeEventListener('resize', fit)
      window.visualViewport?.removeEventListener('resize', fit)
    }
  }, [])

  return { viewportRef, cardRef, creditRef }
}
