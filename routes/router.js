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
              msg: 'Användarnamnet är upptaget, försök igen!'
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
                      msg: 'Konto skapat!'
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

router.post('/menu-items', (req, res, next) => {
  db.query(`SELECT * FROM menuitems WHERE owner = ${db.escape(req.body.id)}`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
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
      ingredients = ${db.escape(req.body.ingredients)},
      price = ${db.escape(req.body.price)},
      glutenFree = ${db.escape(req.body.glutenFree)},
      lactoseFree = ${db.escape(req.body.lactoseFree)}
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
  console.log("Körs: ", req.body.data )
  db.query(`
    DELETE FROM menuitems WHERE id=${db.escape(req.body.data.id)}
  `, function(err, result) {
    if( err ) {
      return res.status(500).send({
        msg: 'Error'
      });
    }

    return res.status(200).send({
      msg: 'Rätt borttagen!'
    });
  })
});

router.post('/add-item', (req, res, next) => {
  db.query(
    `INSERT INTO 
      menuitems (name, ingredients, category, glutenFree, lactoseFree, price, owner)
    VALUES
     (${db.escape(req.body.data.data.name)},
      ${db.escape(req.body.data.data.ingredients)},
      ${db.escape(req.body.data.data.category)},
      ${db.escape(req.body.data.data.glutenFree)},
      ${db.escape(req.body.data.data.lactoseFree)},
      ${db.escape(req.body.data.data.price)},
      ${db.escape(req.body.data.data.owner)})`, function(err, result) {

      if( err ) {
        return res.status(500).send({
          success: 'false',
          msg: 'Fel! Kunde inte lägga till rätt'
        });
      }
  
      return res.status(200).send({
        success: 'true',
        msg: 'Rätten tillagd i menyn'
      });
    })
});

router.post('/restaurant-info', (req, res, next) => {
  db.query(`SELECT * FROM restaurants WHERE owner = ${String(db.escape(req.body.id))}`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      else {
        return res.status(200).send({
          msg: 'success',
          info: result
        });
      }
    }
  );
});

router.put('/edit-about', (req, res, next) => {
  db.query(
    `UPDATE 
      restaurant_info
    SET 
      name = ${db.escape(req.body.name)},
      description = ${db.escape(req.body.description)},
      address = ${db.escape(req.body.address)},
      open_hours = ${db.escape(req.body.openHours)},
      phone = ${db.escape(req.body.phone)}
    WHERE 
      id = 1`,
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


module.exports = router;