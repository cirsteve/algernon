import React, { Component, cloneElement } from 'react';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';

class Ipfs extends Component {
  componentDidMount () {
    if (!this.props.hashedContent[this.props.hash]) {
      this.props.getIPFSHash(this.props.hash);
    }
  }

  render() {
    const {hashedContent, hash, children } = this.props
    let content = 'Loading'


    if (hashedContent[hash]) {
      content = cloneElement(children, {...hashedContent[hash]})
    }

    return content;
  }
}

Ipfs.propTypes = {
  hash: PropTypes.string.isRequired,
  hashedContent: PropTypes.object.isRequired,
};

const mapState= state => {
  return {
    hashedContent: state.data.hashedContent
  }
}

const mapDispatch = (dispatch) => {
    return {
        getIPFSHash: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}})
    };
}

export default drizzleConnect(Ipfs, mapState, mapDispatch);
