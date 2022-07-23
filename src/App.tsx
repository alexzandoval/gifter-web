import { FC } from 'react'
import { ThemeProvider, CssBaseline, StyledEngineProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { BrowserRouter, Route, RouteProps, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { NOTIFICATION_AUTOHIDE_DURATION, ROUTES } from '@Constants'
import ProtectedRoute from '@Components/auth/ProtectedRoute'
import PublicOnlyRoute from '@Components/auth/PublicOnlyRoute'
import PublicRoute from '@Components/auth/PublicRoute'
import Layout from '@Components/layout/Layout'
import { AuthContextProvider } from '@Context/Auth'
import { useColorScheme } from '@Context/Theme'
import getTheme from '@Styles/theme'
import { AppRoutes } from '@Types'

import 'react-toastify/dist/ReactToastify.min.css'

const queryClient = new QueryClient()

const App: FC = () => {
  const { colorScheme } = useColorScheme()
  const appRoutes = Object.keys(ROUTES).map((routeName) => {
    const route = ROUTES[routeName as keyof AppRoutes]
    const { Component, path, props, publicOnlyRoute, protectedRoute } = route
    let RouteComponent: typeof Route | FC<RouteProps> = PublicRoute
    if (protectedRoute) {
      RouteComponent = ProtectedRoute
    } else if (publicOnlyRoute) {
      RouteComponent = PublicOnlyRoute
    }
    return (
      <RouteComponent key={path} path={path} {...props}>
        <Component />
      </RouteComponent>
    )
  })

  const theme = getTheme(colorScheme)

  return (
    <BrowserRouter>
      {/* TODO v5: remove once migration to emotion is completed */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AuthContextProvider>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                <Layout>
                  <Switch>{appRoutes}</Switch>
                  <ToastContainer
                    autoClose={NOTIFICATION_AUTOHIDE_DURATION}
                    position="bottom-left"
                    theme={colorScheme}
                  />
                </Layout>
              </LocalizationProvider>
            </QueryClientProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  )
}

export default App
