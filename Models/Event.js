var mongoose         = require('mongoose');

var eventSchema    = mongoose.Schema({
        // The _id property serves as the primary key. If you don't include it
        // the it is added automatically. However, you can add it in if you
        // want to manually include it when creating an object.

        // _id property is created by default when data is inserted.
        title:            {"type" : "String", minlength: 3, required: true},
        description:            {"type" : "String"},
        location:    {"type" : "String", required: true},
        day:    {"type" : "Date"},
        time:    {"type" : "String", required: true},
        createdby:    {"type" : "String", required: true},
        attendees:    [{username:{"type" : "String"},firstName:{"type" : "String"},lastName:{"type" : "String"},email:{"type" : "String"},}],
    }, 
    {   // Include this to eliminate the __v attribute which otherwise gets added
        // by default.
        versionKey: false 
    });
var Event    = mongoose.model('Event', eventSchema);
module.exports = Event;