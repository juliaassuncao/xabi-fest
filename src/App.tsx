import { useCallback, useState } from 'react'
import { PartyScene } from './components/PartyScene'
import { PARTY_CONTENT } from './constants/party'
import { useCardFit } from './hooks/useCardFit'
import './styles/global.scss'

type PartyPhase = 'idle' | 'playing' | 'done'

function App() {
  const { viewportRef, cardRef, creditRef } = useCardFit()
  const [phase, setPhase] = useState<PartyPhase>('idle')
  const [playCount, setPlayCount] = useState(0)
  const [progress, setProgress] = useState<string>(PARTY_CONTENT.status.waiting)

  const handleStart = useCallback(() => {
    setProgress(PARTY_CONTENT.status.preparing)
    setPhase('playing')
    setPlayCount((current) => current + 1)
  }, [])

  const handleComplete = useCallback(() => setPhase('done'), [])
  const handleProgress = useCallback((text: string) => setProgress(text), [])

  return (
    <main className="site">
      <div className="site__ornament site__ornament--one" aria-hidden="true">✳</div>
      <div className="site__ornament site__ornament--two" aria-hidden="true">♡</div>

      <div className="birthday-card-viewport" ref={viewportRef}>
        <section className="birthday-card" ref={cardRef} aria-label="Presente de aniversário da Xabi">
          <header className="birthday-card__header">
            <span className="birthday-card__label"><span aria-hidden="true">✿</span> {PARTY_CONTENT.festival} <strong>{PARTY_CONTENT.year}</strong></span>
            <span className="birthday-card__note">{PARTY_CONTENT.eyebrow}</span>
            <span className="birthday-card__heart" aria-hidden="true">♥</span>
          </header>

          <div className="birthday-card__stage">
            <PartyScene playCount={playCount} onComplete={handleComplete} onProgress={handleProgress} />

            {phase === 'idle' && (
              <div className="intro-panel">
                <div className="intro-panel__card">
                  <span className="intro-panel__sticker" aria-hidden="true">💌</span>
                  <span className="intro-panel__kicker">{PARTY_CONTENT.introduction.kicker}</span>
                  <h1>{PARTY_CONTENT.introduction.heading}</h1>
                  <p>{PARTY_CONTENT.introduction.description}</p>
                  <button className="primary-button" type="button" onClick={handleStart}>
                    {PARTY_CONTENT.introduction.action} <span aria-hidden="true">↗</span>
                  </button>
                  <small>o orçamento foi zero mas o elenco é de milhões ✨</small>
                </div>
              </div>
            )}
          </div>

          <footer className="birthday-card__footer">
            <span className="birthday-card__status" role="status" aria-live="polite">
              <span className="birthday-card__live-dot" aria-hidden="true" />
              {progress}
            </span>
            {phase === 'done' ? (
              <button type="button" className="replay-button" onClick={handleStart}>
                {PARTY_CONTENT.finale.replay}
              </button>
            ) : (
              <span className="birthday-card__footer-mark" aria-hidden="true">made with ♡ & código</span>
            )}
          </footer>
        </section>
      </div>
      <p className="site__credit" ref={creditRef}>um presente pequenininho para a nossa amada primeira dama de custode <span aria-hidden="true">♡</span></p>
    </main>
  )
}

export default App
