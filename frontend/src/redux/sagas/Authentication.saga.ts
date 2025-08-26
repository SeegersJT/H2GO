// src/redux/sagas/Authentication.saga.ts
import axios, { AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as authActions from '@/redux/actions/Authentication.action'
import * as api from '@/utils/api/Authentication.api'
import type {
  AuthLoginResponse,
  AuthLoginCallbackResponse,
} from '@/redux/types/Authentication.type'

function* authenticationLoginRequestSaga(
  action: ReturnType<typeof authActions.requestAuthenticationLogin>,
) {
  yield put(authActions.setAuthenticationLoginLoading(true))

  try {
    const { payload, onResponse } = action
    const [endpoint, requestOptions] = api.getAuthenticationLoginRequest(payload)

    const response: AxiosResponse<AuthLoginResponse> = yield call(axios.request, {
      url: endpoint,
      ...requestOptions,
    })
    const data = response.data

    const authLoginCallbackResponse: AuthLoginCallbackResponse = {
      title: data.status,
      description: data.message,
      variant: 'success',
    }

    if (onResponse) {
      yield call(onResponse, authLoginCallbackResponse)
    }

    // optionally dispatch success state, token, etc.
    // yield put(setToken(...));
  } catch (error: any) {
    if (action.onResponse) {
      const errorData = error?.response?.data

      const authLoginCallbackResponse: AuthLoginCallbackResponse = {
        title: errorData?.message,
        description: errorData?.error,
        variant: 'error',
      }

      yield call(action.onResponse, authLoginCallbackResponse)
    }
  }

  yield put(authActions.setAuthenticationLoginLoading(false))
}

// watcher
export function* watchAuthSagas() {
  yield takeEvery(authActions.REQUEST_AUTH_LOGIN, authenticationLoginRequestSaga)
}
