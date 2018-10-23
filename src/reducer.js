import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import dataReducer from './app/reducers/data'

const reducer = combineReducers({
  data: dataReducer,
  routing: routerReducer,
  ...drizzleReducers
})

export default reducer
