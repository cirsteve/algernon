const offChain = [
  {
    name: 'title',
    label: 'Title',
    type: 'string',
    require: false,
    default: ''
  },
  {
    name: 'url',
    label: 'URL',
    type: 'url',
    require: false,
    default: ''
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'richText',
    required: true,
    default: ''
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'select',
    multiple: true,
    default: [],
    options: []
  }
]


export default {
  contract: [],
  offChain
}
