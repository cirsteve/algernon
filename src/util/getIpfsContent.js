export default (dispatch, hash, noParse) => {
    dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash, noParse}})
}
