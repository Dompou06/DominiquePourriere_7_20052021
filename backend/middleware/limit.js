const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5,
    message: ':)'
});

module.exports = limiter;

//https://akashrajpurohit.com/blog/api-rate-limit-in-nodejs-and-expressjs/

    