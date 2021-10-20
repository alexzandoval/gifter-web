import React from 'react'
import { HiddenProps } from '@mui/material'

declare module '@mui/material/styles/createMixins' {
  export interface Mixins {
    header: {
      height: React.CSSProperties['height']
    }
    drawer: {
      hidden: HiddenProps
      hiddenBreakpoint: string
      visibleBreakpoint: string
      width: React.CSSProperties['width']
    }
  }

  export interface MixinsOptions extends Partial<Mixins> {}
}

declare module '@mui/material/styles/createMuiTheme' {
  export interface Theme {}
  // adding custom properties to `createMuiTheme`
  export interface DeprecatedThemeOptions extends Partial<Theme> {}
}
