import { setNavigate } from '@/utils/Navigation'
import { Outlet, useNavigate } from 'react-router-dom'

function GlobalContainer({ children }) {
  const NavigateHandler = () => {
    const navigate = useNavigate()
    setNavigate(navigate)
    return null
  }

  return (
    <>
      {children}
      <NavigateHandler />
    </>
  )
}

export default GlobalContainer
