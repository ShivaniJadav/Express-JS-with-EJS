var { sqldb } = require("../models/dbconfig");

let getCounts = async (name) => {
  try {
    let users = await sqldb.users.count({ where: { is_active: true, is_admin: false } });
    let data = {
      users: users || 0,
      scanned_points: 0,
      successful_withdrawals: 0,
      pending_points: 0
    }

    if (data) {
      return { status: true, data: data, message: "Counts found!" };
    } else {
      return { status: false, data: {}, message: "Counts not found!" };
    }
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};
module.exports = {
  getCounts
};
