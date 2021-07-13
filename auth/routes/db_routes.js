const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();

let user = require('../model_db/db_schema');

// just specifing the route for mongoDB like get data from database and post something to it

router.route('/create').post((req, res, next) => {    // for signup
    user.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(data)
            res.json(data)
        }
    })
});

router.route('/').get((req, res) => {      // just fecting for debuging purposes
    user.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/login/:mail').get((req, res) => {     // for login  to het if user is in the exists in the database or not 
    user.findOne({email: req.params.mail},(error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})


module.exports = router;