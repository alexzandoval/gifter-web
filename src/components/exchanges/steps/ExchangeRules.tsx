import { FC, Fragment } from 'react'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import ExclusionFieldArray from './ExclusionFieldArray'
import { NewExchangeFormValues } from '../NewExchangeForm'

const ExchangeRules: FC = () => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<NewExchangeFormValues>()

  const participants = watch('participants').filter((participant) => participant.name)
  const numberOfDraws = watch('rules.numberOfDraws')
  const shouldShowExclusions = (watch('rules.addExclusions') as unknown as string) === 'true'
  const canAddExclusions = (numberOfDraws < 2 && participants.length > 3) || participants.length > 4

  const errorMessage = (errors as any).rules?.message
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
                  label="Zero, we won't be drawing names, we just want to share wishlists."
                />
                <FormControlLabel value={1} control={<Radio />} label="One Each" />
                {participants.length >= 3 && (
                  <FormControlLabel value={2} control={<Radio />} label="Two Each" />
                )}
              </RadioGroup>
            )}
          />
        </FormControl>
        <FormControl>
          {/* TODO: Emphasize capitalized words and error text */}
          <FormLabel id="set-exclusions-group">
            {canAddExclusions
              ? 'Do you want to add exclusions? You can specify people who should NOT draw each other.'
              : 'Exclusions allow you to specify which participants can NOT draw each other. Your group is not big enough to add exclusions.'}
          </FormLabel>

          <Controller
            name="rules.addExclusions"
            render={({ field }) => (
              <RadioGroup aria-labelledby="set-exclusions-group" {...field}>
                <FormControlLabel
                  value={false}
                  disabled={!canAddExclusions}
                  control={<Radio />}
                  label="No, I don't want to add exclusions"
                />
                <FormControlLabel
                  // eslint-disable-next-line react/jsx-boolean-value
                  value={true}
                  disabled={!canAddExclusions}
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
              <ExclusionFieldArray
                participantIndex={index}
                participants={participants}
                numberOfDraws={numberOfDraws}
              />
            </Fragment>
          ))}
      </Box>

      {errorMessage && (
        <Typography sx={{ textAlign: 'center' }} color="error">
          {errorMessage}
        </Typography>
      )}
    </>
  )
}

export default ExchangeRules
