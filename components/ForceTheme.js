import { useEffect } from 'react'
import { useColorMode } from 'theme-ui'

export default function ForceTheme({ theme }) {
  const [colorMode, setColorMode] = useColorMode()
  useEffect(() => {
    setColorMode(theme)
  })
  return null
}
