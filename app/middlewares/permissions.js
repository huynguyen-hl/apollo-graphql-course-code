const { rule, shield, allow } = require('graphql-shield');

const isAuthenticated = rule()((parent, args, { user }) => user !== null);
const isAdmin = rule()((parent, args, { user }) => user && user.role === 'Admin');

const permissions = shield(
  {
    Query: {
      users: isAuthenticated,
      user: isAuthenticated,
    },

    Mutation: {
      createUser: isAdmin,
      register: allow,
      login: allow,
    },
  },
  {
    fallbackError: {
      isSuccess: false,
      message: 'Not Authorised!',
    },
  },
);

module.exports = { permissions };
