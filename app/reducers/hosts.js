import { ADD_HOST, ACTIVATE_HOST, DEL_HOST, UPDATE_HOST, SELECT_HOST } from '../actions/hosts';

const initialState = {}

export default function hosts(state = initialState, action) {
  switch (action.type) {
    case ADD_HOST:
      return addHosts(state, action.hosts)
    case ACTIVATE_HOST:
      return activateHosts(state, action.index)
    case SELECT_HOST:
      return selectHosts(state, action.index)
    case DEL_HOST:
      return delHosts(state, action.index)
    case UPDATE_HOST:
      return updateHosts(state, action.index, action.hosts)
    default:
      return state
  }
}

function activateHosts(state, index) {
  return Object.assign({}, state, {
    list: state.list.map((host, i) => {
      host.active = i === index
      return host
    })
  })
}

function selectHosts(state, index) {
  return Object.assign({}, state, {
    list: state.list.map((host, i) => {
      host.selected = i === index
      return host
    })
  })
}

function addHosts(state, hosts) {
  if (!Array.isArray(hosts)) {
    hosts = [hosts]
  }
  const newList = []
  newList.push(...state.list, ...hosts)
  return Object.assign({}, state, {
    list: newList
  })
}

function delHosts(state, index) {
  return Object.assign({}, state, {
    list: state.list.filter((host, i) => {
      return i !== index
    })
  })
}

function updateHosts(state, index, hosts) {
  return Object.assign({}, state, {
    list: state.list.map((v, i) => {
      if (i === index) {
        return hosts
      }
      return v
    })
  })
}

