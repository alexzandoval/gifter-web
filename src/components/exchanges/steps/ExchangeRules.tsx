import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { ChangeEvent, FC, Fragment, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'
import ExclusionFieldArray from './ExclusionFieldArray'

interface Props {
  validate?: () => boolean
}

const ExchangeRules: FC<Props> = () => {
  const [showExclusions, setShowExclusions] = useState<1 | 0>(0)
  const { register, watch } = useFormContext<NewExchangeFormValues>()

  const shouldShowExclusions = showExclusions === 1

  const handleUpdateShowExclusions = (e: ChangeEvent<HTMLInputElement>) => {
    setShowExclusions(Number((e.target as HTMLInputElement).value) ? 1 : 0)
  }

  const participants = watch('participants')

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
        <FormControl>
          <FormLabel id="set-exclusions-group">
            Do you want to add exclusions? You can specify people who should NOT draw each other.
          </FormLabel>
          <RadioGroup
            aria-labelledby="set-exclusions-group"
            defaultValue={0}
            value={showExclusions}
            onChange={handleUpdateShowExclusions}
          >
            <FormControlLabel
              value={0}
              control={<Radio />}
              label="No, I don't want to add exclusions"
            />
            <FormControlLabel
              // eslint-disable-next-line react/jsx-boolean-value
              value={1}
              control={<Radio />}
              label="Yes, I want to add exclusions"
            />
          </RadioGroup>
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
