import { useCallback, useMemo } from 'react'
import { toast, ToastContent, ToastOptions } from 'react-toastify'
import { useHistory } from 'react-router-dom'

type OptionsWithRedirect = ToastOptions & { redirect?: string }

const useNotification = () => {
  const history = useHistory()

  const toastWithRedirect = useCallback(
    (message: ToastContent, options?: OptionsWithRedirect) => {
      let onOpen
      if (options?.redirect) {
        onOpen = () => options.redirect && history.push(options.redirect)
      }
      return toast(message, { ...options, onOpen })
    },
    [history],
  )

  const notify = useMemo(
    () => ({
      success: (message: ToastContent, options?: OptionsWithRedirect) =>
        toastWithRedirect(message, { ...options, type: 'success' }),
      error: (message: ToastContent, options?: OptionsWithRedirect) =>
        toastWithRedirect(message, { ...options, type: 'error' }),
      warning: (message: ToastContent, options?: OptionsWithRedirect) =>
        toastWithRedirect(message, { ...options, type: 'warning' }),
      info: (message: ToastContent, options?: OptionsWithRedirect) =>
        toastWithRedirect(message, { ...options, type: 'info' }),
    }),
    [toastWithRedirect],
  )

  return notify
}

export default useNotification
