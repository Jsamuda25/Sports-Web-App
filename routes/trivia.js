const express = require('express');

let router = express.Router()
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.render('trivia');
});

module.exports = router;

