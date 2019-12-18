const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
      mysql = require('mysql'),
      helmet = require('helmet'),
      csrf = require('csurf'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      myConnection = require('express-myconnection');

const app = express();
const env = process.env.NODE_ENV || 'development';

// importing routes
const customerRoutes = require('./routes/customer');


// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'bootswatch.com']
  }
}));

//CSRF protection
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf({ cookie: true }))

// CSRF error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
 
  // handle CSRF token errors here
  res.status(403)
  res.send('form tampered with')
})

const database = require('./configs/database')[env];
app.use(myConnection(mysql, database, 'single'));

app.use(express.urlencoded({extended: false}));

// routes
app.use('/', customerRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
});
