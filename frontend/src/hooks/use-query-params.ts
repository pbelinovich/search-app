import { useEffect, useState, useCallback, useRef } from 'react'

export const useQueryParams = (paramName: string): [string, (value: string) => void] => {
  const getQueryParam = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get(paramName) || ''
  }, [paramName])

  const [value, setValue] = useState<string>(getQueryParam)
  const isPopStateRef = useRef(false)

  const setQueryParam = useCallback(
    (newValue: string) => {
      const currentValue = getQueryParam()

      if (currentValue === newValue) {
        return
      }

      if (isPopStateRef.current) {
        isPopStateRef.current = false
        setValue(newValue)
        return
      }

      const params = new URLSearchParams(window.location.search)

      if (newValue) {
        params.set(paramName, newValue)
      } else {
        params.delete(paramName)
      }

      const newUrl = newValue ? `${window.location.pathname}?${params.toString()}` : window.location.pathname

      window.history.pushState(null, '', newUrl)
      setValue(newValue)
    },
    [paramName, getQueryParam]
  )

  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true
      const newValue = getQueryParam()
      setValue(newValue)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [getQueryParam])

  return [value, setQueryParam]
}
