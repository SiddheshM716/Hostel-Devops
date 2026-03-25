describe('HostelMate Application Boot & Login', () => {
  it('successfully loads the landing page and verifies login roles exist', () => {
    cy.visit('/')
    
    // Check main title
    cy.contains('HostelMate').should('exist')
    
    // Verify login buttons exist
    cy.get('button').contains('Student').should('exist')
    cy.get('button').contains('Warden').should('exist')
  })
})
