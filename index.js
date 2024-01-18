import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
const app = express()
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "",
    password: "icanbeaprogramer",
    port: 5432,
  });
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let books=[
{
   id:1,
   title:"Ion",
   author:"Liviu Rebreanu",
   nationality:"Romania",
   description:'"Ion" este un roman care explorează povestea lui Ion, un tânăr țăran frumos, și a relației sale cu Ana, o fată dintr-o familie bogată. Într-o societate marcată de diferențe sociale și conflicte, romanul reflectă evoluția personajului principal și aduce în discuție teme precum iubirea, destinul individual și schimbările sociale din mediul rural românesc la începutul secolului al XX-lea.',
   rating:2,
   year:1920,
   image:"https://cdn4.libris.ro/img/pozeprod/1164/1163390-1.jpg",
   type:"iubire,avere"
},
{
    id:2,
    title:"Arsene Lupin in Ochiul Acului",
    author:"Maurice Leblanc",
    nationality:"Franta",
    description:'"Arsene Lupin în Ochiul Acului" prezintă aventurile maestrului hoț Lupin într-o confruntare tensionată cu detectivul Ganimard. În centrul acțiunii este furtul unui inestimabil diamant, cu Lupin pus în situația delicată de a trece prin ochiul acului pentru a-și demonstra priceperea în arta infracțiunii."',
    rating:4,
    year:1909,
    image:"https://cdn4.libris.ro/img/pozeprod/903/902166-1.jpg",
    type:"mister,aventura"
    
 },
 {
    id:3,
    title:"Ocolul Pamantului",
    author:"Jules Verne",
    nationality:"Franta",
    description:'"Ocolul Pământului în 80 de zile" este o poveste captivantă despre Phileas Fogg și servitorul său, Passepartout, care se lansează într-o aventură pentru a înfăptui o călătorie în jurul lumii în 80 de zile, încercând să câștige o importantă miză. Pe parcursul călătoriei lor pline de peripeții, ei se confruntă cu provocări surprinzătoare și întâlnesc personaje fascinante, aducând cititorii într-o călătorie epică și plină de imprevizibil.',
    rating:4,
    year:1873,
    image:"https://cdn.litera.ro/media/mf_webp/jpg/media/catalog/product/cache/d0e526443e6c567e1f3090daec22b73f/o/c/ocolul_pamantului_1.webp",
    type:"aventura"
    
 }
];
let notes=[
    { id: 1, book_id: 1, note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { id: 2, book_id: 2, note: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { id: 3, book_id: 3, note: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
    { id: 4, book_id: 1, note: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore." },
    { id: 5, book_id: 2, note: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { id: 6, book_id: 3, note: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio." },
    { id: 7, book_id: 1, note: "Fusce cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam." },
    { id: 8, book_id: 2, note: "Morbi semper mi non felis vestibulum dignissim." },
    { id: 9, book_id: 3, note: "Nulla facilisi. Nulla vel dolor non purus accumsan scelerisque." },
    { id: 10, book_id: 1, note: "Integer lacinia sollicitudin massa." },
    { id: 11, book_id: 2, note: "Cras metus elit, dictum nec, condimentum at, ultrices ac, ligula." },
    { id: 12, book_id: 3, note: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas." },
    { id: 13, book_id: 1, note: "Mauris ut leo. Cras viverra metus rhoncus sem." },
    { id: 14, book_id: 2, note: "Nullam sagittis." },
    { id: 15, book_id: 3, note: "Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc." },
    { id: 16, book_id: 1, note: "Integer tincidunt. Cras dapibus." },
    { id: 17, book_id: 2, note: "Vivamus elementum semper nisi." },
    { id: 18, book_id: 3, note: "Aenean vulputate eleifend tellus." },
    { id: 19, book_id: 1, note: "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim." },
    { id: 20, book_id: 2, note: "Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus." },
  ];
app.get('/', (req, res) => {
  res.render("index.ejs",{books:books});
});
app.get('/new', (req, res) => {
    res.render("new.ejs");
  });
app.get('/notes/:title', (req, res) => {
    const title=req.params.title;
    const index=books.findIndex(book => book.title.replace(/ /g, '_') == title);
    res.render("notes.ejs",{book:books[index],notes:notes});
  });
app.post("/notes/addNote/:id",(req,res)=>{
    const id=req.params.id;
    const index=books.findIndex(book => book.id == id);
    notes.push({id:notes[notes.length-1].id+1,book_id:id,note:req.body.noteText});
    console.log(notes);
    console.log(books[index]);
    res.redirect("/notes/"+books[index].title.replace(/ /g, '_'));
});
app.post("/notes/delete/:bookId/:noteId",(req,res)=>{
let bookId=req.params.bookId;
let noteId=req.params.noteId;
let index=notes.findIndex(obj => obj.id == noteId && obj.book_id == bookId);
notes.splice(index,1);
let bookIndex=books.findIndex(obj => obj.id == bookId);
res.redirect("/notes/"+books[bookIndex].title.replace(/ /g, '_'));
});
app.post("/add",(req,res)=>{
  console.log(req.body);
  let obj=req.body;
  obj.id=books.length+1;
  books.push(obj);
  res.redirect("/");
})
app.get("/edit/:title",(req,res)=>{
  let index=books.findIndex(obj => obj.title.replace(/ /g, "_") == req.params.title);
  res.render("new.ejs",{content:books[index]});
});
app.post("/save/:id",(req,res)=>{
  let id=req.params.id;
  let index=books.findIndex(obj => obj.id == id);
  let obj=req.body;
  obj.id=id;
  books[index]=obj;
  console.log(req.body);
  res.redirect("/");
});
app.post("/delete/:id",(req,res)=>{
  let id=req.params.id;
  let index=books.findIndex(obj => obj.id == id);
  books.splice(index,1);
  res.redirect("/");

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))