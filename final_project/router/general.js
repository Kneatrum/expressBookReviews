const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(404).json({message: "Username and/or password not provided"});
    }

    let userswithsamename = users.filter((user) => {
        return user.username = username;
    })

    if(userswithsamename.length > 0){
        return res.status(404).json({message: "User already exists!"});
    }

    users.push({username, password});
    // console.log(users)

    return res.status(200).json({message: "Customer successfully registered. Now you can log in"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            let success = true;
            if(success){
                resolve("Promise resolved");
            } else {
                reject("Promise rejected");
            }
        },6000);
    });

    myPromise.then(() => {
        res.send(JSON.stringify({books},null,4));
    });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = null;

    if(!isbn){
        return res.status(400).json({ message: "Enter a valid parameter" });
    }

    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            book = books[isbn];
            if(book){
                resolve("Promise resolved");
            }
        },6000);
    });

    myPromise.then(() => {
        res.send(book);
    });
 

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


module.exports.general = public_users;
