const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// public_users.post("/register", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username && password) {
//     if (!doesExist(username)) {
//       users.push({ "username": username, "password": password });
//       return res.status(200).json({ message: "User successfully registred. Now you can login" });
//     } else {
//       return res.status(404).json({ message: "User already exists!" });
//     }
//   }
//   return res.status(404).json({ message: "Unable to register user." });
// });
// Existing users array or object that you have
// Replace this with your actual users data structure
const existingUsers = []; // or const existingUsers = {};

// Function to check if a username already exists
function doesExist(username) {
  // Replace this with your actual check based on your existingUsers structure
  return existingUsers.some(user => user.username === username);
}

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      existingUsers.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }

  return res.status(400).json({ message: "User successfully registered" });
});
public_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      existingUsers.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Welcome Back" });
    } else {
      return res.status(409).json({ message: "Invalid userid or password" });
    }
  }

  return res.status(400).json({ message: "User login successfull" });
});
public_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Review Added successfully" });
});
public_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Review Deleted successfully" });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   res.send(JSON.stringify(books, null, 4));
//   return res.status(300).json({ message: "Yet to be implemented" });
// });

async function getBooks() {
  return JSON.stringify(books, null, 4);
}

public_users.get('/', async function (req, res) {
  try {
    const formattedBooks = await getBooks();
    res.send(formattedBooks);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while getting books." });
  }
});

// public_users.get('/', async function (req, res) {
//   try {
//     const response = await JSON.parse(books); // Replace with your actual API endpoint or URL
//     const formattedBooks = JSON.stringify(response.data, null, 4);
//     res.send(formattedBooks);
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred while getting books." });
//   }
// });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
//   return res.status(300).json({ message: "Yet to be implemented" });
// });
function getBookByIsbn(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book with the provided ISBN not found.'));
    }
  });
}

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  getBookByIsbn(isbn)
    .then(book => {
      res.send(book);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const authorToFind = req.params.author;
//   const matchingBooks = [];


//   for (const bookId in books) {
//     if (books.hasOwnProperty(bookId)) {
//       const book = books[bookId];


//       if (book.author === authorToFind) {
//         matchingBooks.push(book);
//       }
//     }
//   }

//   if (matchingBooks.length === 0) {
//     res.status(404).json({ message: 'No books found for the provided author.' });
//   } else {
//     res.json(matchingBooks);
//   }
// });
function findBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const bookId in books) {
      if (books.hasOwnProperty(bookId)) {
        const book = books[bookId];

        if (book.author === author) {
          matchingBooks.push(book);
        }
      }
    }

    if (matchingBooks.length === 0) {
      reject(new Error('No books found for the provided author.'));
    } else {
      resolve(matchingBooks);
    }
  });
}

public_users.get('/author/:author', function (req, res) {
  const authorToFind = req.params.author;

  findBooksByAuthor(authorToFind)
    .then(matchingBooks => {
      res.json(matchingBooks);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {

//   const titleToFind = req.params.title;
//   const matchingTitle = [];
//   for (const titleId in books) {
//     if (books.hasOwnProperty(titleId)) {
//       const book = books[titleId];


//       if (book.title === titleToFind) {
//         matchingTitle.push(book);
//       }
//     }
//   }
//   if (matchingTitle.length === 0) {
//     res.status(404).json({ message: 'No books found for the provided title.' });
//   } else {
//     res.json(matchingTitle);
//   }
// });
function findBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const matchingTitle = [];

    for (const titleId in books) {
      if (books.hasOwnProperty(titleId)) {
        const book = books[titleId];

        if (book.title === title) {
          matchingTitle.push(book);
        }
      }
    }

    if (matchingTitle.length === 0) {
      reject(new Error('No books found for the provided title.'));
    } else {
      resolve(matchingTitle);
    }
  });
}

public_users.get('/title/:title', function (req, res) {
  const titleToFind = req.params.title;

  findBooksByTitle(titleToFind)
    .then(matchingTitle => {
      res.json(matchingTitle);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;
    res.json(bookReviews);
  } else {
    res.status(404).json({ message: 'Book with the provided ISBN not found.' });
  }

});

module.exports.general = public_users;
