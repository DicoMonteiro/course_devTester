const UserModel = require('../models/user.model')
const md5 = require('md5')

module.exports = {
    async create(request, h) {
        if (request.payload === null) {
            return h.response({ message: 'Not JSON.' }).code(400);
        }
    
        if (!request.payload.email) {
        return h.response({ message: 'Email is required.' }).code(409);
        }
        
        if (!request.payload.password) {
        return h.response({ message: 'Password is required.' }).code(409);
        }

        const user = new UserModel({
            email: request.payload.email,
            password: md5(request.payload.password)
        })

        const dup = await UserModel.findOne({email: user.email}).exec();

        if (dup) {
        return h.response({ error: 'Duplicated user.'}).code(409);
        }

        try {
            let result = await user.save()
            return h.response(result).code(200);
        } catch (error) {
            return h.response(error).code(500);
        }
    },
    async login(request, h) {
        if (request.payload === null) {
            return h.response({ message: 'Not JSON.' }).code(400);
        }

        const { email, password } = request.payload

        try {
            const user = await UserModel.findOne( {email: email, password: md5(password)} ).exec();

            if (!user) {
                return h.response( { message: "Unauthorized" } ).code(401)
            }
            return h.response({ user_token: user._id }).code(200)
        } catch (error) {
            return h.response(error).code(500);
        }
    },
    async listUser(request, h) {    
        try {
          const user = await UserModel.findOne({email: request.params.email }).exec();
    
          if (!user) {
            return h.response({ message: "User not found."}).code(404)
          }
          
          return user;
        } catch (error) {
          return h.response(error).code(500);
        }
      },
    async remove(request, h) {

        try {
            const user = await UserModel.findOne({_id: request.params.id}).exec();

            if (!user) {
            return h.response({ message: "User not found."}).code(404)
            }

            await UserModel.deleteOne({_id: request.params.id}).exec();
            return h.response({}).code(204);
        } catch (error) {
            return h.response(error).code(500);
        }
    
    }
}