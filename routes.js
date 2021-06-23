'use strict';
const app = require('express');
const router = app();
const db = require('./database');
const Utility = require('./utils');
const Utils = new Utility();
const Services = require('./services');
const Users = new Services();

router.post('/signup', async function (req, res) {
    try {
        let data = await Users.signUpUser(req.body.email, req.body.password, req.body.name);
        return res.status(200).json({ token: data });
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

router.post('/signin', async function (req, res) {
    try {
        let data = await Users.signInUser(req.body.email, req.body.password);
        return res.status(200).json({ token: data });
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

router.get('/orders', async function (req, res) {
    try {
        let data = await Users.getOrders(req.user.id);
        return res.status(200).json(data);
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

module.exports = router;


