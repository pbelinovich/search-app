import React from 'react'
import './styles.css'

export type SearchMode = 'just-abort' | 'abort-debounced'

interface IModeToggleProps {
  mode: SearchMode
  onChange: (mode: SearchMode) => void
}

export const ModeToggle: React.FC<IModeToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="mode-toggle">
      <label className="mode-toggle-label">
        <input type="radio" name="search-mode" value="just-abort" checked={mode === 'just-abort'} onChange={() => onChange('just-abort')} />
        <span>Just Abort</span>
      </label>
      <label className="mode-toggle-label">
        <input
          type="radio"
          name="search-mode"
          value="abort-debounced"
          checked={mode === 'abort-debounced'}
          onChange={() => onChange('abort-debounced')}
        />
        <span>Abort + Debounced</span>
      </label>
    </div>
  )
}
