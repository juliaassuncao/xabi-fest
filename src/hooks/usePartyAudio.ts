import { useCallback, useEffect, useRef, useState } from 'react'

export function usePartyAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const requestRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // iOS may ignore volume; playback must work independently of this setting.
    try { audio.volume = 0.5 } catch { /* Device volume remains available. */ }

    const syncPlayback = () => {
      setIsPlaying(!audio.paused && !audio.ended && !audio.error)
      setIsMuted(audio.muted)
    }
    const events = ['loadedmetadata', 'canplay', 'play', 'playing', 'pause', 'waiting', 'ended', 'error', 'emptied', 'volumechange'] as const
    events.forEach(event => audio.addEventListener(event, syncPlayback))
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) syncPlayback()

    return () => {
      requestRef.current += 1
      events.forEach(event => audio.removeEventListener(event, syncPlayback))
      audio.pause()
    }
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const request = ++requestRef.current
    const failed = () => {
      if (request !== requestRef.current) return
      audio.pause()
      setIsPlaying(false)
    }

    try {
      // Keep play() synchronous with the click, including a manual retry on iOS.
      if (audio.error) audio.load()
      void audio.play().then(() => {
        if (request === requestRef.current) {
          setIsPlaying(!audio.paused && !audio.ended)
        }
      }).catch(failed)
    } catch {
      failed()
    }
  }, [])

  const startMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    // Seeking can fail before metadata is available; this must not block play().
    try { audio.currentTime = 0 } catch { /* The first play starts at zero. */ }
    play()
  }, [play])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const needsPlayback = audio.paused || audio.ended || !!audio.error
    // A blocked, unmuted player uses the same button for an explicit retry.
    if (needsPlayback && !audio.muted) {
      play()
      return
    }

    audio.muted = !audio.muted
    setIsMuted(audio.muted)
    if (!audio.muted && needsPlayback) play()
  }, [play])

  return { audioRef, isPlaying, isMuted, startMusic, toggleMute }
}
