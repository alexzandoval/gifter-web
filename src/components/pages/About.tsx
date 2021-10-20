import { Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const About = () => (
  <>
    <Typography variant="h1">About</Typography>
    <Link component={RouterLink} to="/">
      Go Home
    </Link>
  </>
)

export default About
