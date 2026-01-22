import { toast } from '@/hooks/use-toast'
import axios, { AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as customersActions from '../actions/Customers.action'
import * as api from '@/utils/api/Customers.api'
import { GenericResponse } from '../types/GenericResponse.type'
import { navigateTo } from '@/utils/Navigation'

function* customerDataRequestSaga() {
  yield put(customersActions.setCustomersDataLoading(true))

  try {
    const [endpoint, requestOptions] = api.getCustomersRequest()

    const response: AxiosResponse<GenericResponse> = yield call(axios.request, { url: endpoint, ...requestOptions })
    const { data } = response.data

    yield put(customersActions.setCustomersData(data))
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({
      title: errorData?.message || 'Invalid token',
      description: errorData?.error,
      variant: 'warning',
    })
  }

  yield put(customersActions.setCustomersDataLoading(false))
}

function* customerInsertRequestSaga(action: ReturnType<typeof customersActions.requestCustomerInsert>) {
  yield put(customersActions.setCustomerInserLoading(true))

  const { payload } = action

  try {
    const [endpoint, requestOptions] = api.getCustomerInsertRequest(payload)

    const response: AxiosResponse<GenericResponse> = yield call(axios.request, { url: endpoint, ...requestOptions })

    const { status, message } = response.data

    toast({ title: status, description: message, variant: 'success' })

    navigateTo('/dashboard/customers/home')
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({
      title: errorData?.message || 'Invalid token',
      description: errorData?.error,
      variant: 'warning',
    })
  }

  yield put(customersActions.setCustomerInserLoading(false))
}

export function* watchCustomersSaga() {
  yield takeEvery(customersActions.REQUEST_CUSTOMERS_DATA, customerDataRequestSaga)
  yield takeEvery(customersActions.REQUEST_CUSTOMER_INSERT, customerInsertRequestSaga)
}
