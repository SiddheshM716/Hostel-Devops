/// <reference types="cypress" />

describe('HostelMate Signup and Login Flow', () => {
  beforeEach(() => {
    // Navigate to the base URL (which should redirect to landing or have a link)
    cy.visit('/')
  })

  it('verifies the app boots up and landing page has HostelMate text', () => {
    // Adjust selector based on actual text available in public/index.html or Landing component
    cy.contains('HostelMate').should('be.visible')
  })

  it('can navigate to login and view the form', () => {
    // Navigate directly to the actual react route
    cy.visit('/signin')

    cy.get('input[type="email"]').should('exist')    
    cy.get('input[type="password"]').should('exist')
    cy.contains('Sign In').should('exist')
  })

  it('shows an error toast for invalid login credentials', () => {
    // Intercept the API call to mock a backend rejection
    cy.intercept('POST', '**/api/auth/signin*', {
      statusCode: 400,
      body: { error: 'Invalid Credentials' },
    }).as('loginRequest')

    cy.visit('/signin')

    cy.get('input[type="email"]').type('fake@example.com')
    cy.get('input[type="password"]').type('wrongpassword123')
    
    // Assuming standard MUI or generic button wrapping
    cy.get('button[type="submit"]').click()

    // Wait for the mock network request
    cy.wait('@loginRequest')

    // Cypress should catch the error state, usually via a toast or alert text
    cy.contains('Invalid Credentials', { matchCase: false }).should('exist')
  })
})
