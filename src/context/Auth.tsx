import { useState, useEffect, useContext, createContext, FC } from 'react'
import axios, { AxiosInstance } from 'axios'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  OAuthProvider,
  User,
  UserCredential,
} from 'firebase/auth'
import firebaseApp from 'firebase/config'

const auth = getAuth(firebaseApp)

const { REACT_APP_PROXY, REACT_APP_ENV } = process.env

interface AuthContextType {
  user: User | null
  api: AxiosInstance
  authInitialized: boolean
  signIn: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  signOut: () => Promise<void>
  signUp: (email: string, password: string) => Promise<UserCredential>
}

const noAuthProvider = () => {
  throw new Error('This component should be wrapper with a Auth Context Provider.')
}

const api = axios.create()

if (REACT_APP_ENV === 'development') {
  api.interceptors.response.use(
    (response) => {
      // eslint-disable-next-line no-console
      console.log(response.config.url, response)
      return response
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      return Promise.reject(error)
    },
  )
}

if (REACT_APP_PROXY) {
  api.defaults.baseURL = REACT_APP_PROXY
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  api,
  authInitialized: false,
  signIn: noAuthProvider,
  signInWithGoogle: noAuthProvider,
  signOut: noAuthProvider,
  signUp: noAuthProvider,
})

export const AuthContextProvider: FC = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [authInitialized, setAuthInitialized] = useState<AuthContextType['authInitialized']>(false)
  const googleAuthProvider = new OAuthProvider('google.com')

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (authUser) => {
      if (authUser) {
        api.defaults.headers.common.Authorization = `Bearer ${await authUser.getIdToken()}`
      } else {
        api.defaults.headers.common.Authorization = ''
      }
      setAuthInitialized(true)
      setUser(authUser)
    })
    return () => {
      unsubscribe()
    }
  })

  const store = {
    user,
    api,
    authInitialized,
    signIn: async (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password),
    signInWithGoogle: async () => signInWithPopup(auth, googleAuthProvider),
    signOut: async () => signOut(auth),
    signUp: async (email: string, password: string) =>
      createUserWithEmailAndPassword(auth, email, password),
  }
  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
