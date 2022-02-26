const ContactModel = require('../models/contact.model')
const UserModel = require('../models/user.model')

const auth = async (userId) => {

    // const userId = request.headers.authorization

    const foundUser = await UserModel.findById(userId)

    if (!foundUser) {
      throw { error: 'Unauthorized', code: 401 }
    }

}

module.exports = {
  async create(request, h) {

      const userId = request.headers.authorization

      try {
        await auth(userId)
      } catch (error) {
        return h.response(error).code(error.code)
      }

      if (request.payload === null) {
        return h.response({ message: 'Not JSON.' }).code(400);
      }

      const contact = new ContactModel({
        name: request.payload.name,
        number: request.payload.number,
        description: request.payload.description,
        userId: userId
      })

      if (!contact.name) {
        return h.response({ message: 'Name is required.' }).code(409);
      } else if (!contact.number) {
        return h.response({ message: 'Number is required.' }).code(409);
      } else if (!contact.description) {
        return h.response({ message: 'Description is required.' }).code(409);
      }

      const dup = await ContactModel.findOne({number: contact.number, userId: userId}).exec();

      if (dup) {
        return h.response({ error: 'Duplicated number.'}).code(409);
      }

      try {
        let result = await contact.save()
        return h.response(result).code(200);
      } catch (error) {
        return h.response(error).code(500);
      }
  },
  async list(request, h) {
      const userId = request.headers.authorization

      try {
        await auth(userId)
      } catch (error) {
        return h.response(error).code(error.code)
      }

      const contacts = await ContactModel.find({ userId: userId }).exec();
      return contacts;
  },
  async listContact(request, h) {
    const userId = request.headers.authorization

    try {
      await auth(userId)
    } catch (error) {
      return h.response(error).code(error.code)
    }

    try {
      const contact = await ContactModel.findOne({number: request.params.number, userId: userId }).exec();

      if (!contact) {
        return h.response({ message: "Contact not found."}).code(404)
      }
      
      return contact;
    } catch (error) {
      return h.response(error).code(500);
    }
  },
  async remove(request, h) {

    const userId = request.headers.authorization

    try {
      await auth(userId)
    } catch (error) {
      return h.response(error).code(error.code)
    }

    try {
      const contact = await ContactModel.findOne({_id: request.params.id, userId: userId}).exec();

      if (!contact) {
        return h.response({ message: "Contact not found."}).code(404)
      }

      await ContactModel.deleteOne({_id: request.params.id, userId: userId}).exec();
      return h.response({}).code(204);
    } catch (error) {
      return h.response(error).code(500);
    }
    
  }
};
