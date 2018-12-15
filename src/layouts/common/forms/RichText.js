import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export default ({value, onChange}) =>
  <ReactQuill
    value={value}
    onChange={onChange} />
