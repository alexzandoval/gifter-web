import { FC } from 'react'
import { ThemeProvider, CssBaseline, StyledEngineProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterDateFns'
import { BrowserRouter, Route, RouteProps, Switch } from 'react-router-dom'

import ProtectedRoute from 'components/auth/ProtectedRoute'
import PublicOnlyRoute from 'components/auth/PublicOnlyRoute'
import Layout from 'components/layout/Layout'
import routes, { Routes } from 'constants/routes'
import { AuthContextProvider } from 'context/Auth'
import { useColorScheme } from 'context/Theme'
import getTheme from 'styles/theme'

const App = () => {
  const { colorScheme } = useColorScheme()
  const appRoutes = Object.keys(routes).map((routeName) => {
    const route = routes[routeName as keyof Routes]
    const { Component, path, props, publicOnlyRoute, protectedRoute } = route
    let RouteComponent: typeof Route | FC<RouteProps> = Route
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
            <LocalizationProvider dateAdapter={DateAdapter}>
              <CssBaseline />
              <Layout>
                <Switch>{appRoutes}</Switch>
              </Layout>
            </LocalizationProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  )
}

export default App
