const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const delay = require('express-delay');
const app = express();
const faker = require("faker");
const _ = require("lodash");

const port = process.env.VIRTUAL_PORT || 8200;
const host = process.env.VIRTUAL_HOST || 'localhost';

// To Get Post params
app.use(bodyParser.json());

// Allow CORS
app.use(cors());

// Static files directory
app.use(express.static(__dirname + '/public'));

// Dealy response
app.use(delay(500));

/**
 * data contains list of Animes
 */
let animes = _.times(89, function(n) {
  let id = n + 1;
  return {
    id: id,
    poster: `http://${host}/images/posters/${id}.jpg`,
    title: faker.lorem.sentence(3),
    videos: faker.random.number(300),
    description: faker.lorem.sentences(8)
  };
});

/**
 * Find Single Anime by Id
 * @param  {Number} id
 * @return {Object}
 */
function find(id) {
  return data.find(element => {
    return parseInt(id) === element.id
  });
}

/**
 * Routes
 */

// Animes list
app.get('/anime', (req, res) => {
  let page = parseInt(req.query.page || 1);
  let perPage = 15;
  let maxPage = Math.ceil(animes.length / perPage);

  if (page > maxPage) {
    page = maxPage;
  }

  if (page < 1) {
    page = 1;
  }

  let start = (page - 1) * perPage;
  let end = perPage * page;

  let data = animes.slice(start, end);
  let nextPage = page + 1;
  let prevPage = page - 1;

  res.send({
    total: animes.length,
    current_page: page,
    per_page: perPage,
    next_page_url: (page < maxPage) ? `http://${host}/anime/?page=${nextPage}` : '',
    prev_page_url: (page > 1) ? `http://${host}/anime/?page=${prevPage}` : '',
    data: data
  });
});

// Anime Details
app.get('/anime/:id', (req, res) => {
  let params = req.params;
  let obj = find(params.id);

  if (! obj) {
    res.status(404)
      .send('Not found');
    return
  }

  res.send(obj);
});

// User Login
app.post('/login', (req, res) => {
  if ('doe' !== req.body.username || 'password' !== req.body.password) {
    res.status(403)
      .send('Wrong Credentials');
      return;
  }

  res.send({
    username: "Jhon Doe",
    accessToken: "Pr6UcSRzjIx5uHnodLvqdk8vPsikg="
  });
});

// Start the server
app.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
