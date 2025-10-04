import React, { useState } from 'react'
import { ModeToggle, SearchMode, DelayInputs } from './components'
import { SearchContainer } from './containers'
import './styles.css'

export const App: React.FC = () => {
  const [mode, setMode] = useState<SearchMode>('just-abort')
  const [delays, setDelays] = useState<number[]>([500])

  return (
    <div className="app">
      <div className="app-container">
        <h1 className="app-title">Search</h1>
        <ModeToggle mode={mode} onChange={setMode} />
        <DelayInputs delays={delays} onChange={setDelays} />
        <SearchContainer mode={mode} delays={delays} />
      </div>
    </div>
  )
}
