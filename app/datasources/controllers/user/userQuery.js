const _ = require('lodash');
const { User } = require('../../models');
const utils = require('../../utils/controllers');

async function getUsers(args, context, info) {
  const { filter, limit = 10 } = args;
  const fieldsSelected = utils.getFieldsSelection(info, 'users');

  const filterCondition = {};
  if (_.isObject(filter)) {
    for (const key in filter) {
      filterCondition[key] = { $regex: `.*${filter[key]}.*` };
    }
  }

  try {
    const users = await User.find(filterCondition, { ...fieldsSelected }).sort({ _id: 1 }).limit(limit);
    const lastId = users[users.length - 1] && users[users.length - 1]._id;

    return {
      isSuccess: true,
      lastId,
      users,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getUser(args, context, info) {
  try {
    const { _id } = args;
    const fieldsSelected = utils.getFieldsSelection(info, 'user');
    const user = await User.findOne({ _id }, { ...fieldsSelected });
    if (!user) {
      return {
        isSuccess: false,
        message: 'Invalid user ID',
      };
    }

    return {
      isSuccess: true,
      user,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

module.exports = {
  getUsers,
  getUser,
};
