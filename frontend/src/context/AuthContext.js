import {
  createContext,
  useState,
  useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode'


const AuthContext = createContext()
export default AuthContext


export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [authTokens, setAuthTokens] = useState(
    () => localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  )

  const [user, setUser] = useState(
    () => localStorage.getItem('authTokens')
      ? jwt_decode(localStorage.getItem('authTokens'))
      : null
  )

  const [loading, setLoading] = useState()

  const loginUser = async (credentials) => {
    const response = await fetch('/api/v1/auth/jwt/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    
    const data = await response.json()

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data.access))
      localStorage.setItem(
        'authTokens',
        JSON.stringify(data)
      )
    }
    return response.status
  }

  const signupUser = async (credentials) => {
    const response = await fetch('/api/v1/auth/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()
    return { data: data, status: response.status }
  }

  const updateToken = async () => {
    const response = await fetch('/api/v1/auth/jwt/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'refresh': authTokens?.refresh
      })
    })

    const data = await response.json()

    if (response.status === 200) {
      const newTokens = {
        access: data.access,
        refresh: authTokens.refresh
      }

      setAuthTokens(newTokens)
      setUser(jwt_decode(newTokens.access))
      localStorage.setItem('authTokens', JSON.stringify(newTokens))
    } else {
      logoutUser()
      navigate('/login')
    }

    if (loading) {
      setLoading(false)
    }
  }

  const logoutUser = async () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
  }

  const resetPassword = async (credentials) => {
    const response = await fetch('/api/v1/auth/users/reset_password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    // const data = await response.json()
    return response.status
  }

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    signupUser: signupUser,
    resetPassword: resetPassword,
  }

  useEffect(() => {
    if (loading) {
      updateToken()
    }
    const accessLifeInterval = 1000 * 10 * 1
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken()
      }
    }, accessLifeInterval)
    return () => clearInterval(interval)

  }, [authTokens, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}