import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';

function createMarkup(html) {
  return {__html: html};
}


class Tile extends Component {
  componentDidMount () {
    if (!this.props.hashedContent[this.props.hash]) {
      this.props.getIPFSHash(this.props.hash, true);
    }
  }
  render () {
    let ipfsContent = 'Loading info IPFS';

    if (this.props.hashedContent[this.props.hash]) {
      console.log('blob: ', this.props.hashedContent[this.props.hash])
      ipfsContent = <div dangerouslySetInnerHTML={createMarkup(this.props.hashedContent[this.props.hash])} />
    }

    return ipfsContent
  }
}

Tile.propTypes = {
  classes: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  hashedContent: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    hashedContent: state.data.hashedContent
  }
}

const dispatchToProps = (dispatch) => {
    return {
        getIPFSHash: (hash, noParse) => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash, noParse}})

    };
}

export default drizzleConnect(Tile, mapStateToProps, dispatchToProps);
