    // middleware/users.js
    module.exports = {
        validateRegister: (req, res, next) => {

          const forbiddenNames = ['home', 'sign-up', 'login', 'meny', 'about', 'account', 'admin']

          // username min length 3
          if (!req.body.username || req.body.username.length < 3) {
            return res.status(400).send({
              msg: 'Ditt användarnamn måste bestå av minst tre tecken.'
            });
          }

          // password min 6 chars
          if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
              msg: 'Ditt lösenord får inte vara kortare än sex tecken.'
            });
          }

          // password (repeat) does not match
          if (
            !req.body.password_repeat ||
            req.body.password != req.body.password_repeat
          ) {
            return res.status(400).send({
              msg: 'Lösenorden matchar inte.'
            });
          }

           // forbidden route names
           if(forbiddenNames.includes(req.body.routeName)) {
              return res.status(400).send({
                msg: 'Webbadressen innehåller ett förbjudet ord, prova igen.'
              });
           }

          next();
        },
        isLoggedIn: (req, res, next) => {
            try {
              const token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(
                token,
                'SECRETKEY'
              );
              req.userData = decoded;
              next();
            } catch (err) {
              return res.status(401).send({
                msg: 'Your session is not valid!'
              });
            }
          }
      };