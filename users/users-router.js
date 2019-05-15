const router = require('express').Router();

const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware'
);

module.exports = router;