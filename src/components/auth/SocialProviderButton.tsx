import { FC } from 'react'
import { useTheme } from '@mui/material'
import { Apple, Email, FacebookOutlined } from '@mui/icons-material'
import { SxProps } from '@mui/system'

import GoogleIcon from 'components/icons/GoogleIcon'
import LoadingButton, { LoadingButtonProps } from 'components/shared/LoadingButton'
import { SocialProvider } from 'ts/enums'

interface Props extends LoadingButtonProps {
  loading?: boolean
  provider: SocialProvider
}

type ProviderAttributes = {
  [key in Props['provider']]: {
    Icon: FC
    style?: SxProps
  }
}

const SocialProviderButton: FC<Props> = ({ loading, provider, ...other }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const providerAttributes: ProviderAttributes = {
    [SocialProvider.EMAIL]: {
      Icon: Email,
    },
    [SocialProvider.GOOGLE]: {
      Icon: GoogleIcon,
      style: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.getContrastText(theme.palette.common.white),
        '&:hover': {
          backgroundColor: '#E6E6E6',
        },
      },
    },
    [SocialProvider.APPLE]: {
      Icon: Apple,
      style: {
        backgroundColor: isDark ? theme.palette.common.white : theme.palette.common.black,
        color: theme.palette.getContrastText(
          isDark ? theme.palette.common.white : theme.palette.common.black,
        ),
        '&:hover': {
          backgroundColor: isDark ? '#E6E6E6' : '#323232',
        },
      },
    },
    [SocialProvider.FACEBOOK]: {
      Icon: FacebookOutlined,
      style: {
        backgroundColor: '#1777F3',
        '&:hover': {
          backgroundColor: '#135DBF',
        },
      },
    },
  }
  const { Icon, style } = providerAttributes[provider]

  return (
    <LoadingButton
      loading={loading}
      startIcon={<Icon />}
      variant="contained"
      sx={style}
      {...other}
    />
  )
}

export default SocialProviderButton
