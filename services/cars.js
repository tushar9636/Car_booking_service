'use strict';
const db = require('../database');
const general = require('../helpers/general');

class Cars {
    async addCar(car_details) {
        this.validateCarDetails(car_details);
        car_details.created = Date.now() / 1000;
        car_details.modified = Date.now() / 1000;
        await db('cars').insert(car_details);

    }
    validateCarDetails(car_details) {
        if (!car_details.hasOwnProperty('car_license_number')) throw new Error('Please add license number');
        if (!car_details.hasOwnProperty('manufacturer')) throw new Error('Please add car manufacturer');
        if (!car_details.hasOwnProperty('model')) throw new Error('Please add car model');
        if (!car_details.hasOwnProperty('base_price')) throw new Error('Please add car base_price');
        if (!car_details.hasOwnProperty('price_per_hour')) throw new Error('Please add car price_per_hour');
        if (!car_details.hasOwnProperty('security_deposit')) throw new Error('Please add car security_deposit');
        if (isNaN(car_details.base_price)) throw new Error('Please add a valid base price in numbers');
        if (isNaN(car_details.price_per_hour)) throw new Error('Please add a valid price per hour in numbers');
        if (isNaN(car_details.security_deposit)) throw new Error('Please add a valid security deposit in numbers')
    }
    async calculatePrice(car_id, from_date_time, to_date_time) { // expecting unixtime from frontend
        if (isNaN(car_id)) throw new Error('Invalid car id');
        if (isNaN(from_date_time)) throw new Error('Invalid from_date_time');
        if (isNaN(to_date_time)) throw new Error('Invalid to_date_time');
        let car_details = await db('cars').select(['base_price', 'price_per_hour', 'security_deposit']).where('id', car_id);
        if (!car_details.length) throw new Error('No car found with this Id');
        from_date_time = parseInt(from_date_time);
        to_date_time = parseInt(to_date_time);
        let duration_in_sec = to_date_time - from_date_time;
        return this.priceCalculater(duration_in_sec, car_details[0]);
    }
    priceCalculater(duration_in_sec, car_details) {
        let total_duration_in_hour = duration_in_sec / 3600;
        let total_price_excluding_deposit = parseInt(car_details.base_price) + (total_duration_in_hour * parseInt(car_details.price_per_hour));
        let total_price_including_deposit = total_price_excluding_deposit + parseInt(car_details.security_deposit);
        return {
            total_price_excluding_deposit: total_price_excluding_deposit,
            total_price_including_deposit: total_price_including_deposit
        }
    }
    async getUsers(car_id) {
        let users = await db('bookings').innerJoin('users', 'users.id', 'bookings.user_id').select(['users.name', 'bookings.from_date_time', 'bookings.to_date_time'])
            .where('bookings.car_id', parseInt(car_id));
        return users;
    }

    async searchCars(from_date_time, to_date_time) { //2-4
        let cars = await db('bookings').innerJoin('cars', 'cars.id', 'bookings.car_id').select(db.raw('cars.*'))
            .whereRaw('from_date_time >= ? and to_date_time <= ?', [to_date_time, from_date_time]);
        return cars;
    }
}





module.exports = Cars;