import React from 'react'
import './styles.css'

interface IDelayInputsProps {
  delays: number[]
  onChange: (delays: number[]) => void
}

const MAX_INPUTS = 10

export const DelayInputs = ({ delays, onChange }: IDelayInputsProps) => {
  const handleAddDelay = () => {
    if (delays.length < MAX_INPUTS) {
      onChange([...delays, 500])
    }
  }

  const handleRemoveDelay = (index: number) => {
    onChange(delays.filter((_, i) => i !== index))
  }

  const handleChangeDelay = (index: number, value: string) => {
    const numValue = parseInt(value, 10)

    if (!isNaN(numValue) && numValue >= 0) {
      const newDelays = [...delays]

      newDelays[index] = numValue
      onChange(newDelays)
    }
  }

  return (
    <div className="delay-inputs">
      <div className="delay-inputs-header">
        <span className="delay-inputs-title">Server Delays (ms)</span>
        {delays.length < MAX_INPUTS && (
          <button type="button" className="delay-add-button" onClick={handleAddDelay}>
            + Add Delay
          </button>
        )}
      </div>

      {delays.length > 0 && (
        <div className="delay-inputs-list">
          {delays.map((delay, index) => (
            <div key={index} className="delay-input-item">
              <input
                type="number"
                className="delay-input"
                value={delay}
                onChange={e => handleChangeDelay(index, e.target.value)}
                min="0"
                step="100"
              />
              <button type="button" className="delay-remove-button" onClick={() => handleRemoveDelay(index)}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
