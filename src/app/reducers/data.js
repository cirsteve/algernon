import produce from 'immer'
const initialState = {
    hashedContent: {},
    requestedHash: null,
    pendingUpload: false,
    error: false
};

export default (state = initialState, action) => {
  return produce(state, draftState => {
    switch (action.type) {
        case 'IPFS_UPLOAD_REQUESTED':
          draftState.pendingUpload = true;
          break
        case 'IPFS_UPLOAD_ACKED':
          draftState.requestedHash = null;
          break
        case 'IPFS_UPLOAD_SUCCEEDED':
          draftState.pendingUpload = false;
          draftState.error = false
          draftState.requestedHash = action.payload.hash;
          break
        case 'IPFS_UPLOAD_FAILED':
          draftState.error = action.message
          draftState.pendingUpload = false;
          break
        case 'GET_IPFS_SUCCEEDED':
          draftState.hashedContent[action.payload.hash] = action.payload.fields
          draftState.error =false
          break
        case 'GET_IPFS_FAILED':
          draftState.error = true
          break
        default:
          return state;
    }
  })
}
