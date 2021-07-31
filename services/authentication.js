'use strict';
const jwt = require('jsonwebtoken');
const constants = require('../helpers/constants');
const token_secret = constants.TOKEN_SECRET;
const db = require('../database');

class Auth {
    generateToken(payload) {
        return jwt.sign(payload, token_secret, { expiresIn: '24h' });
    }
    validateEmail(email) {
        if(!email) return false;
        const email_regex = constants.EMAIL_REGEX;
        return email_regex.test(email);
    }
    async handleAuth(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token.split(" ")[1], token_secret, (err, user_info) => {
                if (err) reject(new Error("Authentication Failed"));
                else resolve(user_info);
            })
        })
    }
    async emailPresent(email) {
        return db('users').select(['email', 'password','id', 'name']).where('email',email).then(user => {
            return user;
        })
    }
}


module.exports = Auth;