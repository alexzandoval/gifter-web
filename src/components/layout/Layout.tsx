import { FC, ReactNode } from 'react'
import { Box, Container, Theme, Toolbar } from '@mui/material'
import { makeStyles } from '@mui/styles'

import Header from '@Components/layout/Header'

interface Props {
  children: ReactNode
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
}))

const Layout: FC<Props> = ({ children }) => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Header />
      <Container className={classes.content}>
        <Toolbar />
        {children}
      </Container>
    </Box>
  )
}

export default Layout
