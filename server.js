var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
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
    title: 'Article One | Manasi Acharya',
    heading: 'Article One',
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
                    ${date}
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
    
    })
});

var counter=0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
    res.send(counter.toString())
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

app.get('/:articleName', function(req, res) {
	
	//articleName == articleOne
	//articles[articleName] == {} content object for article one
	
	var articleName = req.params.articleName;
	res.send(createTemplate(articles[articleName]));
});

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
