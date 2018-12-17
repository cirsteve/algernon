import React from 'react';


function createMarkup(html) {
  return {__html: html};
}

export default ({html}) => <div dangerouslySetInnerHTML={createMarkup(html)} />
