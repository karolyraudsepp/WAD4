const express = require('express');
const pool = require('./database');
const cors = require('cors');


const app = express();
/*var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('Public'));

// register the ejs view engine
app.set('view engine', 'ejs');

// listen for requests on port 3000
app.listen(3000, () => {
    console.log("Server is listening to port 3000")
   });/* app.get() is used to respond to Get requests, and it takes two arguments:
1- arg1: represents what path/url you want to listen to (e.g., '/' listens to index path)
2- arg2: represents a function that takes in request and response objects */
app.get('/', (req, res) => {
/* res.sendFile() is a method that can be used to send files as its name indicates. However, it takes the absolute
not the relative path to the file. Therefore, you need to specify the root directory of the file.
To avoid this confusion, you can use "__dirname", which you have access to after installing "lodash" */
 //res.sendFile('./views/index.ejs', { root: __dirname });
 res.render('index');
});

app.get('/posts', async(req, res) => {
    try {
    console.log("get posts request has arrived");
    const posts = await pool.query(
    "SELECT * FROM posts"
    );
    res.render('posts', { posts: posts.rows });
} catch (err) {
    console.error(err.message);
    }
   });
   

app.get('/singlepost/:id', async(req, res) => {

    try {
    const id = req.params.id;
    console.log(req.params.id);
    console.log("get a post request has arrived");
    const posts = await pool.query(
    "SELECT * FROM posts WHERE id = $1", [id]
    );
    res.render('singlepost', { posts: posts.rows[0] });
} catch (err) {
    console.error(err.message);
    }
   });

  app.delete('/posts/:id', async(req, res) => {
    try {
    console.log(req.params);
    const { id } = req.params;
    const post = req.body;
    console.log("delete a post request has arrived");
    const deletepost = await pool.query(
    "DELETE FROM posts WHERE id = $1", [id]
    );
    res.redirect('posts');
    } catch (err) {
    console.error(err.message);
    }
   });

   app.post('/posts', async(req, res) => {
    try {
    const post = req.body;
    console.log(post);
    const newpost = await pool.query(
    "INSERT INTO posts(id, title, body, image) values ($1, $2, $3, $4) RETURNING*", [post.id, post.title, post.body, post.image]
    );
    res.redirect('posts');
    } catch (err) {
    console.error(err.message)
    }
   });
   


app.get('/create', (req, res) => {
    //res.sendFile('./views/contactus.html', { root: __dirname });
    res.render('create');
});

// We will discuss this method next week, when we speak about Middlewares
app.use((req, res) => {
 //res.status(404).sendFile('./views/404.html', { root: __dirname });
 res.status(404).render('404');

});