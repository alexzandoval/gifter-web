import { TextField, Typography } from '@mui/material'
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
      <TextField
        type="text"
        label="Participant 1"
        inputProps={{ ...register(`participants.participant1`) }}
      />
      <TextField
        type="text"
        label="Participant 2"
        inputProps={{ ...register(`participants.participant2`) }}
      />
      <TextField
        type="text"
        label="Participant 3"
        inputProps={{ ...register(`participants.participant3`) }}
      />
      <TextField
        type="text"
        label="Participant 4"
        inputProps={{ ...register(`participants.participant4`) }}
      />
      <TextField
        type="text"
        label="Participant 5"
        inputProps={{ ...register(`participants.participant5`) }}
      />
    </>
  )
}

export default AddParticipants
