import { call, put, takeEvery, all } from 'redux-saga/effects'
import ipfs from '../../ipfs';

function* ipfsUpload(action) {
  console.log('ipfs uploading', action);
   try {
      const hash = yield call(ipfs.add, Buffer.from(action.payload.upload, 'utf-8'));

      yield put({type: "IPFS_UPLOAD_SUCCEEDED", payload:{hash: hash[0].path}});
   } catch (e) {
     console.log('ipfs failure', e.message);
      yield put({type: "IPFS_UPLOAD_FAILED", message: e.message});
   }
}

function* getIpfs(action) {
    const url = `/ipfs/${action.payload.hash}`
    try {
      const fields = yield call(ipfs.get, url);

      yield put({type: "GET_IPFS_SUCCEEDED", payload:{fields: JSON.parse(fields[0].content.toString()), hash: action.payload.hash}});
    } catch (e) {
      yield put({type: "GET_IPFS_FAILED", message: e.message});
    }
}

function* sagas() {
  yield all([
      yield takeEvery("IPFS_UPLOAD_REQUESTED", ipfsUpload),
      yield takeEvery("GET_IPFS_UPLOAD", getIpfs)
  ])
}

export default sagas;
