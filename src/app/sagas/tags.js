import { call, put, takeEvery, all } from 'redux-saga/effects'

function* getTag(get, id) {
  const tag = yield call(get(id).call)
  console.log('gotTag: ', id, tag)
  yield put({type: "TAG_RECEIVED", payload: {id, tag}});
}

function* getTags(action) {
    console.log('getting tags', action)
    try {
      //const count = yield call(action.payload.getTagCount)
      const count = yield call(action.payload.getTagCount().call)
      console.log('tag count is: ', count);
      let i = 0;
      while ( i < parseInt(count)) {
        yield getTag(action.payload.getTag, i)
        i++
      }
    } catch (e) {
      console.log('tag err: ', e);
      yield put({type: "GET_TAGS_FAILED", message: e.message});
    }
}

function* sagas() {
  yield all([
      yield takeEvery("GET_TAGS", getTags)
  ])
}

export default sagas;
