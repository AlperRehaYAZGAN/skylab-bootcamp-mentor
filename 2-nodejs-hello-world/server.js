// YTU - Skylab: This is the simple twitter replica server that
//  only inserts tweets into the database and returns all the tweets
// Libraries: express, body-parser, knex, sqlite3, ejs
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './twitter.db'
    }
});

// tweet table schema is: id, username, body
knex.schema.hasTable('tweets').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('tweets', (table) => {
            table.increments('id').primary();
            table.string('username');
            table.string('tweet');
        });
    }
});

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');


app.get('/',async (req, res) => {
    // get alll tweets and render them
    const tweets = await knex.select().table('tweets')
    res.render('tweets.ejs', { tweets: tweets })
})

app.get('/create', async (req, res) => {
    // render the create tweet form
    res.render('create-tweet.ejs');
})

app.post('/api/tweets', async (req, res) => {
    // insert tweet into database
    await knex('tweets').insert({ username: req.body.username, tweet: req.body.body })
    res.redirect('/');
});

const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`);
});