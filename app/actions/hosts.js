import { writeHosts } from '../api/hosts'

export const ADD_HOST = 'ADD_HOST'
export const ACTIVATE_HOST = 'ACTIVATE_HOST'
export const DEL_HOST = 'DEL_HOST'
export const UPDATE_HOST = 'UPDATE_HOST'
export const SELECT_HOST = 'SELECT_HOST'

export function add(hosts) {
  return {
    type: ADD_HOST,
    hosts
  }
}

export function activate(index, pwd) {
  // return {
  //   type: ACTIVATE_HOST,
  //   index
  // }
  return (dispatch, getState) => {
    const { hosts } = getState()
    writeHosts(hosts.list[index].content, (err) => {
      if (err) {
        console.error(err)
      } else {
        dispatch({
          type: ACTIVATE_HOST,
          index
        })
      }
    }, pwd)
  }
}

export function select(index) {
  return {
    type: SELECT_HOST,
    index
  }
}

export function del(index) {
  return {
    type: DEL_HOST,
    index
  }
}

export function update(index, hosts) {
  return {
    type: UPDATE_HOST,
    index,
    hosts
  }
}
