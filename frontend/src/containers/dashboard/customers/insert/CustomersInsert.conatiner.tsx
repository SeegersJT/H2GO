import CustomersInsert from '@/components/dashboard/customers/insert/CustomersInsert.component'
import { requestCustomerInsert } from '@/redux/actions/Customers.action'
import { RootState } from '@/redux/Store.redux'
import { defaultCustomeInsertData } from '@/redux/types/defaults/Customer.default'
import { navigateTo } from '@/utils/Navigation'
import { Utils } from '@/utils/Utils'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function CustomersInsertContainer() {
  const dispatch = useDispatch()

  const { branch_id } = useSelector((state: RootState) => state.user)
  const { customerInsertLoading } = useSelector((state: RootState) => state.customers)

  const [insertCustomerData, setInsertCustomerData] = useState({ ...defaultCustomeInsertData })
  const [customerDataErrors, setCustomerDataErrors] = useState<Record<string, string>>({})
  const [canInsertCustomerData, setCanInsertCustomerData] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const handleOnInsertCustomerDataChange = (key: string, value: any) => {
    setInsertCustomerData((prev) => ({ ...prev, [key]: value }))

    handleValidateInsertCustomerData(key, value)
  }

  const handleValidateInsertCustomerData = (key: string, value: any) => {
    let error = ''

    if (typeof value === 'string' && Utils.hasLeadingOrTrailingSpaces(value)) {
      error = 'No leading or trailing spaces allowed *'
    }

    if (!error) {
      switch (key) {
        case 'name':
        case 'surname':
          if (!value) {
            error = 'Required *'
          } else if (!/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/.test(value)) {
            error = 'Must start with a capital letter (Capital Case) *'
          }
          break

        case 'id_number':
          if (!value) {
            error = 'Required *'
          } else if (!Utils.isValidSouthAfricanID(value)) {
            error = 'Invalid South African ID Number *'
          }
          break

        case 'email_address':
          if (!/^\S+@\S+\.\S+$/.test(value)) {
            error = 'Invalid Email Address *'
          }
          break

        case 'mobile_number':
          if (!/^(?:\+27|27|0)(6|7|8)\d{8}$/.test(value)) {
            error = 'Invalid South African Mobile Number *'
          }
          break

        case 'gender':
          if (!value) error = 'Required *'
          break

        default:
          break
      }
    }

    setCustomerDataErrors((prev) => ({ ...prev, [key]: error }))
  }

  const handleValidateAllInsertCustomerData = () => {
    let valid = true
    Object.entries(insertCustomerData).forEach(([key, value]) => {
      handleValidateInsertCustomerData(key, value)
      if (!value || customerDataErrors[key]) valid = false
    })

    return valid
  }

  const handleOnInsertCustomerData = () => {
    setShowErrors(true)

    const isValid = handleValidateAllInsertCustomerData()

    if (isValid) {
      dispatch(requestCustomerInsert(insertCustomerData))
    }
  }

  const handleOnNavigateToCustomerHome = () => {
    navigateTo('/dashboard/customers/home')
  }

  useEffect(() => {
    handleOnInsertCustomerDataChange('branch_id', branch_id)
  }, [branch_id])

  useEffect(() => {
    const isValid = handleValidateAllInsertCustomerData()
    setCanInsertCustomerData(isValid)
  }, [insertCustomerData])

  return (
    <CustomersInsert
      insertCustomerData={insertCustomerData}
      customerDataErrors={customerDataErrors}
      canInsertCustomerData={canInsertCustomerData}
      showErrors={showErrors}
      customerInsertLoading={customerInsertLoading}
      onInsertCustomerDataChange={handleOnInsertCustomerDataChange}
      onInsertCustomerData={handleOnInsertCustomerData}
      handleOnNavigateToCustomerHome={handleOnNavigateToCustomerHome}
    />
  )
}

export default CustomersInsertContainer
