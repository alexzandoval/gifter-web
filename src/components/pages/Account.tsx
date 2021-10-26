import { Box, Typography } from '@mui/material'

import { useAuth } from 'context/Auth'

const Account = () => {
  const { user } = useAuth()

  return (
    <>
      <Typography variant="h1">Account</Typography>
      <Box sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }} component="pre">
        {JSON.stringify(user, null, 2)}
      </Box>
    </>
  )
}

export default Account
