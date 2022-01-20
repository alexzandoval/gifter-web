import { Add, Close } from '@mui/icons-material'
import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { ChangeEvent, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { NewExchangeFormValues } from '../NewExchangeForm'

const AddParticipants = () => {
  const { register } = useFormContext<NewExchangeFormValues>()
  const { fields, append, remove } = useFieldArray({
    name: 'participants',
  })

  useEffect(() => {
    // Remove extra fields that are empty when component is remounted
    const emptyFields: number[] = []
    // @ts-ignore
    fields.forEach((field, index) => !field.name && emptyFields.push(index))
    const numberOfFieldsLeft = fields.length - emptyFields.length
    if (numberOfFieldsLeft < 3) {
      emptyFields.splice(-(3 - numberOfFieldsLeft))
    }
    remove(emptyFields)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddNewParticipantField = (fieldIndex: number, value: string) => {
    const isLastInput = fieldIndex === fields.length - 1
    if (isLastInput && value.length > 0) {
      append({ name: '' }, { shouldFocus: false })
    }
  }

  return (
    <>
      <Typography>
        Who will all be participating in this exchange? Don't worry you can add or remove more
        people later.
      </Typography>
      {fields.map((field, index) => {
        const inputProps = register(`participants.${index}.name`)
        const handleParticipantOnChange = (e: ChangeEvent<HTMLInputElement>) => {
          handleAddNewParticipantField(index, e.target.value)
          inputProps.onChange(e)
        }
        return (
          <TextField
            key={field.id}
            label={`Enter participant ${index + 1}`}
            InputProps={{
              endAdornment: index > 2 && (
                <InputAdornment position="end">
                  <IconButton tabIndex={-1} onClick={() => remove(index)}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            inputProps={{
              ...inputProps,
              onChange: handleParticipantOnChange,
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
    </>
  )
}

export default AddParticipants
