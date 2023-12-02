import { auth, app } from '../firebaseConfig/firebaseConfig.js'
import { onAuthStateChanged } from 'firebase/auth'

import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext.js'

//
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })
  }, [])

  return <AuthContext.Provider value={{ app, auth, user, isLoading }}>{children}</AuthContext.Provider>
}

export default AuthProvider
