const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(isbn){
        let book = books[isbn];
        if(book){
            res.send(book);
        } else{
            return res.status(300).json({message: "Book not found"});
        }
    }else{
        return res.status(300).json({message: "Enter a valid parameter"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookList = Object.values(books)
  let booksByAuthor = bookList.filter((book) => {
    return (book.author === author)
  });
  if(booksByAuthor.length > 0){
    res.send(JSON.stringify({booksByAuthor},null,4));
  } else{
      return res.status(300).json({message: "Books by this author not found"});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksList = Object.values(books);
  const booksByTitle = booksList.filter((book) => {
    return (book.title === title)
  });

  if(booksByTitle.length > 0){
    res.send(JSON.stringify({booksByTitle},null,4))
  } else{
    return res.status(300).json({message: "Book by the provided title does not exist"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(parseInt(isbn)){
        const book = books[isbn];
        if(book){
            res.send(book.reviews)
        } 
    } else{
        return res.status(300).json({message: "Please enter a valid ISBN"});
    }
});

function findBookByISBN(isbn){
    for (const id in books){
        if(books.hasOwnProperty(id)){
            if(books[id].isbn === isbn){
                return books[id];
            }
        }
    }
    return null;
}
module.exports.general = public_users;
