describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Root',
      username: 'root',
      password: 'root'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('form#login')
      .get('#username')

    cy.get('form#login')
      .get('#password')

    cy.get('button').contains('Log in')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('root')
      
      cy.get('button').contains('Log in').click()
      cy.contains('Root logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('nice')
      cy.get('#password').type('wow')
      cy.get('button').contains('Log in').click()

      cy//.contains('Failed to login! Check username and password')
        .get('#error-note')
        //.contains('Failed to login! Check username and password')
        .should('contain', 'Failed to login! Check username and password')
        .should('have.css', 'backgroundColor', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'root', password: 'root'})
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('My first blog')
      cy.get('#blog-author').type('Root')
      cy.get('#blog-url').type('https://root.com')
      cy.get('form > button').contains('create').click()

      cy.contains('My first blog Root')
        .contains('view').click()
    })

    it('Can like a blog', function() {
      cy.createBlog({
        title: 'New Blog', 
        author:'Root',
        url: 'http://root.com'
      })

      cy.contains('New Blog')
        .contains('view')
        .click()

      cy.get('.blog-extra-details:first > .likes')
        .contains('0')

      cy.get('.blog-extra-details:first')
        .contains('like')
        .click()

      cy.get('.blog-extra-details:first > .likes')
      .contains('1')
    })

    it('user can delete it\'s own blog', function() {
      cy.createBlog({
        title: 'New Blog', 
        author:'Root',
        url: 'http://root.com'
      })

      cy.contains('New Blog')
        .contains('view')
        .click()

      cy.contains('remove')
        .click()
      
      cy.should('not.contain', 'New Blog')
    })

    it('user can\'t delete anothers blog', function() {
      cy.createBlog({
        title: 'New Blog', 
        author:'Root',
        url: 'http://root.com'
      })

      const user = {
        name: 'Test',
        username: 'test',
        password: 'test'
      }

      cy.request('POST', 'http://localhost:3001/api/users', user)
      cy.login({username: 'test', password: 'test'})
      

      cy.contains('New Blog')
        .contains('view')
        .click()

      cy.get('.blog-extra-details')
        .should('not.contain', 'remove')
    })

    it.only('blogs are displayed in correct order', function() {
      cy.createBlog({
        title: 'First Blog', 
        author: 'Root',
        url: 'http://root.com',
        likes: 55
      })
      cy.createBlog({
        title: 'Second Blog', 
        author: 'Root',
        url: 'http://root.com',
        likes: 78
      })
      cy.createBlog({
        title: 'Third Blog', 
        author: 'Root',
        url: 'http://root.com',
        likes: 100
      })

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).contains('Third Blog')
        cy.wrap(blogs[1]).contains('Second Blog')
        cy.wrap(blogs[2]).contains('First Blog')
      })
    })
  })
})