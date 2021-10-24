import { FC } from 'react'
import { Button, ButtonProps, useTheme } from '@mui/material'
import { Apple, Email, FacebookOutlined } from '@mui/icons-material'
import { SxProps } from '@mui/system'

import GoogleIcon from 'components/icons/GoogleIcon'

interface Props extends ButtonProps {
  provider: 'email' | 'google' | 'apple' | 'facebook'
}

type ProviderAttributes = {
  [key in Props['provider']]: {
    Icon: FC
    style?: SxProps
  }
}

const SocialProviderButton: FC<Props> = ({ provider, ...other }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const providerAttributes: ProviderAttributes = {
    email: {
      Icon: Email,
    },
    google: {
      Icon: GoogleIcon,
      style: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.getContrastText(theme.palette.common.white),
        '&:hover': {
          backgroundColor: '#E6E6E6',
        },
      },
    },
    apple: {
      Icon: Apple,
      style: {
        backgroundColor: isDark ? theme.palette.common.white : theme.palette.common.black,
        color: theme.palette.getContrastText(
          isDark ? theme.palette.common.white : theme.palette.common.black,
        ),
        '&:hover': {
          backgroundColor: isDark ? '#E6E6E6' : '#171717',
        },
      },
    },
    facebook: {
      Icon: FacebookOutlined,
      style: {
        backgroundColor: '#1777F3',
        '&:hover': {
          backgroundColor: '#146AD8',
        },
      },
    },
  }
  const { Icon, style } = providerAttributes[provider]

  return <Button startIcon={<Icon />} variant="contained" sx={style} {...other} />
}

export default SocialProviderButton
