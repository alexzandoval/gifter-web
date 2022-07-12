import { FC, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'

import { AppTypography } from 'components/common'
import useNotification from 'hooks/useNotification'
import Api from 'services/Api'
import { Exchange, Participant } from 'ts/types'

interface Props {
  exchange: Exchange
  unclaimedParticipants: Participant[]
  onSubmit: (exchange: Exchange) => void
}

const UserNotPartOfExchange: FC<Props> = ({ exchange, unclaimedParticipants, onSubmit }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string>('')
  const [joinExchangeLoading, setJoinExchangeLoading] = useState<boolean>(false)
  const notify = useNotification()

  const organizerName = exchange.participants.find(
    (p) => p.user?.uid === exchange.organizer.uid,
  )?.name

  const handleSelectParticipant = (event: SelectChangeEvent) => {
    setSelectedParticipant(event.target.value as string)
  }

  const handleJoinExchange = async () => {
    try {
      setJoinExchangeLoading(true)
      const updatedExchange = await Api.exchanges.postJoinExchange(exchange.id, selectedParticipant)
      onSubmit(updatedExchange)
      notify.success(
        `Successfully joined ${organizerName ? `${organizerName}'s` : 'the'} exchange!`,
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error joining exchange ::', e)
      notify.error('Error occurred while joining exchange, please try again later.')
    } finally {
      setJoinExchangeLoading(false)
    }
  }

  return (
    <>
      <Typography gutterBottom>
        To join this exchange, <AppTypography bold>select your name</AppTypography> below and hit{' '}
        <AppTypography bold>join</AppTypography>.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          maxWidth: 300,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <FormControl variant="filled" sx={{ minWidth: 200 }}>
          <InputLabel id="select-participant-label">Select Your Name</InputLabel>
          <Select
            labelId="select-participant-label"
            value={selectedParticipant}
            label="Select your name..."
            onChange={handleSelectParticipant}
          >
            {unclaimedParticipants.map((p) => (
              <MenuItem key={p.name} value={p.name}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LoadingButton
          loading={joinExchangeLoading}
          disabled={joinExchangeLoading || !selectedParticipant}
          variant="contained"
          onClick={handleJoinExchange}
        >
          Join
        </LoadingButton>
      </Box>
      <Typography>
        Don't see your name in the list? Check with the organizer,{' '}
        <AppTypography bold>{organizerName}</AppTypography>, so they can add you.
      </Typography>
    </>
  )
}

export default UserNotPartOfExchange
