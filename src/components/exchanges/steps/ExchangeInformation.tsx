import { DatePicker } from '@mui/lab'
import { Box, Input, TextField, Theme, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
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

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    marginTop: theme.spacing(4),
  },
}))

const ExchangeInformation = () => {
  const classes = useStyles()
  const {
    register,
    formState: { errors },
  } = useFormContext<NewExchangeFormValues>()

  const allowOnlyNumber = (value: string): string => value.replace(/[^0-9]/g, '').replace(/^0+/, '')

  return (
    <>
      <TextField
        className={classes.input}
        variant="filled"
        label="Exchange Name"
        error={Boolean(errors.information?.name)}
        helperText={errors.information?.name?.message}
        inputProps={{
          ...register('information.name', {
            required: 'Please enter a name for your exchange.',
          }),
        }}
      />
      <Typography id="gift-exchange-budget" gutterBottom className={classes.input}>
        Budget
      </Typography>
      <Controller
        name="information.budget"
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            onChange={(e) => field.onChange(allowOnlyNumber(e.target.value))}
            sx={{ width: 65, marginLeft: 'auto' }}
            type="text"
            startAdornment="$"
            inputProps={{
              'aria-labelledby': 'gift-exchange-budget',
            }}
          />
        )}
      />
      {/* <Slider
        aria-labelledby="gift-exchange-budget"
        disabled={formIsLoading}
        sx={{ display: 'none' }}
        defaultValue={20}
        getAriaValueText={getValueText}
        step={5}
        max={150}
        valueLabelDisplay="auto"
        marks={marks}
        value={typeof exchangeBudget === 'number' ? exchangeBudget : 0}
        onChange={handleBudgetSliderChange}
      /> */}
      <Box className={classes.input}>
        <Controller
          name="information.date"
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Exchange Date"
              minDate={new Date()}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
      </Box>
    </>
  )
}

export default ExchangeInformation
