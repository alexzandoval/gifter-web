import { FC, useState } from 'react'
import { Box, Button, Step, StepLabel, Stepper, Typography } from '@mui/material'

import { ucFirst } from 'utility/utility'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import ExchangeInformation from './steps/ExchangeInformation'
import AddParticipants from './steps/AddParticipants'
import ExchangeRules from './steps/ExchangeRules'

export type NewExchangeFormValues = {
  participants: { name: string }[]
  rules: {
    numberOfDraws: number
    participant1: string
    participant2: string
    participant3: string
    participant4: string
    participant5: string
  }
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
    },
    {
      name: '',
    },
    {
      name: '',
    },
  ],
}

const NewExchangeForm: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false)
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const reactHookForm = useForm({ defaultValues })
  const {
    clearErrors,
    handleSubmit,
    setError,
    trigger,
    watch,
    formState: { errors },
  } = reactHookForm

  const steps = [
    {
      label: 'Add Participants',
      component: <AddParticipants />,
      isValid: () => {
        // Check if there are at least 3 unique participants
        let error = ''
        const participants = watch('participants')
        const lessThanThreeParticipantsError =
          'You cannot create an exchange with less than 3 participants'
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
        clearErrors('participants')
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
      },
    },
    {
      label: 'Set Exchange Rules',
      component: <ExchangeRules />,
      isValid: () => {
        const error = ''
        return true
      },
    },
    {
      label: 'Exchange Information',
      component: <ExchangeInformation />,
      isValid: () => {
        const error = ''
        return true
      },
    },
  ]
  const isLastStep = activeStep === steps.length - 1

  const onSubmit: SubmitHandler<NewExchangeFormValues> = async (data, e) => {
    console.log(data, errors)
    //   clearErrors()
    //   if (!exchangeNameIsValid()) return
    //   setFormIsLoading(true)
    //   try {
    //     const newExchange = await Api.exchanges.create({
    //       name: exchangeName,
    //       budget: exchangeBudget ? Number(exchangeBudget) : undefined,
    //       date: exchangeDate || undefined,
    //     })
    //     history.push(routes.singleExchange.id(newExchange.id))
    //   } catch (e) {
    //     if (isServerValidationError(e)) {
    //       setServerErrors(e.message)
    //     } else {
    //       setServerErrors(['Something went wrong. Please try again.'])
    //     }
    //   } finally {
    //     setFormIsLoading(false)
    //   }
  }

  const handleNextStep = () => {
    if (steps[activeStep].isValid()) {
      setActiveStep((prev) => (prev === steps.length - 1 ? prev : prev + 1))
    }
  }

  const handlePreviousStep = () => {
    setActiveStep((prev) => (prev === 0 ? prev : prev - 1))
  }

  return (
    <>
      <Typography>
        Create a new gift exchange, set a date and budget, and invite your friends!
      </Typography>
      {serverErrors.length > 0 && (
        <Box mt={2}>
          {serverErrors.map((error) => (
            <Typography key={error} color="error">
              {ucFirst(error)}
            </Typography>
          ))}
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...reactHookForm}>
          <Stepper activeStep={activeStep} sx={{ marginTop: 4 }}>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box
            mt={4}
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
              <Button sx={{ minWidth: 150 }} variant="contained" type="submit">
                Create Exchange
              </Button>
            ) : (
              <Button onClick={handleNextStep} sx={{ minWidth: 150 }} variant="contained">
                Next
              </Button>
            )}
          </Box>
        </FormProvider>
      </form>
      {/* <LoadingButton
        loading={formIsLoading}
        variant="contained"
        disabled={formIsLoading}
        onClick={() => {
          console.log('Submitting')
        }}
      >
        Create
      </LoadingButton> */}
    </>
  )
}

export default NewExchangeForm
