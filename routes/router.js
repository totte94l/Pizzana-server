const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

/*
  Postman Header
  Content-Type - application/json
*/

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
          req.body.username
        )});`,
        (err, result) => {
          if (result.length) {
            return res.status(409).send({
              msg: 'This username is already in use!'
            });
          } else {
            // username is available
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).send({
                  msg: err
                });
              } else {
                // has hashed pw => add to database
                db.query(
                  `INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}', ${db.escape(
                    req.body.username
                  )}, ${db.escape(hash)}, now())`,
                  (err, result) => {
                    if (err) {
                      throw err;
                      return res.status(400).send({
                        msg: err
                      });
                    }
                    return res.status(201).send({
                      msg: 'Registered!'
                    });
                  }
                );
              }
            });
          }
        }
    );
});

router.post('/login', (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
        (err, result) => {
          // user does not exists
          if (err) {
            throw err;
            return res.status(400).send({
              msg: err
            });
          }
          if (!result.length) {
            return res.status(401).send({
              msg: 'Fel användarnamn eller lösenord!'
            });
          }
          // check password
          bcrypt.compare(
            req.body.password,
            result[0]['password'],
            (bErr, bResult) => {
              // wrong password
              if (bErr) {
                throw bErr;
                return res.status(401).send({
                  msg: 'Fel användarnamn eller lösenord!'
                });
              }
              if (bResult) {
                const token = jwt.sign({
                    username: result[0].username,
                    userId: result[0].id
                  },
                  'SECRETKEY', {
                    expiresIn: '7d'
                  }
                );
                db.query(
                  `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                );
                return res.status(200).send({
                  msg: 'Logged in!',
                  token,
                  user: result[0]
                });
              }
              return res.status(401).send({
                msg: 'Fel användarnamn eller lösenord!'
              });
            }
          );
        }
    );
});

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  res.send('This is the secret content. Only logged in users can see that!');
});

router.get('/menu-items', (req, res, next) => {
  db.query(`SELECT * FROM menuitems`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'Fel'
        });
      }

      else {
        return res.status(200).send({
          msg: 'success',
          menu: result
        });
      }
    }
  );
});

router.put('/edit-item', (req, res, next) => {
  db.query(
    `UPDATE 
      menuitems 
    SET 
      name = ${db.escape(req.body.name)},
      ingredients = ${db.escape(req.body.ingredients)}
    WHERE 
      id = ${db.escape(req.body.id)} `,
    function(err, results) {
      if( err ) {
        console.log("Error")
        return res.status(400).send({
          msg: err
        });
      } else {
        return res.status(200).send({
          msg: "Uppdatering sparad"
        });
      }
    }
  )
});

router.delete('/delete-item', (req, res, next) => {


  const book = req.body.id;
  console.log(book);
});

module.exports = router;