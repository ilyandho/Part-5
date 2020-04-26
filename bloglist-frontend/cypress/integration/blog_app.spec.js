describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'usertesting',
      name: 'User Testing',
      password: 'secret',
    });
    cy.visit('http://localhost:3000');
  });

  it('Login from is shown', function () {
    cy.contains('Login to application');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('usertesting');
      cy.get('#password').type('secret');
      cy.get('#loginBtn').click();

      cy.contains('User Testing logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('usertesting');
      cy.get('#password').type('secrt');
      cy.get('#loginBtn').click();

      cy.contains('Wrong credentials. Check the username or password');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'usertesting', password: 'secret' });
      cy.createBlog({ title: 'Innital blog', url: 'innitial.com' });
    });
    it('Blogs are sorted from the highest likes to the lowest', function () {
      const blogsArray = [
        { title: 'One blog', url: 'innitial.com', likes: 1 },
        { title: 'Ten blog', url: 'innitial.com', likes: 10 },
        { title: 'Two blog', url: 'innitial.com', likes: 2 },
        { title: 'Ninteen blog', url: 'innitial.com', likes: 19 },
        { title: 'Seven blog', url: 'innitial.com', likes: 7 },
        { title: 'Three blog', url: 'innitial.com', likes: 3 },
        { title: 'Five blog', url: 'innitial.com', likes: 5 },
      ];

      for (let blog in blogsArray) {
        cy.createBlog(blogsArray[blog]);
      }

      const likes = [];
      cy.get('.viewBtn').click({ multiple: true });
      cy.get('.blogLikes').each((likeText) => {
        const like = likeText.text().trim().split(' ')[0];
        likes.push(like);
      });
      console.log(likes);

      const sortedLikes = likes.sort((a, b) => b - a);
      cy.wrap(likes).should('equal', sortedLikes);
    });
    it('A blog can be created', function () {
      cy.contains('New Blog').click();
      cy.get('.title').type('Testing blog');
      cy.get('.url').type('testing.com');
      cy.get('#createBtn').click();
      cy.get('.blog-list').contains('Testing blog');
    });

    it('A user can like a blog', function () {
      cy.get('.like').click();
      cy.get('.previewContent').contains('1');
    });

    it('A user who created a blog can delete it', function () {
      cy.contains('view').click();
      cy.get('.deleteBtn').click();
      cy.contains('Innital blog has been deleted');
    });

    it('A user who can not delete a blog he did not create', function () {
      cy.get('.logoutBtn').click();
      cy.request('POST', 'http://localhost:3003/api/users', {
        username: 'differentuser',
        name: 'Different User ',
        password: 'secret',
      });
      cy.login({ username: 'differentuser', password: 'secret' });

      cy.contains('view').click();
      cy.get('.deleteBtn').click();
      cy.contains('You are not authorized to delete this');
    });
  });
});
