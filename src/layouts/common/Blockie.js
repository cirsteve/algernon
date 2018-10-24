import React from 'react'
import Blockies from 'react-blockies';

export default ({address}) => (
  <Blockies
    seed={address}
    size={10}
    scale={3}
    color="#2fe"
    bgColor="#1fe"
    spotColor="#4bc"
    className="identicon"
  />
)
