import { useState, useEffect, useContext, createContext, FC } from 'react'
import axios from 'axios'
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth'
import firebaseApp from 'firebase/config'

const auth = getAuth(firebaseApp)

const { REACT_APP_PROXY, REACT_APP_ENV } = process.env

interface AuthContextType {
  user: User | null
  authInitialized: boolean
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  signInWithApple: () => Promise<UserCredential>
  signInWithFacebook: () => Promise<UserCredential>
  signOut: () => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>
}

const noAuthProvider = () => {
  throw new Error('This component should be wrapper with a Auth Context Provider.')
}

export const apiAxios = axios.create()

if (REACT_APP_ENV === 'development') {
  /* eslint-disable no-console */
  apiAxios.interceptors.request.use(
    (config) => {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`, config)
      return config
    },
    (error) => {
      console.error('Error on request', error)
      return Promise.reject(error.response?.data || error)
    },
  )
  apiAxios.interceptors.response.use(
    (response) => {
      console.log(
        `Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response,
      )
      return response
    },
    (error) => {
      console.error('Error on response', error)
      return Promise.reject(error.response?.data || error)
    },
  )
  /* eslint-enable no-console */
}

if (REACT_APP_PROXY) {
  apiAxios.defaults.baseURL = REACT_APP_PROXY
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authInitialized: false,
  signInWithEmail: noAuthProvider,
  signInWithGoogle: noAuthProvider,
  signInWithApple: noAuthProvider,
  signInWithFacebook: noAuthProvider,
  signOut: noAuthProvider,
  signUpWithEmail: noAuthProvider,
})

export const AuthContextProvider: FC = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [authInitialized, setAuthInitialized] = useState<AuthContextType['authInitialized']>(false)
  const googleAuthProvider = new GoogleAuthProvider()
  const facebookAuthProvider = new FacebookAuthProvider()
  const appleAuthProvider = new OAuthProvider('apple.com')

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (authUser) => {
      setUser(authUser)
      setAuthInitialized(true)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  apiAxios.interceptors.request.use(async (config) => {
    if (user) {
      apiAxios.defaults.headers.common.Authorization = `Bearer ${await user.getIdToken()}`
    } else {
      apiAxios.defaults.headers.common.Authorization = ''
    }
    return config
  })

  const store = {
    user,
    authInitialized,
    signInWithEmail: async (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password),
    signInWithGoogle: async () => signInWithPopup(auth, googleAuthProvider),
    signInWithApple: async () => signInWithPopup(auth, appleAuthProvider),
    signInWithFacebook: async () => signInWithPopup(auth, facebookAuthProvider),
    signOut: async () => signOut(auth),
    signUpWithEmail: async (email: string, password: string) =>
      createUserWithEmailAndPassword(auth, email, password),
  }
  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
