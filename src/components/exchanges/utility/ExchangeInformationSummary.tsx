import { FC, useState } from 'react'
import {
  Box,
  Button,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'

import { Exchange } from 'ts/types'
import { AppTypography } from 'components/common'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { allowOnlyNumber, isServerValidationError } from 'utility'
import Api from 'services/Api'
import { LoadingButton } from '@mui/lab'
import useNotification from 'hooks/useNotification'

interface Props {
  exchange: Exchange
  onUpdate?: (exchange: Exchange) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  subheader: {
    color: theme.palette.text.secondary,
  },
  propertyHeader: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  informationSection: {
    marginBottom: theme.spacing(2),
  },
}))

export type UpdateExchangeFormValues = {
  name: Exchange['name']
  description?: Exchange['description']
  budget?: Exchange['budget']
  date?: Exchange['date']
  numberOfDraws: Exchange['numberOfDraws']
}

const ExchangeInformationSummary: FC<Props> = ({ exchange, onUpdate }) => {
  const classes = useStyles()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const notify = useNotification()

  const defaultValues: UpdateExchangeFormValues = {
    name: exchange.name,
    description: exchange.description,
    budget: exchange.budget,
    date: exchange.date,
    numberOfDraws: exchange.numberOfDraws,
  }
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  let date = null
  let description = null
  let budget = null
  let numberOfDraws = null

  const onSubmit: SubmitHandler<UpdateExchangeFormValues> = async (data) => {
    setUpdateIsLoading(true)
    try {
      const updatedExchange = await Api.exchanges.update({
        ...exchange,
        name: data.name,
        budget: data.budget ? Number(data.budget) : undefined,
        date: data.date || undefined,
        description: data.description,
        numberOfDraws: data.numberOfDraws,
      })
      if (onUpdate) onUpdate(updatedExchange)
      setIsEdit(false)
      notify.success('Exchange updated!')
    } catch (e) {
      notify.error('Something went wrong while updating Exchange. Please try again.')
      if (isServerValidationError(e)) {
        // setServerErrors(e.message)
      } else {
        // setServerErrors(['Something went wrong. Please try again.'])
      }
      // setShowServerErrors(true)
    } finally {
      setUpdateIsLoading(false)
    }
  }

  const name = isEdit ? (
    <TextField
      defaultValue={defaultValues.name}
      variant="standard"
      error={Boolean(errors.name)}
      helperText={errors.name?.message}
      inputProps={{
        ...register('name', {
          required: 'Please enter a name for your exchange.',
        }),
      }}
    />
  ) : (
    <AppTypography variant="h4">{exchange.name}</AppTypography>
  )

  if (exchange.date || isEdit) {
    date = (
      <AppTypography className={classes.subheader}>
        Exchange happening on{' '}
        {isEdit ? (
          <Controller
            name="date"
            control={control}
            defaultValue={defaultValues.date}
            render={({ field }) => (
              <DatePicker
                {...field}
                minDate={new Date()}
                renderInput={(params) => <TextField variant="standard" {...params} />}
              />
            )}
          />
        ) : (
          exchange.date && (
            <AppTypography bold>{format(new Date(exchange.date), 'MMMM d, yyyy')}</AppTypography>
          )
        )}
      </AppTypography>
    )
  }
  if (exchange.description || isEdit) {
    description = (
      <Box className={classes.informationSection}>
        <AppTypography className={classes.propertyHeader}>Description</AppTypography>
        {isEdit ? (
          <TextField
            defaultValue={defaultValues.description}
            variant="standard"
            multiline
            inputProps={register('description')}
          />
        ) : (
          <AppTypography>{exchange.description}</AppTypography>
        )}
      </Box>
    )
  }
  if (exchange.budget || isEdit) {
    budget = (
      <Box className={classes.informationSection}>
        <AppTypography className={classes.propertyHeader}>Gift Budget</AppTypography>
        {isEdit ? (
          <Controller
            name="budget"
            defaultValue={defaultValues.budget}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                onChange={(e) => field.onChange(allowOnlyNumber(e.target.value))}
                sx={{ width: 125 }}
                type="text"
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
            )}
          />
        ) : (
          <AppTypography>${exchange.budget}</AppTypography>
        )}
      </Box>
    )
  }
  if (exchange.numberOfDraws || isEdit) {
    numberOfDraws = (
      <Box className={classes.informationSection}>
        <AppTypography className={classes.propertyHeader}>Number of Draws</AppTypography>
        <AppTypography className={classes.subheader}>
          This is the number of people you will need to buy a gift for:
        </AppTypography>
        {isEdit ? (
          <Controller
            name="numberOfDraws"
            control={control}
            render={({ field }) => (
              <RadioGroup aria-labelledby="number-of-names-to-draw-group" {...field}>
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label="Zero, we won't be drawing names, we just want to share wishlists."
                />
                <FormControlLabel value={1} control={<Radio />} label="One Each" />
                {exchange.participants.length >= 3 && (
                  <FormControlLabel value={2} control={<Radio />} label="Two Each" />
                )}
              </RadioGroup>
            )}
          />
        ) : (
          <AppTypography>{exchange.numberOfDraws}</AppTypography>
        )}
      </Box>
    )
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {name}
      {date}
      {(description || budget || numberOfDraws) && (
        <AppTypography variant="h5" sx={{ marginBottom: 1, marginTop: 3 }}>
          Gift Exchange Information
        </AppTypography>
      )}
      {description}
      {budget}
      {numberOfDraws}
      <Button
        variant="contained"
        disabled={updateIsLoading}
        onClick={() => setIsEdit((prev) => !prev)}
      >
        {isEdit ? 'Cancel Edit' : 'Edit'}
      </Button>
      {isEdit && (
        <LoadingButton variant="contained" type="submit" loading={updateIsLoading}>
          Update
        </LoadingButton>
      )}
    </form>
  )
}

export default ExchangeInformationSummary
