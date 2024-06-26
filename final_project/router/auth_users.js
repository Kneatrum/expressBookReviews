const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });

    if (userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(404).json({message:"Error in logging in"});
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(!isbn || !username){
        return res.status(401).json({ message: "User not authenticated or ISBN missing" });
    }
    const book = books[isbn];
    const review = req.query.review;

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    book.reviews[username] = review;
    return res.send("The review for the book with ISBN " + isbn + " has been added/updated");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if(!isbn || !username){
        return res.status(401).json({ message: "User not authenticated or ISBN missing" });
    }

    const book = books[isbn];

    if(!book){
        return res.status(404).json({message: "User has not reviewed this book"})
    }

    delete book.reviews[username];

    return res.send("Reviews for the ISBN " + isbn + " posted by the user " + username + " deleted.")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
