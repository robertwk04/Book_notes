import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv"

const app = express()
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

db.connect();
let books=[{}];
async function updateBooks() {
  try {
    const result = await db.query('SELECT * FROM books');
    const array = result.rows;
    return array;
  } catch (error) {
    console.error('Eroare la interogare:', error);
  }
}
books=await updateBooks();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let notes=[{}];
async function updateNotes() {
  try {
    const result = await db.query('SELECT * FROM notes');
    const array = result.rows;
    return array;
  } catch (error) {
    console.error('Eroare la interogare:', error);
  }
}
app.get('/', async (req, res) => {
  books=await updateBooks();
  res.render("index.ejs",{books:books});
});
app.get('/new', (req, res) => {
    res.render("new.ejs");
  });
app.get('/notes/:title', async(req, res) => {
    const title=req.params.title;
    const index=books.findIndex(book => book.title.replace(/ /g, '_') == title);
    notes=await updateNotes();
    res.render("notes.ejs",{book:books[index],notes:notes});
  });
app.post("/notes/addNote/:id",async (req,res)=>{
    const id=req.params.id;
    const index=books.findIndex(book => book.id == id);
    try {
      await db.query("INSERT INTO notes (note_text, book_id) VALUES ($1,$2)",[req.body.noteText,id]);
    } catch (error) {
      console.log(error);
    }
    res.redirect("/notes/"+books[index].title.replace(/ /g, '_'));
});
app.post("/notes/delete/:bookId/:noteId",async (req,res)=>{
let bookId=req.params.bookId;
let noteId=req.params.noteId;
let bookIndex=books.findIndex(obj => obj.id == bookId);
try {
  await db.query("DELETE FROM notes WHERE id=$1",[noteId]);
} catch (error) {
  console.log(error);
}
res.redirect("/notes/"+books[bookIndex].title.replace(/ /g, '_'));
});
app.post("/add",async (req,res)=>{
  let obj=req.body;
  const newBook=[
    obj.title,
    obj.author,
    obj.nationality,
    obj.description,
    obj.rating,
    obj.year,
    obj.image,
    obj.type
  ];
  try {
    await db.query("INSERT INTO books (title, author, nationality, description, rating, year, image, type) VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8)",newBook);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
})
app.get("/edit/:title",(req,res)=>{
  let index=books.findIndex(obj => obj.title.replace(/ /g, "_") == req.params.title);
  res.render("new.ejs",{content:books[index]});
});
app.post("/save/:id",async (req,res)=>{
  let id=req.params.id;
  let obj=req.body;
  try {
    const updateValues = [
      obj.title,
      obj.author,
      obj.nationality,
      obj.description,
      obj.rating,
      obj.year,
      obj.image,
      obj.type,
      id
    ];
    console.log(updateValues);
    await db.query(
      "UPDATE books SET " +
      "title = $1, " +
      "author = $2, " +
      "nationality = $3, " +
      "description = $4, " +
      "rating = $5, " +
      "year = $6, " +
      "image = $7, " +
      "type = $8 " +
      "WHERE id = $9;",
      updateValues
    );
  } catch (error) {
    console.error(error);
  }
  res.redirect("/");
});
app.post("/delete/:id",async (req,res)=>{
  let id=req.params.id;
  try {
    await db.query("DELETE FROM notes WHERE book_id=$1;",[id])
    await db.query("DELETE FROM books WHERE id=$1;",[id])
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))