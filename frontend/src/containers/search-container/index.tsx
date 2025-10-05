import React, { useState, useRef, useCallback, useEffect } from 'react'
import { api } from '../../api'
import { Input, Dropdown, SearchMode } from '../../components'
import { useDebounce, useQueryParams } from '../../hooks'
import { IUser } from '@backend/types'
import './styles.css'

interface ISearchContainerProps {
  mode: SearchMode
  delays: number[]
}

interface ISearchContainerState {
  data: IUser[]
  isLoading: boolean
  isDropdownOpen: boolean
  error: string | null
}

export const SearchContainer: React.FC<ISearchContainerProps> = ({ mode, delays }) => {
  const [query, setQuery] = useQueryParams('q')
  const [inputValue, setInputValue] = useState(query)
  const [state, setState] = useState<ISearchContainerState>({
    data: [],
    isLoading: false,
    isDropdownOpen: false,
    error: null,
  })

  const delaysRef = useRef(delays)
  const delayCounterRef = useRef(0)

  const debouncedQuery = useDebounce(inputValue, 400)
  const searchTrigger = mode === 'abort-debounced' ? debouncedQuery : inputValue

  const updateState = useCallback((nextState: Partial<ISearchContainerState>) => {
    setState(prev => ({ ...prev, ...nextState }))
  }, [])

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        api.search.cancel()
        updateState({ data: [], isLoading: false, isDropdownOpen: false, error: null })
        return
      }

      updateState({ isLoading: true, isDropdownOpen: true, error: null })

      const delay = delaysRef.current.length > 0 ? delaysRef.current[delayCounterRef.current % delaysRef.current.length] : undefined
      const result = await api.search.execute({ query: searchQuery, delay })

      if (result.kind === 'success') {
        updateState({ data: result.response.data, isLoading: false, error: null })
      } else if (result.kind === 'error') {
        updateState({ data: [], isLoading: false, error: result.message })
      }
    },
    [updateState]
  )

  useEffect(() => setInputValue(query), [query])
  useEffect(() => () => api.search.cancel(), [])

  useEffect(() => {
    delayCounterRef.current += 1

    if (!searchTrigger.trim()) {
      api.search.cancel()
      updateState({ data: [], isLoading: false, isDropdownOpen: false, error: null })
      setQuery('')
      return
    }

    setQuery(searchTrigger)
    performSearch(searchTrigger)
  }, [searchTrigger, performSearch, setQuery, updateState])

  useEffect(() => {
    delaysRef.current = delays
  }, [delays])

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const handleSelectUser = (user: IUser) => {
    const fullName = `${user.firstName} ${user.lastName}`
    setInputValue(fullName)
    setQuery(fullName)
    updateState({ isDropdownOpen: false })
  }

  const handleFocus = () => {
    if (state.data.length > 0 || state.isLoading || state.error) {
      updateState({ isDropdownOpen: true })
    }
  }

  const handleBlur = () => {
    updateState({ isDropdownOpen: false })
  }

  return (
    <div className="search-container">
      <Input name="search" value={inputValue} onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur} />
      <Dropdown
        items={state.data}
        isOpen={state.isDropdownOpen}
        onSelect={handleSelectUser}
        loading={state.isLoading}
        error={state.error || undefined}
      />
    </div>
  )
}
