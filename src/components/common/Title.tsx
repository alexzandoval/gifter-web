import { Theme, Typography, TypographyProps } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { FC } from 'react'

interface Props extends TypographyProps {
  type?: 'main' | 'sub'
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  },
  main: {
    fontSize: '1.3rem',
  },
  sub: {
    fontSize: '1.1rem',
  },
}))

const Title: FC<Props> = (props) => {
  const { type = 'main', children, className, variant, ...other } = props
  const classes = useStyles()
  const isMain = type === 'main'
  const defaultVariant = isMain ? 'h3' : 'body1'
  const typographyVariant = variant || defaultVariant

  return (
    <Typography
      variant={typographyVariant}
      className={clsx(isMain ? classes.main : classes.sub, classes.root, className)}
      {...other}
    >
      {children}
    </Typography>
  )
}

export default Title
