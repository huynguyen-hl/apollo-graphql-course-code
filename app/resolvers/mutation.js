async function login(parent, args, context, info) {
  const { dataSources } = context;
  const result = dataSources.login(args, context, info);
  return result;
}

async function createUser(parent, args, context, info) {
  const { dataSources } = context;
  const result = dataSources.createUser(args, context, info);
  return result;
}

module.exports = {
  login,
  createUser,
};
