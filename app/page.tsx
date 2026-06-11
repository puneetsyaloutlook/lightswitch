'use client'

import { useState, useCallback, useRef } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [isOn, setIsOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (state: 'on' | 'off') => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: state }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Audio request failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(url)
      audioRef.current = audio
      await audio.play()
      audio.onended = () => URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  const toggle = useCallback(() => {
    const next = !isOn
    setIsOn(next)
    speak(next ? 'on' : 'off')
  }, [isOn, speak])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    },
    [toggle]
  )

  return (
    <main className={`${styles.room} ${isOn ? styles.lit : styles.dark}`}>
      <div className={styles.wallPlate}>
        <div
          role="switch"
          aria-checked={isOn}
          aria-label={`Light switch, currently ${isOn ? 'on' : 'off'}`}
          tabIndex={0}
          className={`${styles.rocker} ${isOn ? styles.rockerOn : styles.rockerOff}`}
          onClick={loading ? undefined : toggle}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.rockerLabel} aria-hidden="true">
            {isOn ? 'I' : 'O'}
          </span>
        </div>
      </div>

      <p className={styles.status} aria-live="polite" aria-atomic="true">
        {loading ? 'Speaking…' : isOn ? 'On' : 'Off'}
      </p>

      {error && (
        <p className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
    </main>
  )
}
