const express = require ('express');
const morgan = require ('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const { appendFileSync } = require('fs');
const session = require('express-session');
const mysqlStore =require('express-mysql-session')
const passport = require('passport');
const { database } = require('./keys');
//const passport = require('passport');
const Handlebars = require('handlebars');
const multer = require('multer');
//Inicializadores
const app = express();
require('./lib/passport')

const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/img'),
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});


        // Handlebars.registerHelper('Nav', (a, b, opts) => {
        // return a == b ? opts.fn(this) : opts.inverse(this);
        // });
        

//console.log(exphbs);
//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,  'views'));

 app.engine('.hbs', engine ({
     defaultLayout: 'main',
     layoutsDir: path.join(app.get('views'), 'layouts'),
     partialsDir: path.join(app.get('views'), 'partials'),
     extname: '.hbs',
     helpers: require('./lib/handlebars')
 }));
 app.set('view engine', '.hbs');


//Midlewares
app.use(session({
    secret: 'ItsDanielGtzMysqlSession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());



//Variables Globales
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes

app.use(require('./routes/authentication'));
app.use('/lab', require('./routes/lab'));
app.use('/pc', require('./routes/pc'));
app.use('/ticket', require('./routes/ticket'));
app.use('/mantenimiento', require('./routes/mantenimiento'));
app.use('/usuario',require('./routes/authentication'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

