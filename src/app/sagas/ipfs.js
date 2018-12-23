import { call, put, takeEvery, all } from 'redux-saga/effects'
import ipfs from '../../ipfs';
import { getBytes32FromMultihash } from '../../util/multihash'

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

function* ipfsUploadThenSave(action) {
  console.log('ipfs uploading', action);
   try {
      const hash = yield call(ipfs.add, Buffer.from(action.payload.upload, 'utf-8'), {pin:true});
      const { digest, hashFunction, size } = getBytes32FromMultihash(hash[0].path)
      console.log('got the hash: ', action.payload.save, digest, hashFunction, size )
      action.payload.save(digest, hashFunction, size)

   } catch (e) {
     console.log('ipfs failure', e.message);
      yield put({type: "IPFS_UPLOAD_FAILED", message: e.message});
   }
}

function* getIpfs(action) {
    const url = `/ipfs/${action.payload.hash}`
    try {

      const fields = yield call(ipfs.get, url);

      const payload = {
        fields: action.payload.noParse ?
          fields[0].content.toString() : JSON.parse(fields[0].content.toString()),
        hash: action.payload.hash
      }
      yield put({type: "GET_IPFS_SUCCEEDED", payload});
    } catch (e) {
      yield put({type: "GET_IPFS_FAILED", message: e.message});
    }
}

function* sagas() {
  yield all([
      yield takeEvery("IPFS_UPLOAD_REQUESTED", ipfsUpload),
      yield takeEvery("IPFS_UPLOAD_THEN_SAVE", ipfsUploadThenSave),
      yield takeEvery("GET_IPFS_UPLOAD", getIpfs)
  ])
}

export default sagas;
