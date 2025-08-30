import { toast } from '@/hooks/use-toast'
import * as api from '@/utils/api/Authentication.api'
import { navigateTo } from '@/utils/Navigation'
import axios, { AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as authActions from '../actions/Authentication.action'
import * as confirmationTokenActions from '../actions/ConfirmationToken.action'
import * as userActions from '../actions/User.action'
import { GenericResponse } from '../types/GenericResponse.type'

function* confirmationTokenValidationRequestSaga(action: ReturnType<typeof confirmationTokenActions.requestConfirmationTokenValidation>) {
  yield put(confirmationTokenActions.setConfirmationTokenValidationLoading(true))

  try {
    const { payload } = action
    const [endpoint, requestOptions] = api.getConfirmationTokenValidateRequest(payload)

    const response: AxiosResponse<GenericResponse> = yield call(axios.request, { url: endpoint, ...requestOptions })
    const { data } = response.data

    if (data.confirmation_token_type?.includes('PASSWORD_RESET')) {
      navigateTo('/auth/token/password-reset', { replace: true })
      return
    }

    navigateTo('/auth/token/one-time-pin', { replace: true })

    yield put(confirmationTokenActions.setConfirmationTokenValidation(true))
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({
      title: errorData?.message || 'Invalid token',
      description: errorData?.error,
      variant: 'warning',
    })

    yield put(confirmationTokenActions.setConfirmationTokenValidation(false))
    navigateTo('/', { replace: true })
  }

  yield put(confirmationTokenActions.setConfirmationTokenValidationLoading(false))
}

function* confirmationTokenOneTimePinRequestSaga(action: ReturnType<typeof confirmationTokenActions.requestConfirmationTokenOneTimePin>) {
  yield put(confirmationTokenActions.setConfirmationTokenLoading(true))

  try {
    const { payload } = action
    const [endpoint, requestOptions] = api.getConfirmationTokenOneTimePinRequest(payload)

    const response: AxiosResponse<GenericResponse> = yield call(axios.request, { url: endpoint, ...requestOptions })
    const { data, message, status } = response.data

    if (data.confirmation_token_type?.includes('PASSWORD_RESET')) {
      yield put(confirmationTokenActions.setConfirmationToken(data))
      yield put(confirmationTokenActions.setConfirmationTokenLoading(false))

      toast({ title: status, description: message, variant: 'success' })

      navigateTo('/auth/token', { replace: true })

      return
    }

    if (data.access_token) {
      yield put(authActions.setAuthenticationAccessToken(data.access_token))
    }

    if (data.refresh_token) {
      yield put(authActions.setAuthenticationRefreshsToken(data.refresh_token))
    }

    if (data.access_token_expires_at) {
      yield put(authActions.setAuthenticationAccessTokenExpiresAt(data.access_token_expires_at))
    }

    if (data.refresh_token_expires_at) {
      yield put(authActions.setAuthenticationRefreshTokenExpiresAt(data.refresh_token_expires_at))
    }

    if (data.user) {
      yield put(userActions.setUser(data.user))
    }

    toast({ title: status, description: message, variant: 'success' })

    navigateTo(`/dashboard`, { replace: true })
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({
      title: errorData?.message || 'Invalid token',
      description: errorData?.error,
      variant: 'warning',
    })
  }

  yield put(confirmationTokenActions.setConfirmationTokenLoading(false))
}

function* confirmationTokenPasswordResetRequestSaga(action: ReturnType<typeof confirmationTokenActions.requestConfirmationTokenPasswordReset>) {
  yield put(confirmationTokenActions.setConfirmationTokenLoading(true))

  try {
    const { payload } = action
    const [endpoint, requestOptions] = api.getConfirmationTokenPasswordResetRequest(payload)

    const response: AxiosResponse<GenericResponse> = yield call(axios.request, { url: endpoint, ...requestOptions })
    const { data, message, status } = response.data

    if (data.access_token) {
      yield put(authActions.setAuthenticationAccessToken(data.access_token))
    }

    if (data.refresh_token) {
      yield put(authActions.setAuthenticationRefreshsToken(data.refresh_token))
    }

    if (data.access_token_expires_at) {
      yield put(authActions.setAuthenticationAccessTokenExpiresAt(data.access_token_expires_at))
    }

    if (data.refresh_token_expires_at) {
      yield put(authActions.setAuthenticationRefreshTokenExpiresAt(data.refresh_token_expires_at))
    }

    // TODO
    // if (data.user) {
    //   yield put(authActions.setAuthenticationRefreshsToken(data.refresh_token))
    // }

    toast({ title: status, description: message, variant: 'success' })

    navigateTo('/dashboard', { replace: true })
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({
      title: errorData?.message || 'Invalid token',
      description: errorData?.error,
      variant: 'warning',
    })

    navigateTo('/', { replace: true })
  }

  yield put(confirmationTokenActions.setConfirmationTokenLoading(false))
}

export function* watchCnfirmationTokenSagas() {
  yield takeEvery(confirmationTokenActions.REQUEST_CONFIRMATION_TOKEN_VALIDATION, confirmationTokenValidationRequestSaga)
  yield takeEvery(confirmationTokenActions.REQUEST_CONFIRMATION_TOKEN_OTP, confirmationTokenOneTimePinRequestSaga)
  yield takeEvery(confirmationTokenActions.REQUEST_CONFIRMATION_TOKEN_PASSWORD_RESET, confirmationTokenPasswordResetRequestSaga)
}
