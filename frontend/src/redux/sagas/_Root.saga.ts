// src/app/rootSaga.ts
import { all } from 'redux-saga/effects'
import { watchAuthSagas } from './Authentication.saga'
import { watchConfirmationTokenSagas } from './ConfirmationToken.saga'
import { watchCustomersSaga } from './Customers.saga'

export default function* rootSaga() {
  yield all([watchAuthSagas(), watchConfirmationTokenSagas(), watchCustomersSaga()])
}
