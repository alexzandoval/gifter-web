import {
  useState,
  useEffect,
  useContext,
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
} from 'react'
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
import { useHistory } from 'react-router-dom'

import { isDevelopment } from 'utility'
import firebaseApp from '../firebase/config'

const auth = getAuth(firebaseApp)

const { REACT_APP_PROXY } = process.env

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

if (isDevelopment) {
  /* eslint-disable no-console */
  apiAxios.interceptors.request.use(
    (config) => {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`, config)
      return config
    },
    (error) => {
      console.error('Error on request ::', error)
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
      console.error('Error on response ::', error)
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

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory()
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [authInitialized, setAuthInitialized] = useState<AuthContextType['authInitialized']>(false)
  const googleAuthProvider = useMemo(() => new GoogleAuthProvider(), [])
  const facebookAuthProvider = useMemo(() => new FacebookAuthProvider(), [])
  const appleAuthProvider = useMemo(() => new OAuthProvider('apple.com'), [])

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    // FIXME: User data not getting cleared after logout
    // history.replace('/')
    window.location.replace('/')
  }

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (authUser) => {
      setUser(authUser)
      setAuthInitialized(true)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  apiAxios.interceptors.request.use(
    async (config) => {
      if (user) {
        // eslint-disable-next-line no-param-reassign
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${await user.getIdToken()}`,
        }
      }
      return config
    },
    (error) => {
      Promise.reject(error)
    },
  )

  apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true
        if (user) {
          // eslint-disable-next-line no-param-reassign
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${await user.getIdToken()}`,
          }
        }
        return apiAxios(originalRequest)
      }
      return Promise.reject(error)
    },
  )

  const store = useMemo(
    () => ({
      user,
      authInitialized,
      signInWithEmail: async (email: string, password: string) =>
        signInWithEmailAndPassword(auth, email, password),
      signInWithGoogle: async () => signInWithPopup(auth, googleAuthProvider),
      signInWithApple: async () => signInWithPopup(auth, appleAuthProvider),
      signInWithFacebook: async () => signInWithPopup(auth, facebookAuthProvider),
      signOut: logout,
      signUpWithEmail: async (email: string, password: string) =>
        createUserWithEmailAndPassword(auth, email, password),
    }),
    [googleAuthProvider, appleAuthProvider, facebookAuthProvider, user, authInitialized],
  )
  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
