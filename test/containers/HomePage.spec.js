import { expect } from 'chai'
import React from 'react'
import {
  renderIntoDocument,
  findRenderedDOMComponentWithTag
} from 'react-addons-test-utils'
import { Provider } from 'react-redux'
import HomePage from '../../app/containers/HomePage'
import configureStore from '../../app/store/configureStore'


function setup(initialState) {
  const store = configureStore(initialState);
  const app = renderIntoDocument(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
  return {
    app,
    h1: findRenderedDOMComponentWithTag(app, 'h1')
  };
}


describe('containers', () => {
  describe('App', () => {
    it('should display initial count', () => {
      const { h1 } = setup({
        hosts: {
          list: [{
            active: true,
            selected: true,
            content: 'hehe',
            name: 'test',
            description: 'test-desc'
          }]
        }
      });
      console.log(h1.textContent)
      expect(h1.textContent).to.match(/^macHosts$/);
    })
  })
})
