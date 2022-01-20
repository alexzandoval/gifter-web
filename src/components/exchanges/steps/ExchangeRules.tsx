import { Box, TextField, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'

const ExchangeRules = () => {
  const { register } = useFormContext<NewExchangeFormValues>()

  return (
    <>
      <Typography>
        Let's set some of the rules for the exchange, such as how many names everyone will draw and
        adding exclusions. For example, if you don't want people living together to draw each other.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', '& > *': { margin: 2, maxWidth: 400 } }}>
        <TextField
          type="number"
          variant="filled"
          label="Number of names to draw"
          inputProps={{ ...register(`rules.numberOfDraws`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 1 may not draw"
          inputProps={{ ...register(`rules.participant1`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 2 may not draw"
          inputProps={{ ...register(`rules.participant2`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 3 may not draw"
          inputProps={{ ...register(`rules.participant3`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 4 may not draw"
          inputProps={{ ...register(`rules.participant4`) }}
        />
        <TextField
          type="text"
          variant="filled"
          label="Participant 5 may not draw"
          inputProps={{ ...register(`rules.participant5`) }}
        />
      </Box>
    </>
  )
}

export default ExchangeRules
