import { Add, Close } from '@mui/icons-material'
import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { ChangeEvent, FC, FocusEvent, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'

const newParticipant = { name: '', excludes: [] }

interface Props {
  validate: () => boolean
}

const AddParticipants: FC<Props> = ({ validate }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<NewExchangeFormValues>()
  const { fields, append, remove, update } = useFieldArray({
    name: 'participants',
  })
  const [participantsHaveChanged, setParticipantsHaveChanged] = useState<boolean>(false)

  useEffect(() => {
    // Remove extra fields that are empty when component is remounted
    const removeEmptyFields = () => {
      const emptyFields: number[] = []
      const participants = watch('participants')
      participants.forEach((participant, index) => {
        if (!participant.name) {
          emptyFields.push(index)
        } else if (participantsHaveChanged) {
          update(index, {
            ...participant,
            excludes: [],
          })
          setParticipantsHaveChanged(false)
        }
      })
      const numberOfFieldsLeft = participants.length - emptyFields.length
      if (numberOfFieldsLeft < 3) {
        emptyFields.splice(-(3 - numberOfFieldsLeft))
      }
      remove(emptyFields)
    }
    return removeEmptyFields
  }, [remove, update, watch, participantsHaveChanged])

  const handleAddNewParticipant = (fieldIndex: number, value: string) => {
    const isLastInput = fieldIndex === fields.length - 1
    if (isLastInput && value.length > 0) {
      append(newParticipant, { shouldFocus: false })
    }
  }

  const handleRemoveParticipant = (index: number) => {
    const isMoreThanThreeParticipants = fields.length > 3
    if (isMoreThanThreeParticipants) {
      remove(index)
    } else {
      update(index, newParticipant)
    }
  }

  const errorMessage = (errors as any).participants?.message

  return (
    <>
      <Typography>
        Who will all be participating in this exchange? Don't worry you can add or remove more
        people later.
      </Typography>
      {fields.map((field, index) => {
        const inputProps = register(`participants.${index}.name`)
        const currentParticipant = watch(`participants.${index}`)
        const handleParticipantOnChange = (e: ChangeEvent<HTMLInputElement>) => {
          setParticipantsHaveChanged(true)
          handleAddNewParticipant(index, e.target.value)
          inputProps.onChange(e)
        }
        const handleParticipantOnBlur = (e: FocusEvent<HTMLInputElement>) => {
          if (errorMessage) validate()
          inputProps.onBlur(e)
        }
        return (
          <TextField
            key={field.id}
            label={`Enter participant ${index + 1}`}
            InputProps={{
              endAdornment: (fields.length > 3 || currentParticipant.name) && (
                <InputAdornment position="end">
                  <IconButton tabIndex={-1} onClick={() => handleRemoveParticipant(index)}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            inputProps={{
              ...inputProps,
              onChange: handleParticipantOnChange,
              onBlur: handleParticipantOnBlur,
            }}
          />
        )
      })}
      <Button
        title="Add another participant"
        startIcon={<Add />}
        onClick={() => append(newParticipant, { shouldFocus: false })}
      >
        Add Another Participant
      </Button>
      {errorMessage && (
        <Typography sx={{ textAlign: 'center' }} color="error">
          {errorMessage}
        </Typography>
      )}
    </>
  )
}

export default AddParticipants
