import { Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const PageNotFound = () => (
  <>
    <Typography variant="h4">404 Page not found</Typography>
    <Link component={RouterLink} to="/">
      Go Home
    </Link>
  </>
)

export default PageNotFound
