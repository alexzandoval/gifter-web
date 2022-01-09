import { ChangeEvent, FC, useState } from 'react'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Input,
  Slider,
  TextField,
  Theme,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/lab'
import { makeStyles } from '@mui/styles'
import { useHistory } from 'react-router-dom'

import Api from 'services/Api'
import routes from 'constants/routes'
import LoadingButton from 'components/shared/LoadingButton'
import { isServerValidationError, ucFirst } from 'utility/utility'

interface Props extends DialogProps {}

const marks = [
  {
    value: 20,
    label: '$20',
  },
  {
    value: 50,
    label: '$50',
  },
  {
    value: 100,
    label: '$100',
  },
  {
    value: 150,
    label: '$150+',
  },
]

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    marginTop: theme.spacing(4),
  },
}))

const NewExchangeDialog: FC<Props> = ({ ...other }) => {
  const classes = useStyles()
  const history = useHistory()
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false)
  const [exchangeName, setExchangeName] = useState<string>('')
  const [exchangeNameError, setExchangeNameError] = useState<string>('')
  const [exchangeBudget, setExchangeBudget] = useState<number | string | number[] | null>('')
  const [exchangeDate, setExchangeDate] = useState<Date | null>(null)
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const getValueText = (value: number) => `$${value}`

  const clearErrors = () => {
    setExchangeNameError('')
    setServerErrors([])
  }

  const exchangeNameIsValid = () => {
    if (!exchangeName) {
      setExchangeNameError('Exchange name is required.')
      return false
    }
    return true
  }

  const updateBudget = (value: number | string) => {
    setExchangeBudget(['', '0', 0].includes(value) ? '' : Number(value))
  }

  const handleExchangeNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExchangeNameError('')
    setExchangeName(e.target.value)
  }

  const handleBudgetSliderChange = (e: Event, value: number | number[]) => {
    updateBudget(Array.isArray(value) ? 0 : value)
  }

  const handleBudgetInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    // Allows the user to backspace to empty the input
    if (e.target.value === '' || value) updateBudget(value)
  }

  const handleSubmit = async () => {
    clearErrors()
    if (!exchangeNameIsValid()) return
    setFormIsLoading(true)
    try {
      const newExchange = await Api.exchanges.create({
        name: exchangeName,
        budget: exchangeBudget ? Number(exchangeBudget) : undefined,
        date: exchangeDate || undefined,
      })
      history.push(routes.singleExchange.id(newExchange.id))
    } catch (e) {
      if (isServerValidationError(e)) {
        setServerErrors(e.message)
      } else {
        setServerErrors(['Something went wrong. Please try again.'])
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  return (
    <Dialog {...other}>
      <DialogTitle>Create Exchange</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a new gift exchange, set a date and budget, and invite your friends!
        </DialogContentText>
        {serverErrors.length > 0 && (
          <Box mt={2}>
            {serverErrors.map((error) => (
              <Typography key={error} color="error">
                {ucFirst(error)}
              </Typography>
            ))}
          </Box>
        )}
        <TextField
          className={classes.input}
          type="text"
          autoFocus
          disabled={formIsLoading}
          variant="filled"
          label="Exchange Name"
          error={Boolean(exchangeNameError)}
          helperText={exchangeNameError}
          value={exchangeName}
          onChange={handleExchangeNameChange}
        />
        <Typography id="gift-exchange-budget" gutterBottom className={classes.input}>
          Budget
        </Typography>
        <Input
          sx={{ width: 65, marginLeft: 'auto' }}
          type="text"
          disabled={formIsLoading}
          value={exchangeBudget}
          onChange={handleBudgetInputChange}
          startAdornment="$"
          inputProps={{
            'aria-labelledby': 'gift-exchange-budget',
          }}
        />
        <Slider
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
        />
        <Box className={classes.input}>
          <DatePicker
            label="Exchange Date"
            disabled={formIsLoading}
            value={exchangeDate}
            minDate={new Date()}
            onChange={setExchangeDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={formIsLoading}
          variant="contained"
          disabled={formIsLoading}
          onClick={handleSubmit}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default NewExchangeDialog
