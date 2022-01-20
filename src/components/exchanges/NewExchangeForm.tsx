import { FC, useState } from 'react'
import { Box, Button, Step, StepLabel, Stepper, Typography } from '@mui/material'

import { ucFirst } from 'utility/utility'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import ExchangeInformation from './steps/ExchangeInformation'
import AddParticipants from './steps/AddParticipants'
import ExchangeRules from './steps/ExchangeRules'

const steps = [
  {
    label: 'Add Participants',
    component: <AddParticipants />,
  },
  {
    label: 'Set Exchange Rules',
    component: <ExchangeRules />,
  },
  {
    label: 'Exchange Information',
    component: <ExchangeInformation />,
  },
]

export type NewExchangeFormValues = {
  participants: {
    participant1: string
    participant2: string
    participant3: string
    participant4: string
    participant5: string
  }
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

const NewExchangeForm: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false)
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const reactHookForm = useForm()
  const {
    handleSubmit,
    formState: { errors },
  } = reactHookForm
  const isLastStep = activeStep === steps.length - 1
  console.log(errors)

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
    setActiveStep((prev) => (prev === steps.length - 1 ? prev : prev + 1))
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
            {steps.map((step, index) => (
              <Step key={step.label} onClick={() => setActiveStep(index)}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box mt={4} mb={4} minHeight={300}>
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
