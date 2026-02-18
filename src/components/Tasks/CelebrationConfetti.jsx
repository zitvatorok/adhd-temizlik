import { useEffect, useState } from 'react'

export function CelebrationConfetti({ triggerKey }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!triggerKey) return
    setVisible(true)
    const id = setTimeout(() => setVisible(false), 800)
    return () => clearTimeout(id)
  }, [triggerKey])

  if (!visible) return null

  return (
    <div className="confetti-container">
      <div className="confetti-emoji">🎉</div>
    </div>
  )
}

