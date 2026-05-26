const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'theatre_booking'
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
    [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(400).send("Η εγγραφή απέτυχε");
        res.status(201).send("Επιτυχής εγγραφή");
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (results.length === 0) return res.status(400).send("Δεν βρέθηκε χρήστης");
        
        // Κανονική σύγκριση κωδικού με bcrypt
        const match = await bcrypt.compare(password, results[0].password);
        
        if (!match) return res.status(400).send("Λάθος κωδικός");
        
        const token = jwt.sign({ id: results[0].user_id }, 'SECRET_KEY', { expiresIn: '1h' });
        res.json({ token });
    });
});

app.get('/theatres', (req, res) => {
    res.json([
        { id: 1, name: "Θέατρο Αλίκη", location: "Αθήνα" },
        { id: 2, name: "Θέατρο Πειραιώς", location: "Πειραιάς" }
    ]);
});

app.listen(3000, () => console.log('Server is running on port 3000'));