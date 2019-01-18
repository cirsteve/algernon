import produce from 'immer'
const initialState = {
    tags: {},
    submittedTags: {},
    count: 0,
    tagTopicIds: {}
};

export default (state = initialState, action) => {
  return produce(state, draftState => {
    switch (action.type) {
        case 'TAG_RECEIVED':
          draftState.tags[action.payload.tag] = true
          break
        case 'TAG_SUBMITTED':
          draftState.submittedTags[action.payload.tag] = true
          break
        case 'TAG_COUNT':
          draftState.count = action.payload.count;
          break
        case 'TAG_TOPICS_RECEIVED':
          console.log('tag topic received')
          draftState.tagTopicIds[action.payload.tagId] = action.payload.topicIds
          break
        default:
          return state;
    }
  })
}
