const { request } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require ('../lib/auth');

router.get('/add', (req,res) => {
    res.render('lab/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { nombre_lab} = req.body;
    const newLab = {
        nombre_lab
    };
    await pool.query('INSERT INTO laboratorio SET ?', [newLab]);
    req.flash ('success','Laboratorio Guardado Correctamente.');
    res.redirect('/lab');
});

/* ================ LISTAR LABORATORIOS ==================== */
router.get('/', isLoggedIn, async (req, res) => {
    const lab = await pool.query('SELECT * FROM laboratorio');
    //date_added = date("Y-m-d H:i:s");
    console.log(lab);
    res.render('lab/list', {lab});
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const lab = await pool.query('SELECT * FROM laboratorio WHERE id_laboratorio = ?', [id]);
    //date_added = date("Y-m-d H:i:s");
    console.log(lab);
    res.render('lab/editar', {lab: lab[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    const { nombre_lab } = req.body;
    const newLab = {
        nombre_lab
    };
    
    await pool.query('UPDATE laboratorio set ? WHERE id_laboratorio = ?', [newLab, id]);
    req.flash ('success','Laboratorio Con ID '+ id + ' Se Edito Correctamente.');
    res.redirect('/lab');
    console.log(id.id);
});

/* ================ ELIMINAR LABORATORIOS ==================== */
router.get('/delete/:id', isLoggedIn, async(req, res) =>
{
    const {id} = req.params;
    await pool.query('DELETE FROM laboratorio WHERE id_laboratorio = ?', [id]);
    req.flash ('success','El Laboratorio Con ID '+ id +' Se Elimino Correctamente.');
    res.redirect('/lab');
});
module.exports = router;