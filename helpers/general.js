'use strict';
const _ = require('lodash');

function validatePhone(phone) {
    if (!phone) return false;
    let special_characters = ['[', '$', '&', ':', ';', '=', '?', '@', '#', '|', '<', '>', '.', '^', '*', '%', '!', ']', '--', '_', '{', '}', '/', '\\', '++', '  '];
    let phone_array = phone.split('');
    let intersect = _.intersection(special_characters, phone_array);
    if (intersect.length || phone.includes("++") || phone.includes("--") || phone.includes("  ") || phone.length > 15 || (phone.match(/[a-z]/i) && phone.match(/[a-z]/i).length)) {
        return false;
    };
    return true;
}
function _isNullOrWhiteSpace(str) {
    return (!str || str.length === 0 || /^\s*$/.test(str))
}

module.exports = {
    validatePhone,
    _isNullOrWhiteSpace
}