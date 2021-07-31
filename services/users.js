'use strict';
const Authenticate = require('../services/authentication');
const Auth = new Authenticate();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../database');
const general = require('../helpers/general');
const service = require('../services/cars');
const Cars = new service();
const constants = require('../helpers/constants');

class Users {
    async signUpUser(email, password, name, phone) {
        if (!Auth.validateEmail(email)) throw new Error('Invalid Email');
        if (general._isNullOrWhiteSpace(name)) throw new Error('Invalid Name');
        if (!general.validatePhone(phone)) throw new Error('Invalid phone');
        let email_info = await Auth.emailPresent(email);
        if (email_info && email_info.length) throw new Error('Email ALready Present');
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) reject(err);
                else {
                    let user_data = await db('users').insert({ email: email, password: hash, name: name, phone: phone, role: constants.ROLE.ADMIN, created: Date.now() / 1000, modified: Date.now() / 1000 });
                    let user_id = user_data[0];
                    let payload = {
                        id: user_id,
                        email: email,
                        name: name,
                        role: constants.ROLE.ADMIN
                    }
                    resolve(await Auth.generateToken(payload));
                }
            });
        })

    }
    async signInUser(email, password) {
        if (!Auth.validateEmail(email)) throw new Error('Invalid Email');
        let email_info = await Auth.emailPresent(email);
        if (email_info && email_info.length) {
            let password_present = email_info[0].password;
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, password_present, async function (err, result) {
                    if (err) reject(err);
                    else if (result) resolve(Auth.generateToken({ id: email_info[0].id, email: email, name: email_info[0].name, role: constants.ROLE.ADMIN }));
                    else reject(new Error('Incorrect password'));

                });
            })
        }
        else throw new Error('User not present');
    }

    async bookCarForUser(user_id, car_id, from_date_time, to_date_time) {
        if (!await this.userPresent(user_id)) throw new Error('Invalid User');
        if (!await this.carPresent(car_id)) throw new Error('Invalid Car');
        if (await this.checkIfOverlappingTimings(car_id, from_date_time, to_date_time)) throw new Error('Please choose different slot');
        let booking_price = await Cars.calculatePrice(car_id, from_date_time, to_date_time);
        let insertion_obj = {
            user_id: user_id,
            car_id: car_id,
            from_date_time: from_date_time,
            booking_price: booking_price.total_price_excluding_deposit,
            to_date_time: to_date_time,
            created: Date.now() / 1000,
            modified: Date.now() / 1000
        }
        await db('bookings').insert(insertion_obj);
    }

    async userPresent(user_id) {
        let user = await db('users').select('id').where('id', parseInt(user_id));
        return user.length;
    }

    async carPresent(car_id) {
        let car = await db('cars').select('id').where('id', parseInt(car_id));
        return car.length;
    }

    async checkIfOverlappingTimings(car_id, from_date_time, to_date_time) {  //3 -5  2-4, 4,6
        let overlap = await db('bookings').count('id as c').where('car_id', car_id)
            .whereRaw('from_date_time <= ? and to_date_time >= ?', [to_date_time, from_date_time]);
        return overlap[0].c;
    }
    async getBookingsForUser(user_id) {
        let bookings = await db('bookings')
        .innerJoin('cars','cars.id','bookings.car_id')
        .select(['cars.manufacturer','cars.model', 'from_date_time', 'to_date_time', 'booking_price']).where('user_id', user_id);
        return bookings;
    }

    async addUsers(user) {
        if (!Auth.validateEmail(user.email)) throw new Error('Invalid Email');
        if (general._isNullOrWhiteSpace(user.name)) throw new Error('Invalid Name');
        if (!general.validatePhone(user.phone)) throw new Error('Invalid phone');
        let email_info = await Auth.emailPresent(user.email);
        if (email_info && email_info.length) throw new Error('Email ALready Present');
        user.role = constants.ROLE.BOOKING_USER;
        user.created = Date.now() / 1000;
        user.modified = Date.now() / 1000;
        await db('users').insert(user);
    }
}


module.exports = Users;