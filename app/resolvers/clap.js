const { getFields } = require('../datasources/utils/controllers');

function post(parent, args, context, info) {
  const { dataSources: { loaders: { postLoader } } } = context;
  return postLoader.load({ postId: parent.post, getFields: getFields(info)});
}

function user(parent, args, context, info) {
  const { dataSources: { loaders: { userLoader } } } = context;
  return userLoader.load({ userId: parent.user, getFields: getFields(info) });
}

const Clap = {
  user,
  post,
};

module.exports = Clap;