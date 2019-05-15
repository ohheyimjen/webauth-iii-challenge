const router = require('express').Router();
const bcrypt = require('bcryptjs');

// require web token
const jwt = require('jsonwebtoken');

// bring in new secrets file
const secrets = require('../config/secrets');

const Users = require('../users/users-model');


// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // 2. declare new token
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!, have a token`, token, // 2.5. ADD THE TOKEN RETURN
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//3. create function for generating token
function generateToken(user) {
  const payload = {
    subject: user.id, // this is what the token is about
    username: user.username,
    //9. add new roles data to token, would normally come from database
    roles: ['Student'],
  }
  //how long we want token to last for
  const options = {
    expiresIn: '1d',
  }

  return jwt.sign(payload, secrets.jwtSecret, options); //this method is synchronous (runs in order)
}

module.exports = router;