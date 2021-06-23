'use strict';
const Authenticate = require('./authentication');
const Auth = new Authenticate();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('./database');


class Users {
    async signUpUser(email, password, name) {
        if (!Auth.validateEmail(email)) throw new Error('Invalid Email');
        if (this._isNullOrWhiteSpace(name)) throw new Error('Invalid Name');
        let email_info = await Auth.emailPresent(email);
        if (email_info && email_info.length) throw new Error('Email ALready Present');
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) reject(err);
                else {
                    let user_data = await db('users').insert({ email: email, password: hash, name: name, created: Date.now() / 1000, modified: Date.now() / 1000 });
                    let user_id = user_data[0];
                    let payload = {
                        id: user_id,
                        email: email,
                        name: name
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
                    else if (result) resolve(Auth.generateToken({ id: email_info[0].id, email: email, name: email_info[0].name }));
                    else reject(new Error('Incorrect password'));

                });
            })
        }
        else throw new Error('User not present');
    }

    async getOrders(user_id) {
        let data = await db('orders').select(['item', 'quantity']).where('user_id', user_id);
        return data;
    }
    _isNullOrWhiteSpace(str) {
        return (!str || str.length === 0 || /^\s*$/.test(str))
    }
}


module.exports = Users;