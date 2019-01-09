import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import ipfsSaga from './app/sagas/ipfs'
import tagsSaga from './app/sagas/tags'
import tokensSaga from './app/sagas/tokens'

export default function* root() {
  yield all(
    [ipfsSaga, tagsSaga, tokensSaga].concat(drizzleSagas).map(saga => fork(saga))
  )
}
