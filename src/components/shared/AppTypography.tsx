import { Typography, TypographyProps } from '@mui/material'
import { FC } from 'react'

interface Props extends TypographyProps {
  bold?: boolean
}

const AppTypography: FC<Props> = (props) => {
  const { bold, children, sx, ...other } = props

  // Bug with typography types, component is not found
  const typographyProps: TypographyProps & { component?: string } = {
    sx: {
      fontWeight: bold ? 'bold' : 'normal',
      ...sx,
    },
    ...other,
  }

  if (bold) {
    typographyProps.component = 'span'
  }

  return <Typography {...typographyProps}>{children}</Typography>
}

export default AppTypography
