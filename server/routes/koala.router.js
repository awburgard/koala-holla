const express = require('express');
const koalaRouter = express.Router();
const pool = require('../modules/pool');

// GET
koalaRouter.get('/', (req,res) => {
    const queryString = `SELECT * FROM "koalas" ORDER BY "id" ASC`;

    pool.query(queryString)
        .then((response) => {
            res.send(response.rows);
        })
        .catch((err) => {
            console.log('Error retrieving data from database:', err);
            res.send(500);
        })
});

// POST
koalaRouter.post('/', (req,res) => {
    const queryString = `INSERT INTO "koalas" ("name", "gender", "age", "ready_to_transfer", "notes")
                            VALUES ($1,$2,$3,$4,$5)`;

    pool.query(queryString, [req.body.name, req.body.gender, req.body.age, req.body.readyForTransfer, req.body.notes])
        .then((response) => {
            console.log('Saved!')
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Error saving to database: ', err);
            res.sendStatus(500);
        })
});

// PUT
koalaRouter.put('/:id', (req,res) => {
    const queryString = `UPDATE "koalas" SET "ready_to_transfer"=true WHERE id=$1;`;

    pool.query(queryString, [req.params.id])
        .then((response) => {
            res.send(200);
        })
        .catch((err) => {
            console.log('Error deleting from database: ', err);
            res.send(500);
        });
});

// DELETE
koalaRouter.delete('/:id', (req,res) => {
    const queryString = `DELETE FROM "koalas" WHERE id=$1`;

    pool.query(queryString, [req.params.id])
        .then((response) => {
            res.send(200);
        })
        .catch((err) => {
            console.log('Error deleting from database: ', err);
            res.send(500);
        });
});

module.exports = koalaRouter;