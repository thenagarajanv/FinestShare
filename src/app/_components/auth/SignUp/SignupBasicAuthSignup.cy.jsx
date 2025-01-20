import React from 'react'
import BasicAuthSignup from './Signup'

describe('<BasicAuthSignup />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<BasicAuthSignup />)
  })
})