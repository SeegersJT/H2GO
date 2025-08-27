import { To, NavigateOptions } from 'react-router-dom'

let navigateFunction: ((to: To, options?: NavigateOptions) => void) | null = null

export const setNavigate = (navigate: (to: To, options?: NavigateOptions) => void) => {
  navigateFunction = navigate
}

export const navigateTo = (to: To, options?: NavigateOptions) => {
  if (navigateFunction) {
    navigateFunction(to, options)
  } else {
    console.error('Navigation function is not set yet')
  }
}
