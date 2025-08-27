// src/redux/sagas/Authentication.saga.ts
import axios, { AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import { toast } from '@/hooks/use-toast'
import { navigateTo } from '@/utils/Navigation'
import * as confirmationTokenAction from '../actions/ConfirmationToken.action'
import * as api from '@/utils/api/Authentication.api'
import { GenericResponse } from '../types/GenericResponse.type'

function* confirmationTokenValidationRequestSaga(action: ReturnType<typeof confirmationTokenAction.requestConfirmationTokenValidation>) {
  yield put(confirmationTokenAction.setConfirmationTokenValidationLoading(true))

  try {
    const { payload } = action
    const [endpoint, requestOptions] = api.getConfirmationTokenValidateRequest(payload)

    const response: AxiosResponse<GenericResponse> = yield call(axios.request, { url: endpoint, ...requestOptions })
    const { data } = response.data

    if (data.confirmation_token_type?.includes('PASSWORD_RESET')) {
      navigateTo('/auth/token/password-reset', { replace: true })
    }

    navigateTo('/auth/token/one-time-pin', { replace: true })
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({
      title: errorData?.message || 'Invalid token',
      description: errorData?.error,
      variant: 'warning',
    })
    navigateTo('/', { replace: true })
  }

  yield put(confirmationTokenAction.setConfirmationTokenValidationLoading(false))
}

export function* watchCnfirmationTokenSagas() {
  yield takeEvery(confirmationTokenAction.REQUEST_CONFIRMATION_TOKEN_VALIDATION, confirmationTokenValidationRequestSaga)
}
