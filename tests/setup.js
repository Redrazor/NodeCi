jest.setTimeout(30000);

require('../models/User');
const {TextDecoder, TextEncoder} = require("util");
const keys = require('../config/keys');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);
