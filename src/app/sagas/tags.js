import { call, put, takeEvery, all, select } from 'redux-saga/effects'

function* getTag(get, id) {
  const tag = yield call(get(id).call)
  yield put({type: "TAG_RECEIVED", payload: {id, tag}});
}

function* getTags(action) {
    let { from, to } = action.payload
    const state = yield select()
    const tagsCount = Object.keys(state.tags.tags).length
    try {
      //const count = yield call(action.payload.getTagCount)
      if (!to || !from) {
        const count = yield call(action.payload.getTagCount().call)
        from = tagsCount;
        to = parseInt(count);
      }
      console.log('getting tags: ', from, to)
      while ( from < to) {
        console.log('getting tag')
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
