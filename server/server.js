const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'users.json');

/* ── Middleware ── */
app.use(cors());               // permite cereri din browser (file://)
app.use(express.json());

/* ── Helper: citire/scriere fișier JSON ── */
function readUsers() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw) || [];
    } catch {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf8');
}

/* ============================================================
   POST /register
   Body: { firstName, lastName, email, password }
   Răspuns: { success, message }
============================================================ */
app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validare minimă pe server
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email și parola sunt obligatorii.' });
    }

    const users = readUsers();

    // Verifică dacă email-ul există deja
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ success: false, message: 'Există deja un cont cu acest email.' });
    }

    // Salvează utilizatorul nou
    const newUser = {
        id: Date.now(),
        firstName: firstName || '',
        lastName: lastName || '',
        email: email.toLowerCase(),
        password,                        // ⚠️ în producție → hash cu bcrypt
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    console.log(`✅ Utilizator înregistrat: ${email}`);
    res.status(201).json({ success: true, message: 'Cont creat cu succes!' });
});

/* ============================================================
   POST /login
   Body: { email, password }
   Răspuns: { success, message, user? }
============================================================ */
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Completează email și parola.' });
    }

    const users = readUsers();
    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
        return res.status(401).json({ success: false, message: 'Email sau parolă incorectă.' });
    }

    console.log(`🔐 Login: ${email}`);
    res.json({
        success: true,
        message: `Bine ai revenit, ${user.firstName || user.email}!`,
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }
    });
});

/* ============================================================
   GET /users  (debug – listează toți utilizatorii)
============================================================ */
app.get('/users', (req, res) => {
    const users = readUsers();
    // Nu returna parolele
    res.json(users.map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, createdAt: u.createdAt })));
});

/* ── Start ── */
app.listen(PORT, () => {
    console.log(`🚀 Server pornit pe http://localhost:${PORT}`);
    console.log(`   POST /register  — înregistrare`);
    console.log(`   POST /login     — autentificare`);
    console.log(`   GET  /users     — lista utilizatori (debug)`);
});
