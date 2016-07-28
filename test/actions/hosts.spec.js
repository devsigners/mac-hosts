/* eslint no-unused-expressions: 0 */
import { expect } from 'chai'
import { spy } from 'sinon'
import * as actions from '../../app/actions/hosts'


describe('actions', () => {
  it('add should create add action', () => {
    expect(actions.add()).have.property('type', actions.ADD_HOST)
  })

  it('del should create del action', () => {
    expect(actions.del()).have.property('type', actions.DEL_HOST)
  })

  it('select should create select action', () => {
    expect(actions.select()).have.property('type', actions.SELECT_HOST)
  })

  it('update should create update action', () => {
    expect(actions.update()).have.property('type', actions.UPDATE_HOST)
  })

  it('activate should create activate action', () => {
    const fn = actions.activate(0)
    expect(fn).to.be.a('function')
    const dispatch = spy()
    const getState = () => ({
      hosts: {
        list: [{}]
      }
    })

    fn(dispatch, getState)
    expect(dispatch.calledWith({
      type: actions.ACTIVATE_HOST_ERROR,
      message: 'miss password'
    })).to.be.true
  })
})
