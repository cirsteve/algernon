import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export default props =>
  <ReactQuill
    value={props.text}
    onChange={props.handleChange} />
