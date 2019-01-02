import React from 'react'
;

import Text from '../common/forms/Text'
import Select from '../common/forms/Select'
import RichText from '../common/forms/RichText'

const INPUT_MAP = {
  string: props => <Text {...props} />,
  number: props => <Text {...props} />,
  url: props => <Text {...props} />,
  richText: props => <RichText {...props} />,
  select: props => <Select {...props} />
}

export default ({fields}) => fields.map(f => INPUT_MAP[f.type]({...f}))
