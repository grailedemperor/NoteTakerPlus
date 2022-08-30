const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const util = require('util');
const helpers = require('./public/assets/js/helpers.js');
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// On the back end, the application should include a `db.json` file 
// that will be used to store and retrieve notes using the `fs` module.


// `GET /api/notes` reads db.json
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});



// GET/notes => notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// GET * => INDEX.HTML
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);



// `POST /api/notes` should receive a new note to 
// save on the request body, add it to the `db.json` file, 
// and then return the new note to the client. 
// You'll need to find a way to give each note a unique id 
// when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        noteId: helpers(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding note');
    }
  });



// * `DELETE /api/notes/:id` should receive a query parameter that contains 
// the id of a note to delete. To delete a note, you'll need to read all 
// notes from the `db.json` file, remove the note with the given `id` property,
//  and then rewrite the notes to the `db.json` file.


// --------------------------------------------
const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };  

  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
