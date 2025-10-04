import React, { useEffect, useRef } from 'react'
import './styles.css'

interface IInputProps {
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
}

export const Input: React.FC<IInputProps> = ({ name, value, onChange, placeholder = 'Search...', onFocus, onBlur }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => inputRef.current?.focus(), [])

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      className="search-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  )
}
