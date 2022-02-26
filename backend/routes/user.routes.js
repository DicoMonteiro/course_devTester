const UserController = require('../controllers/user.controller')


module.exports = [ 
    {
        method: "POST",
        path: "/user",
        handler: UserController.create
    },
    {
        method: "POST",
        path: "/session",
        handler: UserController.login
    },
    {
        method: "GET",
        path: "/user/{email}",
        handler: UserController.listUser
    },
    {
        method: "DELETE",
        path: "/user/{id}",
        handler: UserController.remove
    }
]