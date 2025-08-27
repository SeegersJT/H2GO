import { toast } from '@/hooks/use-toast'
import * as api from '@/utils/api/Authentication.api'
import { navigateTo } from '@/utils/Navigation'
import axios, { AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as confirmationTokenAction from '../actions/ConfirmationToken.action'
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

    yield put(confirmationTokenAction.setConfirmationTokenValidation(true))
  } catch (error: any) {
    const errorData = error?.response?.data
    toast({
      title: errorData?.message || 'Invalid token',
      description: errorData?.error,
      variant: 'warning',
    })

    console.log('here')
    yield put(confirmationTokenAction.setConfirmationTokenValidation(false))
    navigateTo('/', { replace: true })
  }

  yield put(confirmationTokenAction.setConfirmationTokenValidationLoading(false))
}

function* confirmationTokenOneTimePinRequestSaga(action: ReturnType<typeof confirmationTokenAction.requestConfirmationTokenOneTimePin>) {
  yield put(confirmationTokenAction.setConfirmationTokenValidationLoading(false))

  // setLoading(true)
  //   try {
  //     const [endpoint, requestOptions] = api.getAuthOneTimePinRequest({
  //       confirmation_token: confirmationToken!,
  //       one_time_pin: oneTimePin,
  //     })
  //     const response = await axios.request({ url: endpoint, ...requestOptions })
  //     const { data, message } = response.data
  //     toast({ title: 'Success', description: message, variant: 'success' })
  //     if (data?.confirmation_token) {
  //       dispatch(confirmationTokenAction.setConfirmationToken(data))
  //       navigate('/auth/token/password-reset')
  //     } else {
  //       navigate('/dashboard')
  //     }
  //   } catch (error: any) {
  //     const errorData = error?.response?.data
  //     toast({
  //       title: errorData?.message || 'Verification failed',
  //       description: errorData?.error,
  //       variant: 'error',
  //     })
  //   }
  //   setLoading(false)

  // yield put(confirmationTokenAction.setConfirmationTokenValidationLoading(true))

  // try {
  //   const { payload } = action
  //   const [endpoint, requestOptions] = api.getConfirmationTokenValidateRequest(payload)

  //   const response: AxiosResponse<GenericResponse> = yield call(axios.request, { url: endpoint, ...requestOptions })
  //   const { data } = response.data

  //   if (data.confirmation_token_type?.includes('PASSWORD_RESET')) {
  //     navigateTo('/auth/token/password-reset', { replace: true })
  //   }

  //   navigateTo('/auth/token/one-time-pin', { replace: true })
  // } catch (error: any) {
  //   const errorData = error?.response?.data
  //   toast({
  //     title: errorData?.message || 'Invalid token',
  //     description: errorData?.error,
  //     variant: 'warning',
  //   })
  //   navigateTo('/', { replace: true })
  // }

  // yield put(confirmationTokenAction.setConfirmationTokenValidationLoading(false))
}

export function* watchCnfirmationTokenSagas() {
  yield takeEvery(confirmationTokenAction.REQUEST_CONFIRMATION_TOKEN_VALIDATION, confirmationTokenValidationRequestSaga)
  yield takeEvery(confirmationTokenAction.REQUEST_CONFIRMATION_TOKEN_OTP, confirmationTokenOneTimePinRequestSaga)
}
