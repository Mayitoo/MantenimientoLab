const { request } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require ('../lib/auth');


//TICKET SOPORTE
/* ================ AGREGRAR ==================== */
router.get('/add', isLoggedIn, async (req, res) =>{
    //const lab = await pool.query('SELECT laboratorio.nombre, computadora.marca, computadora.no_serie FROM computadora INNER JOIN laboratorio ON computadora.fk_laboratorio = laboratorio.id;');
    const lab = await pool.query('SELECT * FROM laboratorio');
    const compu = await pool.query('SELECT * FROM pc');
    res.render('ticket/add', {lab, compu});
});

 router.post('/add', isLoggedIn, async (req, res) =>{
     const {fecha, descripcion, persona_rep, estatus, fk_laboratorio, fk_no_serie} = req.body;
     const newsoporte = {
         fecha,
         descripcion,
         persona_rep,
         estatus,
         fk_laboratorio,
         fk_no_serie
     };
    await pool.query('INSERT INTO ticket_soporte set ?',[newsoporte]);
    req.flash ('success','La PC Se Guardo Correctamente.');
     res.redirect('/ticket');
 });

 /* ================ LISTAR ==================== */

 router.get('/', isLoggedIn, async (req, res) =>{
    const soporte = await pool.query('SELECT * FROM ticket_soporte');
    res.render('ticket/list', {soporte});
});

/* ================ ELIMINAR ==================== */

router.get('/delete/:id', isLoggedIn, async(req, res) =>
{
    const {id} = req.params;
    await pool.query('DELETE FROM ticket_soporte WHERE id_ticket = ?', [id]);
    req.flash ('success','El Ticket Con El ID '+ id + ' Se Elimino Correctamente.');
    res.redirect('/ticket');
});

/* ================ EDITAR ==================== */

router.get('/edit/:id', isLoggedIn, async(req, res) =>{
    const { id } = req.params;
    const soporte = await pool.query('SELECT a.id_ticket, a.fecha, a.descripcion, a.persona_rep, a.estatus, a.fk_laboratorio, b.nombre_lab, a.fk_no_serie, c.no_serie FROM ticket_soporte a, laboratorio b, pc c WHERE a.fk_laboratorio = b.id_laboratorio and a.fk_no_serie = c.no_serie and id_ticket = ?', [id]);
    const lab = await pool.query('SELECT * FROM laboratorio');
    const compu = await pool.query('SELECT * FROM pc');
    res.render('ticket/edit',{soporte: soporte[0], lab, compu});
    
});

router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const {id} = req.params;
    const {fecha, descripcion, persona_rep, estatus, fk_laboratorio, fk_no_serie} = req.body;
    const newTicket = {
        fecha,
        descripcion,
        persona_rep,
        estatus,
        fk_laboratorio,
        fk_no_serie
    };
    console.log(newTicket);
    console.log(id);
    const ticket = await pool.query('UPDATE ticket_soporte set ? WHERE id_ticket = ?', [newTicket, id]);
    
    req.flash ('success','El Ticket Con El ID '+ id + ' Se Edito Correctamente.');
    console.log(ticket)
    res.redirect('/ticket');
});


module.exports = router;