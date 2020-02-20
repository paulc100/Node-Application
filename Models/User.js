var mongoose         = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema    = mongoose.Schema({
        // The _id property serves as the primary key. If you don't include it
        // the it is added automatically. However, you can add it in if you
        // want to manually include it when creating an object.

        // _id property is created by default when data is inserted.
        username:            {"type" : "String", minlength: 5, required: true},
        email:            {"type" : "String", required: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']},
        password:    {"type" : "String", required: true},
        firstName:    {"type" : "String", required: true},
        lastName:    {"type" : "String", required: true},
        streetAddress:    {"type" : "String", required: true},
        phoneNumber:    {"type" : "String", required: true, match: [/^\d{10}$/,'Please fill a valid phone number']},
    }, 
    {   // Include this to eliminate the __v attribute which otherwise gets added
        // by default.
        versionKey: false 
    });
userSchema.plugin(passportLocalMongoose);
var User = module.exports = mongoose.model('User', userSchema);
module.exports = User;