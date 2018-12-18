import produce from 'immer'
const initialState = {
    tags: []
};

export default (state = initialState, action) => {
  return produce(state, draftState => {
    switch (action.type) {
        case 'TAG_RECEIVED':
          draftState.tags[action.payload.id] = action.payload.tag;
          break
        default:
          return state;
    }
  })
}
