import { createContext, useContext, useState } from 'react'

/**
 * AppContext - Global application state
 */
const AppContext = createContext()

/**
 * AppProvider - Context provider component
 */
export function AppProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const addNotification = (message, type = 'info') => {
    const id = Date.now()
    const notification = { id, message, type }
    setNotifications([...notifications, notification])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const value = {
    isDarkMode,
    toggleDarkMode,
    notifications,
    addNotification,
    removeNotification,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * useApp - Hook to use AppContext
 */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
