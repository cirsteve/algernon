import React from 'react'
import { Link } from 'react-router-dom'
import Chip from './Chip'

export default ({label, idx}) =>
  <div>
    <Link to={`/tag/${idx}`}>
      <Chip label={label} />
    </Link>
  </div>
