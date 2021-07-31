'use strict';
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const Authentication = require('./services/authentication');
const Auth = new Authentication();
const Utility = require('./helpers/utils');
const constants = require("./helpers/constants");
const Utils = new Utility();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var acessible_paths = ['/signup', '/signin']

app.use('/v1', async function (req, res, next) {
    try {
        if (acessible_paths.indexOf(req.path) > -1) {
            next();
        }
        else {
            const token = req.headers.authorization;
            if (!token) res.status(403).json({ error: "Invalid token" })
            else {
                req.user = await Auth.handleAuth(token);
                if(req.user.role == constants.ROLE.ADMIN) next();
                else res.status(403).json('You dont have access')
                
            }
        }
    }
    catch (err) {
        Utils.handleError(res, err)
    }
})

app.use('/v1',require('./routes/users'));
app.use('/v1', require('./routes/cars'));

app.listen(4000, () => {
    console.log(`App listening at http://localhost:4000}`)
  })