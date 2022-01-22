import { Close } from '@mui/icons-material'
import {
  Box,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
} from '@mui/material'
import { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { NewExchangeFormValues, Participant } from '../NewExchangeForm'

interface Props {
  participantIndex: number
  participants: Participant[]
}

const ExclusionFieldArray: FC<Props> = ({ participantIndex, participants }) => {
  const { register, watch } = useFormContext<NewExchangeFormValues>()
  const { fields, remove, append } = useFieldArray({
    name: `participants.${participantIndex}.excludes`,
  })
  const currentlyExcluded = watch(`participants.${participantIndex}.excludes`)

  const handleAddExclusion = (newExclusionIndex: number) => {
    append({ name: participants[newExclusionIndex].name }, { shouldFocus: false })
  }

  return (
    <Box ml={4} mt={0}>
      {participants.length - 1 > currentlyExcluded.length && (
        <FormControl fullWidth>
          <InputLabel id="select-exclusions-label">Select a name</InputLabel>
          <Select
            labelId="select-exclusions-label"
            id="select-exclusions"
            label="Select a name"
            value=""
          >
            {participants.map((participant, index) => {
              if (
                index === participantIndex ||
                currentlyExcluded.some((p) => p.name === participant.name)
              ) {
                return null
              }
              return (
                <MenuItem
                  key={participant.name}
                  value={participant.name}
                  onClick={() => handleAddExclusion(index)}
                >
                  {participant.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      )}
      <List sx={{ marginLeft: 4 }}>
        {/* Using currently excluded instead of fields as fields can lag behind when updated from another component */}
        {currentlyExcluded.map((_, index) => {
          const field = fields[index]
          return (
            <ListItem
              key={field.id}
              secondaryAction={
                <IconButton edge="end" tabIndex={-1} onClick={() => remove(index)}>
                  <Close />
                </IconButton>
              }
              dense
            >
              <InputBase
                readOnly
                // eslint-disable-next-line react/jsx-no-duplicate-props
                inputProps={register(`participants.${participantIndex}.excludes.${index}.name`)}
              />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export default ExclusionFieldArray
