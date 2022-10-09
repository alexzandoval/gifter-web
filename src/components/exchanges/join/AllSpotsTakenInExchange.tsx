import { FC } from 'react'

import { AppTypography } from '@Components/common'

interface Props {
  organizerName?: string
}

const AllSpotsTakenInExchange: FC<Props> = ({ organizerName }) => (
  <AppTypography gutterBottom bold>
    All available spots in this exchange have already been taken. If you believe this is an error,
    please contact the organizer
    {organizerName && `, ${organizerName}`}.
  </AppTypography>
)

export default AllSpotsTakenInExchange
