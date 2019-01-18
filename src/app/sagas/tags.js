import { call, put, takeEvery, all, select } from 'redux-saga/effects'
import { flatten } from 'lodash'

function* getTag(get, id) {
  const tag = yield call(get(id).call)
  console.log('got tag: ', id, tag)
  yield put({type: "TAG_RECEIVED", payload: {id, tag}});
}

function* getTagTopicIds (tagId, address, get) {
  const topicIds = yield call(get(tagId, address).call);
  return topicIds;
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

function* getTopicsForTags(action) {
  const { getAddresses, getTopicIds, tagId}  = action.payload
  try {
    const addresses = yield call(getAddresses(tagId).call)
    const allAddresses = []
    let addressTopics = []
    for (var i = 0; i<addresses.length; i++) {
      addressTopics = yield getTagTopicIds(tagId, addresses[i], getTopicIds)
      allAddresses.push(addressTopics)
    }
    const topicIds = flatten(allAddresses)
    yield put({type: "TAG_TOPICS_RECEIVED", payload: {tagId, topicIds}})
  } catch (e) {
    console.log('tag err: ', e);
    yield put({type: "GET_TAG_TOPICS_FAILED", message: e.message});
  }

}

function* sagas() {
  yield all([
      yield takeEvery("GET_TAGS", getTags),
      yield takeEvery("GET_TAG_COUNT", getTagCount),
      yield takeEvery("GET_TAG_TOPICS", getTopicsForTags)
  ])
}

export default sagas;
