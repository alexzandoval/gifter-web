import { FC } from 'react'
import { InputAdornment, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/lab'
import { Controller, useFormContext } from 'react-hook-form'

import { NewExchangeFormValues } from '../NewExchangeForm'

// const marks = [
//   {
//     value: 20,
//     label: '$20',
//   },
//   {
//     value: 50,
//     label: '$50',
//   },
//   {
//     value: 100,
//     label: '$100',
//   },
//   {
//     value: 150,
//     label: '$150+',
//   },
// ]

const ExchangeInformation: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<NewExchangeFormValues>()

  const allowOnlyNumber = (value: string): string =>
    value
      .replace(/[^0-9]/g, '')
      .replace(/^0+/, '')
      .slice(0, 5)

  // TODO: Add styling for titles
  return (
    <>
      <Typography>Your Group Name</Typography>
      <TextField
        label={`My Exchange Name ${new Date().getFullYear()}*`}
        variant="filled"
        error={Boolean(errors.information?.name)}
        helperText={errors.information?.name?.message}
        inputProps={{
          ...register('information.name', {
            required: 'Please enter a name for your exchange.',
          }),
        }}
      />
      <Typography>Budget</Typography>
      <Controller
        name="information.budget"
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Budget (optional)"
            variant="filled"
            onChange={(e) => field.onChange(allowOnlyNumber(e.target.value))}
            sx={{ width: 125 }}
            type="text"
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          />
        )}
      />
      {/* <Controller
        name="information.budget"
        defaultValue=""
        render={({ field }) => (
          <Slider
            {...field}
            onChange={(e, value) => {
              setBudget(allowOnlyNumber(value.toString()))
            }}
            step={5}
            max={150}
            valueLabelDisplay="auto"
            marks={marks}
          />
        )}
      /> */}
      <Typography>Date of the Exchange</Typography>
      <Controller
        name="information.date"
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="Select a Date (optional)"
            minDate={new Date()}
            renderInput={(params) => <TextField variant="filled" {...params} />}
          />
        )}
      />
      <Typography>Exchange Invitation Message/Description</Typography>
      <TextField
        label="Description (optional)"
        variant="filled"
        multiline
        rows={4}
        inputProps={register('information.description')}
      />
    </>
  )
}

export default ExchangeInformation
