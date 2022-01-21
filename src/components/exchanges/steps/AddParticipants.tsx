import { Add, Close } from '@mui/icons-material'
import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { ChangeEvent, FC, FocusEvent, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'

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

  useEffect(() => {
    // Remove extra fields that are empty when component is remounted
    const emptyFields: number[] = []
    fields.forEach(
      (field, index) => !watch(`participants.${index}.name`) && emptyFields.push(index),
    )
    const numberOfFieldsLeft = fields.length - emptyFields.length
    if (numberOfFieldsLeft < 3) {
      emptyFields.splice(-(3 - numberOfFieldsLeft))
    }
    remove(emptyFields)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddNewParticipant = (fieldIndex: number, value: string) => {
    const isLastInput = fieldIndex === fields.length - 1
    if (isLastInput && value.length > 0) {
      append({ name: '' }, { shouldFocus: false })
    }
  }

  const handleRemoveParticipant = (index: number) => {
    const isMoreThanThreeParticipants = fields.length > 3
    if (isMoreThanThreeParticipants) {
      remove(index)
    } else {
      update(index, { name: '' })
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
        const handleParticipantOnChange = (e: ChangeEvent<HTMLInputElement>) => {
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
              endAdornment: (fields.length > 3 || watch(`participants.${index}.name`)) && (
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
        onClick={() => append({ name: '' }, { shouldFocus: false })}
      >
        Add Another Participant
      </Button>
      {/* Display error in red */}
      {errorMessage && (
        <Typography sx={{ textAlign: 'center' }} color="error">
          {errorMessage}
        </Typography>
      )}
    </>
  )
}

export default AddParticipants
