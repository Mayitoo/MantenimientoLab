const { format } = require('timeago.js');


const helpers = {};
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

helpers.registerHelper = ('nav', (a) => {
     return a == 1 ? true : false;
 });


// Handlebars.registerHelper('Nav', (a, b, opts) => {
//     return a == b ? opts.fn(this) : opts.inverse(this);
// });

module.exports = helpers;