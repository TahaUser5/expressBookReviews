const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully!" });
  });
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).send("Book not found");
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorParam = req.params.author.toLowerCase();
    const result = [];

    for (let isbn in books) {
        const book = books[isbn];
        if (book.author.toLowerCase() === authorParam) {
            result.push({ isbn, ...book });
        }
    }

    if (result.length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
        return res.status(404).json({ message: "Author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];

    for (const isbn in books) {
        if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push({
                isbn: isbn,
                title: books[isbn].title,
                author: books[isbn].author,
                reviews: books[isbn].reviews
            });
        }
    }

    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "Book with given title not found" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
