import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { FC, Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'
import ExclusionFieldArray from './ExclusionFieldArray'

interface Props {
  validate?: () => boolean
}

const ExchangeRules: FC<Props> = () => {
  const { watch } = useFormContext<NewExchangeFormValues>()

  const participants = watch('participants')
  const shouldShowExclusions = (watch('rules.addExclusions') as unknown as string) === 'true'

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
          <Controller
            name="rules.numberOfDraws"
            render={({ field }) => (
              <RadioGroup aria-labelledby="number-of-names-to-draw-group" {...field}>
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label="Zero, we won't be drawing names"
                />
                <FormControlLabel value={1} control={<Radio />} label="One Each" />
                <FormControlLabel value={2} control={<Radio />} label="Two Each" />
              </RadioGroup>
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel id="set-exclusions-group">
            Do you want to add exclusions? You can specify people who should NOT draw each other.
          </FormLabel>
          <Controller
            name="rules.addExclusions"
            render={({ field }) => (
              <RadioGroup aria-labelledby="set-exclusions-group" {...field}>
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="No, I don't want to add exclusions"
                />
                <FormControlLabel
                  // eslint-disable-next-line react/jsx-boolean-value
                  value={true}
                  control={<Radio />}
                  label="Yes, I want to add exclusions"
                />
              </RadioGroup>
            )}
          />
        </FormControl>
        {shouldShowExclusions &&
          participants.map((participant, index) => (
            <Fragment key={participant.name}>
              <Typography>{`${participant.name} can not draw:`}</Typography>
              <ExclusionFieldArray participantIndex={index} participants={participants} />
            </Fragment>
          ))}
      </Box>
    </>
  )
}

export default ExchangeRules
