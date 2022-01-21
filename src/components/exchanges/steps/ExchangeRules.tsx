import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'

interface Props {
  validate?: () => boolean
}

const ExchangeRules: FC<Props> = () => {
  const { register } = useFormContext<NewExchangeFormValues>()

  return (
    <>
      <Typography>
        Let's set some of the rules for the exchange, such as how many names everyone will draw and
        adding exclusions. For example, if you don't want people living together to draw each other.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', '& > *': { margin: 2, maxWidth: 400 } }}>
        <FormControl>
          <FormLabel id="number-of-names-to-draw-group">
            How many names will each participant be drawing? You can change this later.
          </FormLabel>
          <RadioGroup
            aria-labelledby="number-of-names-to-draw-group"
            defaultValue={1}
            {...register(`rules.numberOfDraws`)}
          >
            <FormControlLabel
              value={0}
              control={<Radio />}
              label="Zero, we won't be drawing names"
            />
            <FormControlLabel value={1} control={<Radio />} label="One Each" />
            <FormControlLabel value={2} control={<Radio />} label="Two Each" />
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  )
}

export default ExchangeRules
