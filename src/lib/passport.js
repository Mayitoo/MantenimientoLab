//const { Passport } = require('passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
  //console.log(req.body);
 const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    //console.log(rows.length)
 if(rows.length > 0) 
 {
     const user = rows[0];
     const validPassword = await helpers.matchPassword(password, user.password);
     if(validPassword){
         done(null, user, req.flash('success','Bienvenido ' + user.username));
     } else{
         done(null, false, req.flash('message','Contraseña incorrecta'));
     } 
     
 }
 else{
    return done(null, false, req.flash('message','Usuario no existente'));
 }
}));

// passport.use('local.signin', new LocalStrategy ({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback: true
// } , async (req, username, password, done) => {
//     const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
//     if (rows.length > 0) {
//         const user = rows[0];
//         const validPassword = await helpers.matchPassword(password, user.password);
//         if (validPassword){
//             done(null, user, req.flash('success','Bienvenido' + user.username));
//         } else {
//             done(null, false, req.flash('message', 'Contraseña Incorrecta'));
//         } 
//     } else {
//         return done(null, false, req.flash('message', 'El nombre de usuario no existe'));
//     }
// }));

passport.use('local.signup', new LocalStrategy( {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{
    const { fullname, correo } = req.body;
         const newUser = {
             username,
             password,
             fullname,
             correo
         };
         //console.log(newUser);
         //Cifrar contraseña
          newUser.password = await helpers.encryptPassword(password);
          const result = await pool.query ('INSERT INTO users SET ?', [newUser]);
          console.log(result);  
          newUser.id_user = result.insertId;
          //NewUser para que lo almacene en una session
          return done(null, newUser);
}));

passport.serializeUser((usr, done) =>{
         done(null, usr);
});
    
passport.deserializeUser( async (id, done) => {
    //console.log(id.id);
    const rows = await pool.query('SELECT * FROM users WHERE id_user = ?' , [id.id_user] );
    console.log(id.id_user)
    console.log(rows[0]);
    done(null, rows[0]);
});
