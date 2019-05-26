const express = require('express');
const morgan = require("morgan");
const compression = require('compression');
const serveStatic = require('serve-static');
const basicAuth   = require('basic-auth-connect');
const app = express();

// environment variables for basic authentication
const user = process.env.USER;
const pass = process.env.PASS;

app.set('port', process.env.PORT || 3000);

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

if (user && pass) {
    app.use(basicAuth(user, pass));
  }

app.use(morgan('dev'));
app.use(compression());
app.use(serveStatic(`${__dirname}/public`));

app.get('/chat', (req, res) => {
  const userInputText = req.query.text;
  const callback = req.query.callback;
  const response = { output: []};
  const msg = response.output;

  if(userInputText == 'Button') {
      msg.push({
          type: 'text',
          value: 'What animal do you like?',
          delayMs: 500
      });
      const opts = [];
      opts.push({label: 'dog', value: 'Dog'});
      opts.push({label: 'cat', value: 'Cat'});
      opts.push({label: 'rabbit', value: 'Rabbit'});
      msg.push({type: 'option', options: opts});
  } else if (userInputText == 'image') {
      msg.push({
          type: 'text',
          value: 'I\'ll show you image',
          delayMs: 500
      });
      msg.push({
          type: 'image',
          value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kaiserpinguinjunges.jpg/800px-Kaiserpinguinjunges.jpg'
      })
  } else {
    msg.push({
        type: 'text',
        value: 'You said "' + userInputText + '" , didn\'t you?'
    });
  }
  if (callback) {
    const responseText = callback + '(' + JSON.stringify(response) + ')';
    res.set('Content-Type', 'application/javascript');
    res.send(responseText);
  } else {
    res.json(response);
  }
});

app.listen(app.get('port'), function() {
  console.log('Server listening on port %s', app.get('port'));
});