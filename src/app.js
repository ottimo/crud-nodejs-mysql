const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
      mysql = require('mysql'),
      helmet = require('helmet'),
      csrf = require('csurf'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      uuidv4 = require('uuid/v4'),
      session = require('express-session'),
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

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,
    httpOnly: true,
    path: '/',
    expires: expiryDate
  }
}))

// Helmet
app.use(function (req, res, next) {
  res.locals.nonce = uuidv4()
  next()
})

app.use(helmet());
app.use(helmet.noCache())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'bootswatch.com'],
    scriptSrc: [
      "'self'", 
      (req, res) => `'nonce-${res.locals.nonce}'`,
      "'unsafe-inline'"
    ],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false  // This is not set.
  },
  browserSniff: false, // disable to to use with CDN
}));
app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}))

app.post('/report-violation', (req, res) => {
  if (req.body) {
    console.log('CSP Violation: ', req.body)
  } else {
    console.log('CSP Violation: No data received!')
  }

  res.status(204).end()
})

//CSRF protection
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf({ cookie: false }))
app.use(function(req, res, next) {
  res.locals._csrf = req.csrfToken();
  next();
});

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
