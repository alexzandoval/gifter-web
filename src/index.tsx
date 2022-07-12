// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import reportWebVitals from 'reportWebVitals'
import 'styles/index.css'

import App from 'App'
import { ColorSchemeContextProvider } from 'context/Theme'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  // <StrictMode>
  <ColorSchemeContextProvider>
    <App />
  </ColorSchemeContextProvider>,
  // </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
