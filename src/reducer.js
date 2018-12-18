import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import dataReducer from './app/reducers/data'
import tagsReducer from './app/reducers/tags'

const reducer = combineReducers({
  data: dataReducer,
  routing: routerReducer,
  tags: tagsReducer,
  ...drizzleReducers
})

export default reducer
