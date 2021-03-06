var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = {
    user: 'acharya221b',
    database: 'acharya221b',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
    //DB_PASSWORD is an environment variable, so that a user cannot access the password through the source code.
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); //for json content for every incoming request
app.use(session({           //Tell express to use session library
    secret: 'someRandomSecretValue', //To encrypt the cookies
    cookie: {maxAge: 1000*60*60*24*30}      //The max age is in millisecs. The cookies will last for 1 month in this case
}));

var articles = {
    articleOne: {
    title: 'Article One | Manasi Acharya',
    heading: 'Article One',
    date: '19th Aug, 2017',
    content: `<p>
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    
                </p>
                 <p>
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    
                </p>
                <p>
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    
                </p>
                <p>
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    This is my first article. This is my first article. This is my first article.
                    
                </p>`

    },
    articleTwo: {
    title: 'Article Two | Manasi Acharya',
    heading: 'Article Two',
    date: '25th Aug, 2017',
    content: `<p>
                    This is my second article.
                </p>`
    },
    'article-three': {
    title: 'Article Three | Manasi Acharya',
    heading: 'Article Three',
    date: '30th Aug, 2017',
    content: `<p>
                    This is my third article.
                </p>`
    }
        
};

function createTemplate(data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmlTemplate = `
    <html>
        
        <head>
            <title>
                ${title}
            </title>
         <link href="/ui/style.css" rel="stylesheet" />
        </head>
       
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date.toDateString()}
                    <!-- $ {date} is a javascript date object. We have to convert it to simple date format. -->
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
    //pbkdf2Sync is a function in default nodejs library crypto. It stands for Passwd based key derivation fn
    //crypto.pbkdf2Sync(password,salt,iterations,keylen,digest);
}

app.get('/hash/:input', function (req, res) {
   var hashedString = hash(req.params.input,'this-is-some-random-string'); //hash(input,salt);
   res.send(hashedString);
});

app.post('/create-user', function (req, res){
    // username, password
    //JSON Request
    var username = req.body.username;
    var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)',[username, dbString], function (err, result){
      if(err){
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: '+ username);
      }
   });
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password; 
    pool.query('SELECT * FROM "user" WHERE username = $1',[username], function (err, result){
      if(err){
          res.status(500).send(err.toString());
      } else {
          if(result.rows.length === 0){
              res.status(403).send('username/password is invalid');
          } else {
              //Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); //Creating a hash based on the password submitted and original salt
              if(hashedPassword === dbString) {
              //Set the session
              req.session.auth = {userId: result.rows[0].id}; //to create session object
              //Set cookie with a session id
              //internally, on the server side, it maps the session id to an object
              //The object is, {auth: {userId}}
              
              
              res.send('Credentials Correct!');
              
              } else {
                  res.send(403).send('username/password is invalid');
              }
          }
          
      }
   });
    
});

app.get('/check-login', function (req, res) {
   if(req.session && req.session.auth && req.session.auth.userId) {
       res.send('You are logged in: ' + req.session.auth.userId.toString());
   } else {
       res.send('You are not logged in');
   }
    
});  //To test that the session object is created

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('Logged out');
});


var pool = new Pool(config);
app.get('/test-db', function (req, res) {
   //Make a select request.
   //Return the response with the result.
    pool.query('SELECT * FROM test', function (err, result) {
        if(err) {
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    
    });
});

var counter=0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/articles/:articleName', function (req, res) {
   //pool.query("SELECT * FROM article WHERE title= '"+ req.params.articleName + "'", function (err, result) {
   pool.query("SELECT * FROM article WHERE title= $1", [req.params.articleName ], function (err, result) {
      if(err) {
          res.status(500).send(err.toString());
      } else {
          if(result.rows.length === 0) {
              res.status(404).send('Article not found');
          } else {
              var articleData = result.rows[0];
              res.send(createTemplate(articleData));
          }
      }
   }); 
});

var names = [];
app.get('/submit-name', function (req, res) //Send the data (name) as a part of the url object 
{
   /*We can also send data as a query parameter. The data will be the bit of the URL after the '?'  
   URL: /submit-name?name=xxxxx To extract 'xxxx' from the URL use req.query.name instead of req.params.name and also remove /:name from the above line /submit-name/:name*/
   
   //Get the name from the request object
   var name = req.query.name; //extract the names from the request
   names.push(name);
   //JSON: JavaScript Object Notation used for converting javascript objects into string
   res.send(JSON.stringify(names)); //Convert Javascript objects array into string.
    
});

/* app.get('/:articleName', function(req, res) {
	
	//articleName == articleOne
	//articles[articleName] == {} content object for article one
	
	var articleName = req.params.articleName;
	res.send(createTemplate(articles[articleName]));
}); */

/*
app.get('/article-one', function(req, res) {
	
	res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});

app.get('/article-two', function(req, res) {
	
	res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function(req, res) {
	
	res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});
*/

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
