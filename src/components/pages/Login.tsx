import { Theme, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({}))

const Login = () => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h1">Login</Typography>
    </>
  )
}

export default Login
