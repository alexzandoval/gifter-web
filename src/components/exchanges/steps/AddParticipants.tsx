import { Box, TextField, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'

const AddParticipants = () => {
  const { register } = useFormContext<NewExchangeFormValues>()

  return (
    <>
      <Typography>
        Who will all be participating in this exchange? Don't worry you can add or remove more
        people later.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', '& > *': { margin: 2, maxWidth: 400 } }}>
        <TextField
          type="text"
          variant="filled"
          label="Participant 1"
          inputProps={{ ...register(`participants.participant1`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 2"
          inputProps={{ ...register(`participants.participant2`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 3"
          inputProps={{ ...register(`participants.participant3`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 4"
          inputProps={{ ...register(`participants.participant4`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 5"
          inputProps={{ ...register(`participants.participant5`) }}
        />
      </Box>
    </>
  )
}

export default AddParticipants
