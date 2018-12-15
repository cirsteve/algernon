const contract = [
  {
    name: 'fee',
    label: 'Enrollment Fee',
    type: 'number',
    required: true,
    default: 0
  },
  {
    name: 'limit',
    label: 'Enrollment Limit',
    type: 'number',
    required: true,
    default: 0
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
    name: 'description',
    label: 'Content',
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
  contract,
  offChain
}
