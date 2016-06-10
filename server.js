var express    = require('express'),
    _          = require('underscore'),
    app        = express(),
    inflection = require('inflection'),
    nouns      = require('./data/nouns.json'),
    bgs        = require('./data/backgrounds');

var createPath = function() {
  var values = [];
  while (values.length < 2) {
    values.push(Math.floor(Math.random() * nouns.length));
    values = _.uniq(values);
  };
  while (values.length < 6) {
    values.push(Math.floor(Math.random() * 2));
  }
  values.push(Math.floor(Math.random() * bgs.length));
  return values.map(function(val) { return (val + 256).toString(16); }).join(':');
};

var getParams = function(namepath) {
  var params,
      indices = namepath.split(':').map(function(val) { return parseInt(val, 16) - 256; });
  if (indices.length < 7) { return false; }
  params = {
    subject: (indices[4] ? 'the ' : '') + inflection.titleize(indices[2] ? inflection.pluralize(nouns[indices[0]]) : nouns[indices[0]]),
    object: (indices[5] ? 'the ' : '') + inflection.titleize(indices[3] ? inflection.pluralize(nouns[indices[1]]) : nouns[indices[1]]),
    bg: bgs[indices[6]]
  };
  return params;
};

app.get('/', function(req, res) {
  var namepath = createPath();
  res.redirect('/' + namepath);
});

app.get('/:namepath', function(req,res, next) {
  var nameParams = getParams(req.params.namepath);
  if (!nameParams) { next(); }
  res.render('index', { nameParams: nameParams });
});

app.locals.i = inflection;

app.set('port', (process.env.PORT || 5000));
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

exports = module.exports = app;
