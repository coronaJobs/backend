const { Op } = require("sequelize");

const getRoleNames = (user) => {
  return {
    1: {
      id: { employerId: user.id },
      rating: { employerRating: { [Op.not]: null } },
      comment: { employerComment: { [Op.not]: null } },
      ratingName: "employerRating",
      commentName: "employerComment",
    },
    2: {
      id: { employeeId: user.id },
      rating: { employeeRating: { [Op.not]: null } },
      comment: { employeeComment: { [Op.not]: null } },
      ratingName: "employeeRating",
      commentName: "employeeComment",
    },
  };
};

module.exports = {
  getRoleNames,
};
