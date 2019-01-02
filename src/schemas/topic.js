const contract = [
  {
    name: 'tags',
    label: 'Tags',
    type: 'select',
    multiple: true,
    default: [],
    options: []
  }
]

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
    name: 'description',
    label: 'Description',
    type: 'string',
    multiline: true,
    require: false,
    default: ''
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'richText',
    required: false,
    default: ''
  }
]


export default {
  contract,
  offChain
}
