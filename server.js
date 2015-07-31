var express = require('express');
var cors = require('cors');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var exphbs  = require('express-handlebars');

//Setting up firebase
var Firebase = require("firebase");
var myDataRef = new Firebase('https://blistering-inferno-5024.firebaseio.com/');


// var PORT_num = process.env.PORT;
app.set('port', (process.env.PORT || 8000));

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/bookDetail', cors(), function(req, res, next) {
  console.log(req.query.book_isbn);
  var options = {
    host: 'isbndb.com',
    path: '/api/v2/json/UTUJEB5A/prices/' + req.query.book_isbn
  };

  http.get(options, function(book) {
    var bodyChunks = [];
    book.on('data', function(chunk) {
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      res.send(body);
    })
  });
});

//Function to update database checkin/checkout number
// action: "checkin"/"checkout"
var libUpdateUserLibraryRatio = function(org, username, action) {
 if (typeof action !== 'string') {
   console.error('libUpdateUserLibraryRatio requires "checkin"/"checkout" input');
 };
 var added = false;
 var ref = myDataRef.child(org).child('users').child(username).child('libraryRatio').child('checkout');

 var act = function() {
   added = true;
   ref.transaction(function(checkout) {
     if (action === 'checkin') {
       console.log(username + "'s new checkout after checkin total is " + (checkout + 1))
       return checkout + 1;
     };
     if (action === 'checkout') {
       console.log(username + "'s new checkout after checkout total is " + (checkout - 1))
       return checkout - 1;
     };
   });
 }

 ref.on('value', function() {
   added || act();
 });
};

//Update the database checkin/checkout totals on confirmation of checkout
app.get('/checkout/*', function(req, res) {
  console.log('checkout link was clicked for following users:');
  var breakDown = req.url;
  breakDown = breakDown.split('/');
  var org = breakDown[2]
  var giver = breakDown[3];
  var receiver = breakDown[4];
  console.log('organization: ' + org);
  console.log('giver: ' + giver);
  libUpdateUserLibraryRatio(org, giver, 'checkin');
  console.log('receiver: ' + receiver);
  libUpdateUserLibraryRatio(org, receiver, 'checkout');

  res.redirect('http://cliparts.co/cliparts/qcB/p74/qcBp74Kc5.png');
});


app.post('/sendMail', function(req, res) {
  var data = req.body;

  //gather mail options from body
  var mailOptions = {
    from: data.from, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plaintext body
    // html: data.html // html body
  };
  console.log(mailOptions)

  //create transporter object w/ mailgun credentials
  var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: 'postmaster@sandboxf3aff1867e5c49139328f9111d46d528.mailgun.org',
      pass: '407282f72867dc1d70b2cb41e1ad670f'
    }
  });

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Message sent");
      res.send("sent");
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('OmniBooks is running on port', app.get('port'));
});

// app.listen(PORT_num || 8000);
