const User = require('../models/user');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');
    User.findByToken(token)
        .then(user => {
            if (!user) {
                Promise.reject();
            }
            // console.log("In authenticate: " + user);
            req.user = user;
            req.token = token;
            next();
        }).catch(e => {
            res.status(401).send();
        })
}

module.exports = authenticate;
