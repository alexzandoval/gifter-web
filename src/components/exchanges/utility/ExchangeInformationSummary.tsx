/* eslint-disable react/jsx-no-duplicate-props */
import { FC, useEffect, useMemo, useState } from 'react'
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
import { LoadingButton } from '@mui/lab'
import clsx from 'clsx'
import { format } from 'date-fns'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { useAuth } from '@Context/Auth'
import { AppTypography } from '@Components/common'
import useNotification from '@Hooks/useNotification'
import { ExchangeService } from '@Services'
import { Exchange } from '@Types'
import { allowOnlyNumber, isNullOrUndefined, isServerValidationError } from '@Utility'

interface Props {
  exchange: Exchange
  onUpdate?: (exchange: Exchange) => void
}

const textfieldPadding = { padding: '0.5rem' }

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    fontSize: '2rem',
  },
  textfieldPadding,
  subheader: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
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

const getDefaultValues = (exchange: Exchange): UpdateExchangeFormValues => ({
  name: exchange.name,
  description: exchange.description,
  budget: exchange.budget,
  date: exchange.date,
  numberOfDraws: exchange.numberOfDraws,
})

const ExchangeInformationSummary: FC<Props> = ({ exchange, onUpdate }) => {
  const classes = useStyles()
  const { user } = useAuth()
  const defaultValues = useMemo(() => getDefaultValues(exchange), [exchange])
  const [inEditMode, setInEditMode] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const notify = useNotification()
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (!inEditMode) {
      reset(defaultValues)
    }
  }, [inEditMode, defaultValues, reset])

  let date = null
  let description = null
  let budget = null
  let numberOfDraws = null

  const onUpdateExchange: SubmitHandler<UpdateExchangeFormValues> = async (data) => {
    setUpdateIsLoading(true)
    try {
      const updatedExchange = await ExchangeService.update({
        ...exchange,
        name: data.name,
        budget: data.budget ? Number(data.budget) : undefined,
        date: data.date || undefined,
        description: data.description,
        numberOfDraws: data.numberOfDraws,
      })
      if (onUpdate) onUpdate(updatedExchange)
      setInEditMode(false)
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

  const name = inEditMode ? (
    <TextField
      defaultValue={defaultValues.name}
      variant="outlined"
      fullWidth
      error={Boolean(errors.name)}
      helperText={errors.name?.message}
      InputProps={{
        classes: { input: clsx(classes.header, classes.textfieldPadding) },
      }}
      inputProps={{
        ...register('name', {
          required: 'Please enter a name for your exchange.',
        }),
      }}
    />
  ) : (
    <AppTypography variant="h2" className={classes.header}>
      {exchange.name}
    </AppTypography>
  )

  if (exchange.date || inEditMode) {
    date = (
      <Box display="flex" flexDirection="row" mt={1}>
        <AppTypography className={classes.subheader}>
          Exchange happening on{' '}
          {!inEditMode && exchange.date && (
            <AppTypography bold>{format(new Date(exchange.date), 'MMMM d, yyyy')}</AppTypography>
          )}
        </AppTypography>
        {inEditMode && (
          <Controller
            name="date"
            control={control}
            defaultValue={defaultValues.date}
            render={({ field }) => (
              <DatePicker
                {...field}
                minDate={new Date()}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    sx={{ '.MuiInputBase-input': textfieldPadding, ml: 1 }}
                    {...params}
                  />
                )}
              />
            )}
          />
        )}
      </Box>
    )
  }
  if (exchange.description || inEditMode) {
    description = (
      <Box className={classes.informationSection}>
        <AppTypography className={classes.propertyHeader}>Description</AppTypography>
        {inEditMode ? (
          <TextField
            defaultValue={defaultValues.description}
            variant="outlined"
            multiline
            fullWidth
            InputProps={{
              classes: { root: classes.textfieldPadding },
            }}
            inputProps={register('description')}
          />
        ) : (
          <AppTypography sx={{ whiteSpace: 'pre-line' }}>{exchange.description}</AppTypography>
        )}
      </Box>
    )
  }
  if (exchange.budget || inEditMode) {
    budget = (
      <Box className={classes.informationSection}>
        <AppTypography className={classes.propertyHeader}>Gift Budget</AppTypography>
        {inEditMode ? (
          <Controller
            name="budget"
            defaultValue={defaultValues.budget}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                onChange={(e) => field.onChange(allowOnlyNumber(e.target.value))}
                sx={{ width: 125 }}
                type="text"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  classes: { input: classes.textfieldPadding },
                }}
              />
            )}
          />
        ) : (
          <AppTypography>${exchange.budget}</AppTypography>
        )}
      </Box>
    )
  }
  if (!isNullOrUndefined(exchange.numberOfDraws) || inEditMode) {
    const currentNumberOfDraws = watch('numberOfDraws')
    numberOfDraws = (
      <Box className={classes.informationSection}>
        <AppTypography className={classes.propertyHeader}>Number of Draws</AppTypography>
        <AppTypography className={classes.subheader}>
          {+currentNumberOfDraws === 0
            ? 'You will not be drawing names for this exchange.'
            : `You will be buying a gift for ${currentNumberOfDraws} ${
                currentNumberOfDraws > 1 ? 'people.' : 'person.'
              }`}
        </AppTypography>
        {inEditMode && (
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
        )}
      </Box>
    )
  }
  return (
    <form onSubmit={handleSubmit(onUpdateExchange)}>
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
      {user && user.uid === exchange.organizer.uid && (
        <>
          <Button
            sx={{ margin: '4px' }}
            variant="contained"
            disabled={updateIsLoading}
            onClick={() => setInEditMode((prev) => !prev)}
          >
            {inEditMode ? 'Cancel Edit' : 'Edit'}
          </Button>
          {inEditMode && (
            <LoadingButton
              sx={{ margin: '4px' }}
              variant="contained"
              type="submit"
              loading={updateIsLoading}
            >
              Update Exchange
            </LoadingButton>
          )}
        </>
      )}
    </form>
  )
}

export default ExchangeInformationSummary
