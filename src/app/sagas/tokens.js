import { call, put, takeEvery, all } from 'redux-saga/effects'

function* depositTokens(action) {
  const {approve, deposit} = action.payload
  console.log('depositin tokens: ',approve, deposit)
   try {
      const a = yield call(approve);
      console.log('got approval:',  a)
      const b = yield call(deposit);
      console.log('got deposit:',  b)
   } catch (e) {
     console.log('ipfs failure', e.message);
      yield put({type: "IPFS_UPLOAD_FAILED", message: e.message});
   }
}

function* sagas() {
  yield all([
      yield takeEvery("DEPOSIT_TOKENS", depositTokens)
  ])
}

export default sagas;
