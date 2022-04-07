const express = require('express');
const router = express.Router();
const passport = require('passport');

// const passport = require('passport')
const {isLoggedIn} = require('../lib/auth')
const {isNotLoggedIn} = require('../lib/auth')
const pool = require('../database');
const helpers = require('../lib/helpers');
const Handlebars = require('handlebars')
const events = require('events').EventEmitter;
const emmiter = new events.EventEmitter();



Handlebars.registerHelper("nav", (a) => {
    return a == 'Administrador'
      ? `<li class="">
            <a href="/lab" class="nav_link">
                <i class="uil uil-keyboard button_icon"></i> Laboratorio
            </a>
        </li>
        <li class="">
            <a href="/pc" class="nav_link">
                <i class="uil uil-desktop button_icon"></i> Computadoras
            </a>
        </li>
        <li class="">
            <a href="/usuario" class="nav_link">
            <i class="uil uil-user-plus button_icon"></i> Usuarios
            </a>
        </li>`
      : "";
  });

router.get('/usuario', isLoggedIn, async  (req,res) => {
    const usuario = await pool.query('SELECT * FROM users');
   
        res.render('auth/list.hbs',{usuario} );


});

router.get('/usuario?buscaruser=:rol', isLoggedIn, async  (req,res) => {
    const rol = req.params;
    const usuario = await pool.query(`SELECT * FROM users WHERE rol ${[rol]}`);
    console.log(usuario);
        res.render('auth/list.hbs',{usuario});


});


router.get('/usuario/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const usuario = await pool.query('SELECT * FROM users WHERE id_user = ?', [id]);
    res.render('auth/edit.hbs', {usuario: usuario[0]});
});

// document.addEventListener("keyup", e=>{
//     if(e.target.matches("#buscaruser")){
//         if(e.key === "Escape")e.target.value = "";

//         // document.querySelectorAll(".filtrar").forEach( tabla =>{
//         //     tabla.textContent.toLowerCase().includes(e.target.value.toLowerCase())
//         //     ?tabla.classList.remove("filtro")
//         //     :tabla.classList.add("filtrar")
//         // })
//         pool.query('SELECT * FROM users WHERE username = ?')


//     }
// })



router.post('/usuario/edit/:id', isLoggedIn,  async (req,res) => {
    const { id } = req.params;
    const {  fullname, correo, username, rol} = req.body;
    const newUsuario = {
        fullname,
        
        username,
        correo,
        rol
        //date_added,
        //id_categoria: req.user.id
    };
    //console.log(newLink);
    const usu = await pool.query('UPDATE users set ? WHERE id_user = ?', [newUsuario, id]);
    console.log(usu);
    req.flash('success', 'Se actualizo satisfactoriamente');
    res.redirect('/usuario');
});



router.get('/usuario/delete/:id', isLoggedIn, async  (req,res) => {
    const {id} = req.params;
    const borrar = await pool.query('DELETE FROM users WHERE id_user = ?', [id]);
    console.log(borrar);
    req.flash('success','Se borro satisfactoriamente');
    res.redirect('/usuario');
});








router.get('/registro', isLoggedIn, (req,res) =>{
    res.render('auth/registro')
});

router.post('/registro', isLoggedIn, passport.authenticate('local.signup',{
    successRedirect: '/usuario',
    failureRedirect: '/usuario/add',
    failureFlash: true
}));

router.get('/inicio-sesion', isNotLoggedIn, (req,res) =>{
    res.render('auth/inicio_sesion');
});

router.post('/inicio-sesion', isNotLoggedIn, (req,res, next ) =>{
    passport.authenticate('local.signin',{
        successRedirect: '/ticket',
        failureRedirect: '/inicio-sesion',
        failureFlash: true
    })
    (req, res, next)
    //console.log(req);
});

// router.get('/perfil', isLoggedIn, (req,res) =>{
//     res.render('perfil')
// });

router.get('/cerrar-sesion', isLoggedIn, (req, res) =>{
    req.logOut();
    res.redirect('/inicio-sesion')
})

module.exports = router;