const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');

const app = express();
const bcrypt = require('bcrypt');
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

app.listen(3333, () => {
    console.log('server localhost');
});