const { db } = require('../../models');
const jwt = require('jsonwebtoken')
const {
    AuthenticationError,
  } = require('apollo-server');
module.exports = {

  Mutation: {
      login: async (_, params, ctx) => {

        const {mail, password} = params
  
        //  User have to exist, search by email
        const user = await db.user.findOne({
            where: { mail, active: true },
        });

        // check credentials
        if (!user) {
            throw new AuthenticationError('Wrong credentials')
        } else {
            const isPasswordCorrect = await user.checkPassword(password);
            if (!isPasswordCorrect) {
                throw new AuthenticationError('Wrong credentials')
            }
        }

        // create token
        const token = jwt.sign(
            {
            id: user.id,
            },
            process.env.JWT_KEY,
            {
            expiresIn: '12h',
            }
        );

        return token;

      },
  },
};