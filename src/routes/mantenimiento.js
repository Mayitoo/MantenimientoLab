const { request } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require ('../lib/auth');

/* ================ AGREGAR ==================== */

router.get('/add', isLoggedIn, async(req, res) =>{
    const soporte = await pool.query('SELECT * FROM ticket_soporte');
    res.render('mantenimiento/add',{soporte});
});

router.post('/add', isLoggedIn, async (req, res) =>{
    const {fk_ticket, descripcion, estatus} = req.body;
    const newMantenimiento = {
        fk_ticket,
        descripcion,
        estatus
    };
   await pool.query('INSERT INTO mantenimiento set ?',[newMantenimiento]);
   req.flash ('success','Mantenimiento Guardado Correctamente.');
    res.redirect('/mantenimiento');
});

/* ================ LISTAR ==================== */

router.get('/', isLoggedIn, async (req, res) =>{
    const mantenimiento = await pool.query('SELECT a.id_mantenimiento, a.fk_ticket, b.fecha, b.descripcion as desc_ticket, a.descripcion, b.persona_rep, a.descripcion, a.estatus FROM mantenimiento a, ticket_soporte b WHERE a.fk_ticket = b.id_ticket and a.id_mantenimiento ');
    res.render('mantenimiento/list', {mantenimiento});
});

/* ================ ELIMINAR ==================== */

router.get('/delete/:id', isLoggedIn, async(req, res) =>
{
    const {id} = req.params;
    await pool.query('DELETE FROM mantenimiento WHERE id_mantenimiento = ?', [id]);
    req.flash ('success','Mantenimiento Con El ID '+ id +' Se Elimino Correctamente.');
    res.redirect('/mantenimiento');
});

/* ================ EDITAR ==================== */

router.get('/edit/:id', isLoggedIn, async(req, res) =>{
    const {id} = req.params;
    const mantenimiento = await pool.query('SELECT * FROM mantenimiento WHERE id_mantenimiento = ?', [id]);
   const soporte = await pool.query('SELECT * FROM ticket_soporte');
   
    res.render('mantenimiento/edit',{mantenimiento: mantenimiento[0], soporte});
});

router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    const { fk_ticket, descripcion, estatus } = req.body;
    const newcompu = {
        fk_ticket,
        descripcion,
        estatus
    };
    console.log(newcompu);
    await pool.query('UPDATE mantenimiento set ? WHERE id_mantenimiento = ?', [newcompu, id]);
    req.flash ('success','Mantenimiento del ticket '+ newcompu.fk_ticket + ' Se Edito Correctamente.');
    res.redirect('/mantenimiento');
    console.log(id.id);
});

module.exports = router;