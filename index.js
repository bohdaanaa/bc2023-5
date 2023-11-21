const express = require("express");
const multer = require("multer");
const fs = require("node:fs");
const app = express();

const upload = multer();
notes = [];

app.use(express.static("static"));

function checknotes() {
  if (!fs.existsSync("notes.json")) {
    fs.writeFileSync("notes.json", "[]");
  }
}

app.get("/", (req, res) => {
    const instruction = `    Додати нотатку з використанням форми: /UploadForm.html
    Додати нотатку: /upload
    Переглянути нотатки: /notes
    Знайти нотатку: /notes/<назва_нотатки>
    Змінити нотатку: /notes/<назва_нотатки>
    Видалити нотатку: /notes/<назва_нотатки>`;
    res.type('text/plain').send(instruction);
});  

app.post("/upload", upload.none(), (req, res) => {
  checknotes();
  const data = fs.readFileSync("notes.json", "utf-8");
  notes = JSON.parse(data);
  const noteName = req.body.note_name;
  const noteText = req.body.note;
  const existingNote = notes.find((note) => note.title === noteName);

  if (existingNote) {
    return res.status(400).send(`Нотатка "${noteName}" вже існує`);
  }

  notes.push({ title: noteName, text: noteText });
  dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON);

  res.status(201).send(`Нотатку "${noteName}" створено`);
});

app.get("/notes", (req, res) => {
  checknotes();
  const data = fs.readFileSync("notes.json", "utf-8");
  note = JSON.parse(data);
  res.json(note);
});

app.get("/notes/:noteName", (req, res) => {
  checknotes();
  const data = fs.readFileSync("notes.json", "utf-8");
  getnotes = JSON.parse(data);
  const noteName = req.params.noteName;
  const note = getnotes.find((note) => note.title === noteName);
  if (note) {
    res.send(note.text);
  } else {
    res.status(404).send(`Нотатку "${noteName}" не знайдено`);
  }
});

app.put("/notes/:noteName", express.text(), (req, res) => {
  checknotes();
  const noteName = req.params.noteName;
  const updatedNoteText = req.body;
  console.log(updatedNoteText);
  const data = fs.readFileSync("notes.json", "utf-8");
  getnotes = JSON.parse(data);

  const index = getnotes.findIndex((note) => note.title === noteName);

  if (index !== -1) {
    getnotes[index].text = updatedNoteText;

    dataJSON = JSON.stringify(getnotes);
    fs.writeFileSync("notes.json", dataJSON);

    res.status(200).send(`Нотатку "${noteName}" змінено`);
  } else {
    res.status(404).send(`Нотатку "${noteName}" не знайдено`);
  }
});

app.delete("/notes/:noteName", (req, res) => {
  checknotes();
  const noteName = req.params.noteName;
  const data = fs.readFileSync("notes.json", "utf-8");
  getnotes = JSON.parse(data);

  const index = getnotes.findIndex((note) => note.title === noteName);

  if (index !== -1) {
    getnotes.splice(index, 1);

    dataJSON = JSON.stringify(getnotes);
    fs.writeFileSync("notes.json", dataJSON);

    res.status(200).send(`Нотатку "${noteName}" видалено`);
  } else {
    res.status(404).send(`Нотатку "${noteName}" не знайдено`);
  }
});

const port = 8000;
const host = 'localhost';

app.listen(port,host,() => {
  console.log(`Server is running at http://${host}:${port}`);
});