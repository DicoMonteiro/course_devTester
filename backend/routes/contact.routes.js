const ContactController = require('../controllers/contact.controller')


module.exports = [
    {
        method: "GET",
        path: "/contacts",
        handler: ContactController.list
    },
    {
        method: "GET",
        path: "/contacts/{number}",
        handler: ContactController.listContact
    },
    {
        method: "POST",
        path: "/contacts",
        handler: ContactController.create
    },
    {
        method: "DELETE",
        path: "/contacts/{id}",
        handler: ContactController.remove
    }
]
