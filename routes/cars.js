'use strict';
const app = require('express');
const router = app();
const db = require('../database');
const Utility = require('../helpers/utils');
const Utils = new Utility();
const Services = require('../services/cars');
const Cars = new Services();

router.post('/cars', async function (req, res) {
    try {
        let data = await Cars.addCar(req.body, req.user.id);
        return res.status(200).json('Car added');
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

router.get('/calculate_price', async function (req, res) {
    try {
        let from_date_time = req.query.fromDateTime;
        let to_date_time = req.query.toDateTime;
        let car_id = req.query.carId;
        let data = await Cars.calculatePrice(car_id, from_date_time, to_date_time);
        return res.status(200).json(data);
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

router.get('/car/bookings', async function (req, res) {
    try {
        let car_id = req.query.carId;
        let data = await Cars.getUsers(car_id);
        return res.status(200).json(data);
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})

router.get('/search_cars', async function (req, res) {
    try {
        let from_date_time = req.query.fromDateTime;
        let to_date_time = req.query.toDateTime;
        let data = await Cars.searchCars(from_date_time,to_date_time);
        return res.status(200).json(data);
    }
    catch (err) {
        Utils.handleError(res, err);
    }
})



module.exports = router;