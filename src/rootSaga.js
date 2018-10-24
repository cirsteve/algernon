import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import ipfsSaga from './app/sagas/ipfs'

export default function* root() {
  yield all(
    [ipfsSaga].concat(drizzleSagas).map(saga => fork(saga))
  )
}
