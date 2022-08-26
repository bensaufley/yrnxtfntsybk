var express    = require('express'),
    _          = require('underscore'),
    app        = express(),
    inflection = require('inflection'),
    nouns      = require('./data/nouns.json'),
    bgs        = require('./data/backgrounds');

var randBool = () => Number(Math.random() > 0.5);
var randNoun = () => Math.floor(Math.random() * nouns.length);
var randBg = () => Math.floor(Math.random() * bgs.length);

var createPath = function() {
  var values = [];
  while (values.length < 2) {
    values.push(randNoun());
    values = _.uniq(values);
  };
  while (values.length < 6) {
    values.push(randBool());
  }
  values.push(randBg());
  if (Math.random() < 0.5) {
    let secondNoun;
    do {
      secondNoun = randNoun();
    } while (values.slice(0, 2).includes(secondNoun));
    values.push(secondNoun, randBool(), randBool());
  }
  return values.map(function(val) { return (val + 256).toString(16); }).join(':');
};

/**
 * 
 * @param {number} article 
 * @param {number} noun 
 * @param {number} plural 
 * @returns {string}
 */
var formatNoun = (article, noun, plural) => (article ? 'the ' : '') + inflection.titleize(plural ? inflection.pluralize(nouns[noun]) : nouns[noun]);

var getParams = function(namepath) {
  var params,
      indices = namepath.split(':').map(function(val) { return parseInt(val, 16) - 256; });
  if (indices.length < 7) { return false; }
  var [
    subject,
    object,
    subjectPlural,
    objectPlural,
    subjectArticle,
    objectArticle,
    bg,
    extraObject,
    extraObjectPlural,
    extraObjectArticle,
  ] = indices;
  params = {
    subject: formatNoun(subjectArticle, subject, subjectPlural),
    object: formatNoun(objectArticle, object, objectPlural) + (extraObject ? ' and ' + formatNoun(extraObjectArticle, extraObject, extraObjectPlural) : ''),
    bg: bgs[bg]
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
