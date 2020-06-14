const { db } = require("../../models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { AuthenticationError, ApolloError } = require("apollo-server");
module.exports = {
  Mutation: {
    login: async (_, params, ctx) => {
      const { mail, password } = params;

      //  User have to exist, search by email
      const user = await db.user.findOne({
        where: { mail, active: true },
      });

      // check credentials
      if (!user) {
        throw new AuthenticationError("Wrong credentials");
      } else {
        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) {
          throw new AuthenticationError("Wrong credentials");
        }
      }

      // //create token

      const encryptedId = CryptoJS.AES.encrypt(
        user.id.toString(),
        process.env.CRYPTO_KEY
      ).toString();

      const token = jwt.sign(
        {
          id: encryptedId,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "12h",
        }
      );

      return token;
    },
    logout: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      try {
        db.blacklist.create({ token: ctx.token });
        return true;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};
