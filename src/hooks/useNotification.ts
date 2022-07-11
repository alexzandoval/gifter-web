import { OptionsObject, SnackbarMessage, useSnackbar, VariantType } from 'notistack'
import { useCallback, useMemo } from 'react'

const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const variantNotification = useCallback(
    (message: SnackbarMessage, variant: VariantType, options?: OptionsObject) => {
      enqueueSnackbar(message, { variant, ...options })
    },
    [enqueueSnackbar],
  )

  const notify = useMemo(
    () => ({
      success: (message: SnackbarMessage, options?: OptionsObject) =>
        variantNotification(message, 'success', options),
      error: (message: SnackbarMessage, options?: OptionsObject) =>
        variantNotification(message, 'error', options),
      warning: (message: SnackbarMessage, options?: OptionsObject) =>
        variantNotification(message, 'warning', options),
      info: (message: SnackbarMessage, options?: OptionsObject) =>
        variantNotification(message, 'info', options),
    }),
    [variantNotification],
  )

  return {
    notify,
    enqueueSnackbar,
    closeSnackbar,
  }
}

export default useNotification
