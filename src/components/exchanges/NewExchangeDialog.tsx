import { ChangeEvent, FC, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid,
  Input,
  Slider,
  TextField,
  Theme,
  Typography,
} from '@mui/material'

import Api from 'services/Api'
import { Exchange } from 'ts/api'
import routes from 'constants/routes'
import { DatePicker } from '@mui/lab'
import { makeStyles } from '@mui/styles'

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
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false)
  const [exchangeName, setExchangeName] = useState<string>('')
  const [exchangeBudget, setExchangeBudget] = useState<number | string | number[]>('')
  const [exchangeDate, setExchangeDate] = useState<Date | null>(null)

  const getValueText = (value: number) => `$${value}`

  const updateBudget = (value: number | string) => {
    setExchangeBudget(['', '0', 0].includes(value) ? '' : Number(value))
  }

  const handleBudgetSliderChange = (e: Event, value: number | number[]) => {
    updateBudget(Array.isArray(value) ? 0 : value)
  }

  const handleBudgetInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateBudget(e.target.value)
  }

  return (
    <Dialog {...other}>
      <DialogTitle>Create Exchange</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a new gift exchange, set a date and budget, and invite your friends!
        </DialogContentText>
        <TextField
          className={classes.input}
          type="text"
          disabled={formIsLoading}
          variant="filled"
          label="Exchange Name"
          value={exchangeName}
          onChange={(e) => setExchangeName(e.target.value)}
        />
        <Typography id="gift-exchange-budget" gutterBottom className={classes.input}>
          Budget
        </Typography>
        <Grid container spacing={4} alignItems="center">
          {/* <Grid item xs={12} sm> */}
          <Grid item xs>
            <Slider
              aria-labelledby="gift-exchange-budget"
              disabled={formIsLoading}
              defaultValue={20}
              getAriaValueText={getValueText}
              step={5}
              max={150}
              valueLabelDisplay="auto"
              marks={marks}
              value={typeof exchangeBudget === 'number' ? exchangeBudget : 0}
              onChange={handleBudgetSliderChange}
            />
          </Grid>
          <Grid item>
            <Input
              sx={{ width: 65 }}
              type="number"
              disabled={formIsLoading}
              value={exchangeBudget}
              onChange={handleBudgetInputChange}
              startAdornment="$"
              inputProps={{
                step: 5,
                min: 0,
                type: 'number',
                'aria-labelledby': 'gift-exchange-budget',
              }}
            />
          </Grid>
        </Grid>
        <Box className={classes.input}>
          <DatePicker
            label="Exchange Date"
            disabled={formIsLoading}
            value={exchangeDate}
            onChange={setExchangeDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disabled={formIsLoading} onClick={() => setExchangeName('')}>
          Clear
        </Button>
        <Button
          variant="contained"
          disabled={formIsLoading}
          onClick={() => {
            setFormIsLoading(true)
            Api.exchanges
              .create({
                name: exchangeName,
                budget: Number(exchangeBudget),
                date: exchangeDate || undefined,
              })
              .then((exchange: Exchange) => {
                setFormIsLoading(false)
                window.location.href = routes.singleExchange.id(exchange.id)
              })
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewExchangeDialog
