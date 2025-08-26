// src/app/rootSaga.ts
import { all } from 'redux-saga/effects'
import { watchAuthSagas } from './Authentication.saga'

export default function* rootSaga() {
  yield all([watchAuthSagas()])
}
