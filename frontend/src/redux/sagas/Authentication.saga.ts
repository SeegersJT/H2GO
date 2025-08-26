// src/redux/sagas/Authentication.saga.ts
import axios, { AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as authActions from '@/redux/actions/Authentication.action'
import { toast } from '@/hooks/use-toast'
import * as confirmationTokenAction from '../actions/ConfirmationToken.action'
import * as type from '../types/Authentication.type'
import * as api from '@/utils/api/Authentication.api'

function* authenticationLoginRequestSaga(
  action: ReturnType<typeof authActions.requestAuthenticationLogin>,
) {
  yield put(authActions.setAuthenticationLoginLoading(true))

  try {
    const { payload, onSuccess } = action
    const [endpoint, requestOptions] = api.getAuthenticationLoginRequest(payload)

    const response: AxiosResponse<type.AuthLoginResponse> = yield call(axios.request, {
      url: endpoint,
      ...requestOptions,
    })
    const { data, status, message } = response.data

    yield put(confirmationTokenAction.setConfirmationToken(data))
    toast({ title: status, description: message, variant: 'success' })

    yield call(onSuccess)
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({ title: errorData?.message, description: errorData?.error, variant: 'error' })
  }

  yield put(authActions.setAuthenticationLoginLoading(false))
}

// watcher
export function* watchAuthSagas() {
  yield takeEvery(authActions.REQUEST_AUTH_LOGIN, authenticationLoginRequestSaga)
}
