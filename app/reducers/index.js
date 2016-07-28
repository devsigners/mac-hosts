import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import hosts from './hosts'

const rootReducer = combineReducers({
  hosts,
  routing
})

export default rootReducer
