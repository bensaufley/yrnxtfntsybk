var express = require('express'),
    _       = require('underscore'),
    app     = express();

app.get('/', function(req, res) {

});

app.set('port', (process.env.PORT || 5000));
app.set('views', './views');
app.set('view engine', 'pug');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

exports = module.exports = app;
