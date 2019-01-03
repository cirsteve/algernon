import React from 'react'
import Blockies from 'react-blockies';

export default ({address, size, scale}) => (
  <Blockies
    seed={address}
    size={size || 9}
    scale={scale || 4}
    color="#2fe"
    bgColor="#1fe"
    spotColor="#4bc"
    className="identicon"
  />
)
