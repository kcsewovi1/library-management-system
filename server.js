const express = require('express');
const path = require('path');
const db = require('./db.js');
const app = express();

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [username], (err, results) => {
        if (results.length > 0) {
            res.status(400).json({ success: false, message: 'Username already exists' });
        } else {
            const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertUserQuery, [username, password], (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'User registration failed' });
                } else {
                    res.status(200).json({ success: true, message: 'User registered successfully', user_id: result.insertId });
                }
            });
        }
    });
});

app.post('/add', (req, res) => {
    const { user_id, title, author, genre, published_date } = req.body;
    const insertBookQuery = 'INSERT INTO books (user_id, title, author, genre, published_date) VALUES (?, ?, ?, ?, ?)';
    db.query(insertBookQuery, [user_id, title, author, genre, published_date], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Book addition failed' });
        } else {
            res.status(200).json({ success: true, message: 'Book added successfully' });
        }
    });
});

app.get('/books/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const getBooksQuery = 'SELECT * FROM books WHERE user_id = ?';
    db.query(getBooksQuery, [userId], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to retrieve books' });
        } else if (results.length === 0) {
            res.status(404).json({ success: false, message: 'No books found for this user' });
        } else {
            res.status(200).json({ success: true, books: results });
        }
    });
});


app.put('/updateBook', (req, res) => {
    const { user_id, id, title, author, genre } = req.body;

    // Check if the book exists
    const checkBookQuery = 'SELECT * FROM books WHERE user_id = ? AND id = ?';
    db.query(checkBookQuery, [user_id, id], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error checking book' });
            return;
        }

        if (results.length === 0) {
            res.status(400).json({ success: false, message: 'Book not found for this user' });
        } else {
            const updatedFields = [];
            const updateValues = [];

            // Check each field and add to the update query if it's not empty
            if (title && title.trim() !== '') {
                updatedFields.push('title = ?');
                updateValues.push(title);
            }
            if (author && author.trim() !== '') {
                updatedFields.push('author = ?');
                updateValues.push(author);
            }
            if (genre && genre.trim() !== '') {
                updatedFields.push('genre = ?');
                updateValues.push(genre);
            }

            // If no fields to update, send a response
            if (updatedFields.length === 0) {
                res.status(400).json({ success: false, message: 'No valid fields provided for update' });
                return;
            }

            // Add the user_id and book_id to the values array
            updateValues.push(user_id, id);

            // Construct the update query
            const updateBookQuery = `UPDATE books SET ${updatedFields.join(', ')} WHERE user_id = ? AND id = ?`;
            db.query(updateBookQuery, updateValues, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Book update failed' });
                } else {
                    res.status(200).json({ success: true, message: 'Book updated successfully' });
                }
            });
        }
    });
});


app.delete('/deleteBook', (req, res) => {
    const { username, id } = req.body;

    const getUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(getUserQuery, [username], (err, userResults) => {
        if (userResults.length === 0) {
            res.status(400).json({ success: false, message: 'User not found' });
        } else {
            const userId = userResults[0].id;
            const deleteBookQuery = 'DELETE FROM books WHERE id = ? AND user_id = ?';
            db.query(deleteBookQuery, [id, userId], (err, result) => {
                if (err || result.affectedRows === 0) {
                    res.status(500).json({ success: false, message: 'Book does not exist' });
                } else {
                    res.status(200).json({ success: true, message: 'Book deleted successfully' });
                }
            });
        }
    });
});

const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        db.end(() => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});
