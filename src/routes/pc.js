const { request } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn, isNotLoggedIn} = require ('../lib/auth');

/* =================== ADD ============================== */

router.get('/add', isLoggedIn, async (req, res) =>{
    const lab = await pool.query('SELECT * FROM laboratorio');
    res.render('pc/add', {lab});
});

router.post('/add', isLoggedIn, async (req, res) =>{
    const {no_serie, marca, tipo_monitor, memoria, ram, procesador, estatus, tipo_conexion, fk_laboratorio} = req.body;
    const newLink = {
        no_serie,
        marca,
        tipo_monitor,
        memoria,
        ram,
        procesador,
        estatus,
        tipo_conexion,
        fk_laboratorio
    };
   await pool.query('INSERT INTO pc set ?',[newLink]);
   req.flash ('success','La PC Se Guardo Correctamente.');
   //res.send('Listo');
    res.redirect('/pc');
});

/* =================== LIST ============================== */

router.get('/', isLoggedIn, async (req, res) =>{
    const computadora = await pool.query('SELECT * FROM pc');
    res.render('pc/list', {computadora});
});


/* =================== DELETE ============================== */
router.get('/delete/:no_serie', isLoggedIn, async(req, res) =>
{
    const {no_serie} = req.params;
    await pool.query('DELETE FROM pc WHERE no_serie = ?', [no_serie]);
    req.flash ('success','La PC Con El Numero de Serie '+ no_serie + ' Se Elimino Correctamente.');
    res.redirect('/pc');
});

/* =================== EDIT ============================== */

 router.get('/edit/:no_serie', isLoggedIn, async(req, res) =>{
     const { no_serie } = req.params;
     const computadora = await pool.query('SELECT a.no_serie, a.marca, a.tipo_monitor, a.memoria, a.ram, a.procesador, a.estatus, a.tipo_conexion, a.fk_laboratorio, b.nombre_lab FROM pc a, laboratorio b WHERE a.fk_laboratorio = b.id_laboratorio and a.no_serie = ?', [no_serie]);
    const lab = await pool.query('SELECT * FROM laboratorio');
    
     res.render('pc/edit',{computadora: computadora[0], lab});
 });

 router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    const { no_serie, marca, tipo_monitor, memoria, ram, procesador, estatus, tipo_conexion, fk_laboratorio } = req.body;
    const newcompu = {
        no_serie,
        marca,
        tipo_monitor,
        memoria,
        ram,
        procesador,
        estatus,
        tipo_conexion,
        fk_laboratorio
    };
    console.log(newcompu);
    await pool.query('UPDATE pc set ? WHERE no_serie = ?', [newcompu, id]);
    req.flash ('success','La PC Con El Numero de Serie '+ newcompu.no_serie + ' Se Edito Correctamente.');
    res.redirect('/pc');
 });
 
module.exports = router;