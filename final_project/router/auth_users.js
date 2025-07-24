const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username & password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Registered users login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  let accessToken = jwt.sign(
    { data: username },
    'access',
    { expiresIn: 60 * 60 }
  );

  return res.status(200).json({
    message: "Login successful",
    token: accessToken
  });
});

// Add a book review (yet to implement)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session?.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review || review.trim() === "") {
      return res.status(400).json({ message: "Review query parameter is missing or empty." });
    }
  
    // Add or update review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/modified successfully.",
      reviews: books[isbn].reviews
    });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
