import { useCallback, useState } from 'react'
import { PartyScene } from './components/PartyScene'
import { PARTY_CONTENT } from './constants/party'
import { useCardFit } from './hooks/useCardFit'
import { usePartyAudio } from './hooks/usePartyAudio'
import './styles/global.scss'

type PartyPhase = 'idle' | 'playing' | 'done'

function App() {
  const { viewportRef, cardRef, creditRef } = useCardFit()
  const { audioRef, isPlaying, isMuted, startMusic, toggleMute } = usePartyAudio()
  const [phase, setPhase] = useState<PartyPhase>('idle')
  const [playCount, setPlayCount] = useState(0)
  const [progress, setProgress] = useState<string>(PARTY_CONTENT.status.waiting)

  const handleStart = useCallback(() => {
    startMusic()
    setProgress(PARTY_CONTENT.status.preparing)
    setPhase('playing')
    setPlayCount((current) => current + 1)
  }, [startMusic])

  const handleComplete = useCallback(() => setPhase('done'), [])
  const handleProgress = useCallback((text: string) => setProgress(text), [])
  const audioLabel = isMuted ? 'Ativar som' : isPlaying ? 'Silenciar música' : 'Tentar reproduzir música'

  return (
    <main className="site">
      <audio ref={audioRef} src="/assets/audio/celebration.mp3" preload="metadata" loop />
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
            <div className="birthday-card__controls">
              {phase !== 'idle' && <button
                type="button"
                className="audio-button"
                onClick={toggleMute}
                aria-label={audioLabel}
                title={audioLabel}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M11 5 6 9H3v6h3l5 4Z" />
                  {isMuted ? <path d="m16 9 5 6m0-6-5 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}
                </svg>
              </button>}
              {phase === 'done' ? (
                <button type="button" className="replay-button" onClick={handleStart}>
                  {PARTY_CONTENT.finale.replay}
                </button>
              ) : (
                <span className="birthday-card__footer-mark" aria-hidden="true">made with ♡ & código</span>
              )}
            </div>
          </footer>
        </section>
      </div>
      <p className="site__credit" ref={creditRef}>um presente pequenininho para a nossa amada primeira dama de custode <span aria-hidden="true">♡</span></p>
    </main>
  )
}

export default App
