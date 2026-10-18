import { useLayoutEffect, useRef } from 'react'

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
        site.style.height = `${window.visualViewport?.height ?? window.innerHeight}px`
      }
      if (!desktop.matches) {
        viewport.style.removeProperty('--card-scale')
        viewport.style.removeProperty('--card-height')
        if (scene && message) {
          // Leave room for the paper's shadow; only decoration uses the remainder.
          const free = Math.max(0, scene.clientHeight - message.offsetHeight - 10)
          scene.style.setProperty('--collage-top', `${free * 0.44}px`)
          scene.style.setProperty('--collage-base', `${free * 0.56}px`)
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
    window.addEventListener('resize', fit)
    window.visualViewport?.addEventListener('resize', fit)
    desktop.addEventListener('change', fit)
    fit()

    return () => {
      if (!dynamicViewport) site.style.removeProperty('height')
      desktop.removeEventListener('change', fit)
      observer.disconnect()
      window.removeEventListener('resize', fit)
      window.visualViewport?.removeEventListener('resize', fit)
    }
  }, [])

  return { viewportRef, cardRef, creditRef }
}
