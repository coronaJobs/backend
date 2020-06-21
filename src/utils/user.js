const { Op } = require("sequelize");
const { db } = require("../models");

const getRoleNames = (user) => {
  return {
    1: {
      ratingName: "employerRating",
      commentName: "employerComment",
    },
    2: {
      ratingName: "employeeRating",
      commentName: "employeeComment",
    },
  };
};

const getEmploymentsByRole = async (user) => {
  let employments;
  switch (user.roleId) {
    case 1: {
      // employer
      employments = [];
      const posts = await user.getPosts();
      posts.forEach(async (post) => {
        const employment = await db.employment.find({
          where: {
            [Op.and]: [
              { jobId: post.id },
              { employerRating: { [Op.not]: null } },
              { employerComment: { [Op.not]: null } },
            ],
          },
        });
        employments.push(employment);
      });
      break;
    }
    case 2: {
      // employee
      employments = await db.employment.findAll({
        where: {
          [Op.and]: [
            { employeeId: user.id },
            { employeeRating: { [Op.not]: null } },
            { employeeComment: { [Op.not]: null } },
          ],
        },
      });
      break;
    }
    default: {
      employments = [];
      break;
    }
  }
  return employments;
};

module.exports = {
  getRoleNames,
  getEmploymentsByRole,
};
