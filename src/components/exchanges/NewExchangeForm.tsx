import { FC, useState } from 'react'
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Grow,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import LoadingButton from 'components/shared/LoadingButton'
import routes from 'constants/routes'
import Api from 'services/Api'
import { isServerValidationError, ucFirst } from 'utility/utility'
import AddParticipants from './steps/AddParticipants'
import ExchangeRules from './steps/ExchangeRules'
import ExchangeInformation from './steps/ExchangeInformation'

export type ExclusionParticipant = {
  name: string
  excludes: { name: string }[]
}

export type Rules = {
  numberOfDraws: number
  addExclusions: boolean
}

export type NewExchangeFormValues = {
  organizerName: string
  participants: ExclusionParticipant[]
  rules: Rules
  information: {
    name: string
    budget: number
    date: Date
  }
}

const defaultValues: Partial<NewExchangeFormValues> = {
  participants: [
    {
      name: '',
      excludes: [],
    },
    {
      name: '',
      excludes: [],
    },
    {
      name: '',
      excludes: [],
    },
  ],
  rules: {
    numberOfDraws: 1,
    addExclusions: false,
  },
}

const NewExchangeForm: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false)
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const [showServerErrors, setShowServerErrors] = useState<boolean>(false)
  const [nextStepIsLoading, setNextStepIsLoading] = useState<boolean>(false)
  const history = useHistory()
  const reactHookForm = useForm({ defaultValues })
  const { clearErrors, handleSubmit, setError, trigger, watch } = reactHookForm
  const participants = watch('participants')
  const rules = watch('rules')

  const addParticipantsIsValid = () => {
    // Check if there are at least 3 unique participants
    let error = ''
    const lessThanThreeParticipantsError =
      'You cannot create an exchange with less than 3 participants'
    clearErrors(['participants', 'organizerName'])
    if (!participants || participants.length < 3) {
      error = lessThanThreeParticipantsError
    } else {
      // Removing empty and whitespace names
      const names = participants.map((p) => p.name.trim()).filter((n) => n)
      const uniqueNames = new Set(names)
      if (uniqueNames.size < 3) {
        error = lessThanThreeParticipantsError
      }
      if (names.length !== uniqueNames.size) {
        error = 'All names must be unique'
      }
    }
    if (error) {
      if (participants) {
        setError('participants', {
          type: 'onChange',
          message: error,
        })
      }
      return false
    }
    return true
  }

  const steps = [
    {
      label: 'Add Participants',
      component: <AddParticipants validate={addParticipantsIsValid} />,
      isValid: addParticipantsIsValid,
      isValidAsync: async () => {
        const isValid = await trigger(['participants', 'organizerName'], { shouldFocus: true })
        return isValid
      },
    },
    {
      label: 'Set Exchange Rules',
      component: <ExchangeRules />,
      isValidAsync: async () => {
        let error = ''
        clearErrors('rules')
        if (participants && rules) {
          let isValidDraw = false
          try {
            setNextStepIsLoading(true)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await Api.exchanges.checkExclusions(participants, rules)
            isValidDraw = result.isValid
            if (!isValidDraw) {
              throw new Error('Invalid draw')
            }
          } catch (e) {
            if (isServerValidationError(e) || !isValidDraw) {
              error =
                'Draw is not possible with the current exclusions you have set. Try removing or modifying some of them.'
            } else {
              error = 'There was an error validating your exchange. Please try again later.'
            }
          } finally {
            setNextStepIsLoading(false)
          }
        } else {
          error =
            'Something went wrong. Please make sure you have added participants and selected your desired rules.'
        }

        if (error) {
          setError('rules', {
            type: 'onChange',
            message: error,
          })
          return false
        }
        return true
      },
    },
    {
      label: 'Exchange Information',
      component: <ExchangeInformation />,
      isValidAsync: async () => {
        clearErrors('information')
        const isValid = await trigger('information', { shouldFocus: true })
        return isValid
      },
    },
  ]
  const isLastStep = activeStep === steps.length - 1

  const onSubmit: SubmitHandler<NewExchangeFormValues> = async (data) => {
    setFormIsLoading(true)
    try {
      const newExchange = await Api.exchanges.create({
        name: data.information.name,
        budget: data.information.budget ? Number(data.information.budget) : undefined,
        date: data.information.date || undefined,
        participants: data.participants,
        ...data.rules,
      })
      history.push(routes.singleExchange.id(newExchange.id))
    } catch (e) {
      if (isServerValidationError(e)) {
        setServerErrors(e.message)
      } else {
        setServerErrors(['Something went wrong. Please try again.'])
      }
      setShowServerErrors(true)
    } finally {
      setFormIsLoading(false)
    }
  }

  const handleNextStep = async () => {
    let stepIsValid = true
    let stepIsValidAsync = true
    const { isValid, isValidAsync } = steps[activeStep]
    if (isValid) {
      stepIsValid = isValid()
    }
    if (isValidAsync) {
      stepIsValidAsync = await isValidAsync()
    }
    if (stepIsValid && stepIsValidAsync) {
      setActiveStep((prev) => (prev === steps.length - 1 ? prev : prev + 1))
    }
  }

  const handlePreviousStep = () => {
    setActiveStep((prev) => (prev === 0 ? prev : prev - 1))
  }

  const handleCloseServerErrors = () => {
    setShowServerErrors(false)
    setTimeout(() => setServerErrors([]), 5000)
  }

  return (
    <>
      <Typography>
        Create a new gift exchange, set a date and budget, and invite your friends!
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...reactHookForm}>
          <Stepper activeStep={activeStep} sx={{ marginTop: 4 }}>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grow in={showServerErrors} unmountOnExit>
            <Paper sx={{ mt: 3, mb: 2 }} elevation={2}>
              <CardContent sx={{ marginBottom: 0, paddingBottom: 0 }}>
                The following errors occurred when creating your exchange. Please go back and make
                sure you have entered valid information before submitting again.
                <ul>
                  {serverErrors.map((error) => (
                    <Typography key={error} color="error">
                      <li>{ucFirst(error)}</li>
                    </Typography>
                  ))}
                </ul>
              </CardContent>
              <CardActions sx={{ paddingTop: 0 }}>
                <Button sx={{ marginLeft: 'auto' }} onClick={handleCloseServerErrors}>
                  OK
                </Button>
              </CardActions>
            </Paper>
          </Grow>
          <Box
            mt={2}
            mb={4}
            minHeight={300}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& > *:not(p)': { marginTop: 2, marginBottom: 1, maxWidth: 400 },
            }}
          >
            {steps[activeStep]?.component}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: 350,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Button onClick={handlePreviousStep} disabled={activeStep === 0} sx={{ minWidth: 150 }}>
              Back
            </Button>
            {isLastStep ? (
              <LoadingButton
                loading={formIsLoading}
                disabled={formIsLoading}
                sx={{ minWidth: 150 }}
                variant="contained"
                type="submit"
              >
                Create Exchange
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={nextStepIsLoading}
                disabled={nextStepIsLoading}
                onClick={handleNextStep}
                sx={{ minWidth: 150 }}
                variant="contained"
              >
                Next
              </LoadingButton>
            )}
          </Box>
        </FormProvider>
      </form>
    </>
  )
}

export default NewExchangeForm
