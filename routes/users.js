'use strict';
const app = require('express');
const router = app();
const Utility = require('../helpers/utils');
const Utils = new Utility();
const Services = require('../services/users');
const Users = new Services();

router.post('/signup', async function (req, res) {
    try {
        let data = await Users.signUpUser(req.body.email, req.body.password, req.body.name, req.body.phone);
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

router.post('/users', async function (req, res) {
    try {
        let data = await Users.addUsers(req.body);
        return res.status(200).json('User Added');
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

router.post('/car/book', async function (req, res) {
    try {
        let user_id = req.query.user_id;
        let car_id = req.query.car_id;
        let from_date_time = req.query.fromDateTime;
        let to_date_time = req.query.toDateTime;
        let data = await Users.bookCarForUser(user_id, car_id, from_date_time, to_date_time)
        return res.status(200).json('Car Booked');
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

router.get('/user/bookings', async function (req, res) {
    try {
        let user_id = req.query.user_id;
        let data = await Users.getBookingsForUser(user_id)
        return res.status(200).json(data);
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})









module.exports = router;


