import { FC, ReactNode } from 'react'
import { Box, Container, Theme, Toolbar } from '@mui/material'
import { makeStyles } from '@mui/styles'

import Header from 'components/layout/Header'
import { Link } from 'react-router-dom'

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
        <Link to="/exchanges/join/39">Join Exchange</Link>
        {children}
      </Container>
    </Box>
  )
}

export default Layout
