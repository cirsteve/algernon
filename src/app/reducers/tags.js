import produce from 'immer'
const initialState = {
    tags: [],
    submittedTags: [],
    count: 0
};

export default (state = initialState, action) => {
  return produce(state, draftState => {
    switch (action.type) {
        case 'TAG_RECEIVED':
          draftState.tags.push(action.payload.tag);
          break
        case 'TAG_SUBMITTED':
          draftState.submittedTags.push(action.payload.tag);
          break
        case 'TAG_COUNT':
          draftState.count = action.payload.count;
          break
        default:
          return state;
    }
  })
}
