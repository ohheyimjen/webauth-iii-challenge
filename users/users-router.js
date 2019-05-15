const router = require('express').Router();

const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware'
);

// require new middleware that was just written to check role
const checkRole = require('../auth/check-role-middleware');

//add new middleware checkRole into get
router.get('/', restricted, checkRole('Student'),(req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;