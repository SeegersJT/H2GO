import { toast } from '@/hooks/use-toast'
import { navigateTo } from '@/utils/Navigation'
import axios, { AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'

import * as customersActions from '../actions/Customers.action'
import * as api from '@/utils/api/Customers.api'
import { GenericResponse } from '../types/GenericResponse.type'

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

  yield put(customersActions.setCustomersDataLoading(true))
}

export function* watchCustomersSaga() {
  yield takeEvery(customersActions.REQUEST_CUSTOMERS_DATA, customerDataRequestSaga)
}
