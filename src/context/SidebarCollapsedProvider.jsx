import { useState } from 'react'
import { SidebarCollapsedContext } from './SidebarCollapsedContext'

//
function SidebarCollapsedProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return <SidebarCollapsedContext.Provider value={{ isCollapsed, setIsCollapsed }}>{children}</SidebarCollapsedContext.Provider>
}

export default SidebarCollapsedProvider
