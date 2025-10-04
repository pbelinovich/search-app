import React from 'react'
import { IUser } from '@backend/types'
import './styles.css'

interface IDropdownProps {
  items: IUser[]
  isOpen: boolean
  onSelect: (user: IUser) => void
  loading?: boolean
  error?: string
}

export const Dropdown = ({ items, isOpen, onSelect, loading, error }: IDropdownProps) => {
  if (!isOpen) {
    return null
  }

  let node

  if (loading) {
    node = <div className="dropdown-loading">Loading...</div>
  } else if (error) {
    node = (
      <div className="dropdown-error-container">
        <div className="dropdown-error">Error</div>
        <div className="dropdown-error-message">{error}</div>
      </div>
    )
  } else if (!items.length) {
    node = <div className="dropdown-empty">No results found</div>
  } else {
    node = items.map(user => (
      <div key={user.id} className="dropdown-item" onMouseDown={() => onSelect(user)}>
        <div className="dropdown-item-name">
          {user.firstName} {user.lastName}
        </div>
        <div className="dropdown-item-email">{user.email}</div>
      </div>
    ))
  }

  return <div className="dropdown">{node}</div>
}
