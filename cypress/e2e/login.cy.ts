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
    // Assuming there's a link or button that routes to /login
    // We navigate directly to save time against unpredictable landing page designs
    cy.visit('/login')

    cy.get('input[type="email"]').should('exist')    
    cy.get('input[type="password"]').should('exist')
    cy.contains('Sign In').should('exist')
  })

  it('shows an error toast for invalid login credentials', () => {
    cy.visit('/login')

    cy.get('input[type="email"]').type('fake@example.com')
    cy.get('input[type="password"]').type('wrongpassword123')
    
    // Assuming standard MUI or generic button wrapping
    cy.get('button[type="submit"]').click()

    // Cypress should catch the error state, usually via a toast or alert text
    // "Invalid Credentials" comes from our node backend response
    cy.contains('Invalid Credentials', { matchCase: false }).should('exist')
  })
})
