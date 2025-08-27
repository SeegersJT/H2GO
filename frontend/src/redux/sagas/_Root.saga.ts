// src/app/rootSaga.ts
import { all } from 'redux-saga/effects'
import { watchAuthSagas } from './Authentication.saga'
import { watchCnfirmationTokenSagas } from './ConfirmationToken.saga'

export default function* rootSaga() {
  yield all([watchAuthSagas(), watchCnfirmationTokenSagas()])
}
