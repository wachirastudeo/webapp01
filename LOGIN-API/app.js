const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'Fullstack-login-2024';
const saltRounds = 10;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 8889,
    password: 'root',
    database: 'mydb'
});

// execute will internally call prepare and query



app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        connection.execute(
            'INSERT INTO users (email,password,fname,lname) VALUES (?,?,?,?)', [req.body.email, hash, req.body.fname, req.body.lname],
            function (err, results, fields) {
                if (err) {
                    res.json({ status: 'error', message: err });
                    return;
                }
                res.json({ status: 'ok' });

            }
        );
    });

});

app.post('/login', (req, res) => {
    connection.execute(
        'select * from users where email = ?', [req.body.email],
        function (err, users, fields) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            if (users.length == 0) {
                res.json({ status: 'error', message: 'users not found' });
                return;
            }

            bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
                if (isLogin) {
                    var token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' });

                    res.json({ status: 'ok', message: 'login success', token });
                } else {
                    res.json({ status: 'error', message: 'login failed' });

                }
            });

        }
    );


});
//test token
app.post('/authen', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        res.json({ status: 'ok', message: decoded });

    } catch (error) {

        res.json({ status: 'error', message: error });

    }


});

app.listen(3333, () => {
    console.log('server localhost');
});