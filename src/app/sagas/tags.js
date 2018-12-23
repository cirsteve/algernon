import { call, put, takeEvery, all } from 'redux-saga/effects'

function* getTag(get, id) {
  const tag = yield call(get(id).call)
  console.log('gotTag: ', id, tag)
  yield put({type: "TAG_RECEIVED", payload: {id, tag}});
}

function* getTags(action) {
    let { from, to } = action.payload
    try {
      //const count = yield call(action.payload.getTagCount)
      if (!to || !from) {
        const count = yield call(action.payload.getTagCount().call)
        from = 0;
        to = parseInt(count);
      }
      while ( from < to) {
        yield getTag(action.payload.getTag, from)
        from++
      }
    } catch (e) {
      console.log('tag err: ', e);
      yield put({type: "GET_TAGS_FAILED", message: e.message});
    }
}

function* getTagCount(action) {
  const count = yield call(action.payload.getTagCount().call)
  yield put({type: "TAG_COUNT", payload: {count}});
}

function* sagas() {
  yield all([
      yield takeEvery("GET_TAGS", getTags),
      yield takeEvery("GET_TAG_COUNT", getTagCount)
  ])
}

export default sagas;
