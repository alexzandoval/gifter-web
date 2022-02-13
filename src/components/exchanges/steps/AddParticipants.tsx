import { ChangeEvent, FC, FocusEvent, useEffect, useState } from 'react'
import { Add, Close } from '@mui/icons-material'
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
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
        // Remove empty fields unless except for the field that is synced with the organizer name
        if (!participant.name && index !== 0) {
          emptyFields.push(index)
        } else if (participantsHaveChanged) {
          // Clearing out the exclusion list when the participant name is changed
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

  const organizerName = watch('organizerName')
  useEffect(() => {
    setParticipantsHaveChanged(true)
    update(0, { name: organizerName })
  }, [update, organizerName])

  const handleAddNewParticipant = (shouldFocus: boolean = false) => {
    setParticipantsHaveChanged(true)
    append(newParticipant, { shouldFocus })
  }

  const handleRemoveParticipant = (index: number) => {
    setParticipantsHaveChanged(true)
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
      <Typography sx={{ fontWeight: 'bold', mt: 2 }}>Enter your name:</Typography>
      <TextField
        label="Your name*"
        variant="filled"
        error={Boolean(errors.organizerName)}
        helperText={errors.organizerName?.message}
        inputProps={{
          ...register('organizerName', {
            required: 'Please enter your name',
          }),
        }}
      />
      <Typography sx={{ fontWeight: 'bold', mt: 4 }}>
        Other participants to draw names with:
      </Typography>
      {fields.map((field, index) => {
        const isOrganizerName = index === 0
        const currentParticipant = watch(`participants.${index}`)
        const extraProps: TextFieldProps = {}
        const inputProps = register(`participants.${index}.name`)

        if (isOrganizerName) {
          extraProps.InputLabelProps = { shrink: organizerName?.length > 0 }
        } else {
          extraProps.InputProps = {
            endAdornment: (fields.length > 3 || currentParticipant.name) && (
              <InputAdornment position="end">
                <IconButton tabIndex={-1} onClick={() => handleRemoveParticipant(index)}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }
        }

        const handleParticipantOnChange = (e: ChangeEvent<HTMLInputElement>) => {
          const isLastInput = index === fields.length - 1
          if (isLastInput && e.target.value.length > 0) {
            handleAddNewParticipant()
          } else {
            setParticipantsHaveChanged(true)
          }
          inputProps.onChange(e)
        }

        const handleParticipantOnBlur = (e: FocusEvent<HTMLInputElement>) => {
          if (errorMessage) validate()
          inputProps.onBlur(e)
        }

        return (
          <TextField
            key={field.id}
            label={isOrganizerName ? 'Your Name' : `Enter participant ${index + 1}`}
            variant="filled"
            disabled={isOrganizerName}
            inputProps={{
              ...inputProps,
              onChange: handleParticipantOnChange,
              onBlur: handleParticipantOnBlur,
            }}
            {...extraProps}
          />
        )
      })}
      <Button
        title="Add another participant"
        startIcon={<Add />}
        onClick={() => handleAddNewParticipant(true)}
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
