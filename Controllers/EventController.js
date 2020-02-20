const EventRepo   = require('../Data/EventRepo');
const UserRepo   = require('../Data/UserRepo');
const _eventRepo  = new EventRepo();
const _userRepo = new UserRepo();
const Event       = require('../Models/Event');

const RequestService = require('../Services/RequestService');

// This is the default page for domain.com/event/index.
// It shows a listing of events if any exist.
exports.Index = async function(request, response){
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);

    let events = await _eventRepo.allEvents();
    if(events!= null) {
        response.render('Event/Index', { events:events, reqInfo:reqInfo, user })
    }
    else {
        response.render('Event/Index', { events:[], reqInfo:reqInfo, user })
    }
};

// Shows one single object at a time. 
exports.Detail = async function(request, response) {
    // request.query used to get url parameter.
    let reqInfo = RequestService.reqHelper(request);
    let events = await _eventRepo.allEvents();

    let eventID  = request.query._id; 
    
    let eventObj = await _eventRepo.getEvent(eventID);
    response.render('Event/Detail', { events:events, event:eventObj, reqInfo:reqInfo });
}

// GET request calls here to display 'Event' create form.
exports.Create = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);
    
    response.render('Event/Create', { errorMessage:"", event:{}, reqInfo:reqInfo, user });
};

// Receives POST data and tries to save it.
exports.CreateEvent = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);
    // Package object up nicely using content from 'body'
    // of the POST request.
    let tempEventObj  = new Event( {
        "title":request.body.title,
        "description":request.body.description,
        "location":request.body.location,
        "day":request.body.day,
        "time":request.body.time,
        "createdby":request.body.createdby,
    });

    // Call Repo to save 'Event' object.
    let responseObject = await _eventRepo.create(tempEventObj);

    // No errors so save is successful.
    if(responseObject.errorMessage == "") {
        console.log('Saved without errors.');
        console.log(JSON.stringify(responseObject.obj));
        let events = await _eventRepo.allEvents();
        response.render('Event/Index', { events:events, event:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo, user});
    }
    // There are errors. Show form the again with an error message.
    else {
        // var message = `Attempted to enter: ${request.body._id} as an ID and ${request.body.mfgDiscount} as the mfgDiscount`
        // console.log(message);
        console.log(JSON.stringify(responseObject.errorMessage));
        response.render('Event/Create', {
                        event:responseObject.obj,
                        errorMessage:responseObject.errorMessage, reqInfo:reqInfo, user});
    }
};

// Displays 'edit' form and is accessed with get request.
exports.Edit = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);
    let eventID  = request.query._id;
    console.log(eventID);
    let eventObj = await _eventRepo.getEvent(eventID);   
    response.render('Event/Edit', {event:eventObj, errorMessage:"", reqInfo:reqInfo, user});
}

// Receives posted data that is used to update the item.
exports.Update = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);
    let eventID = request.body._id;
    console.log("The posted event id is: " + eventID);

    // Parcel up data in a 'Event' object.
    let tempEventObj  = new Event( {
        _id: eventID,
        title:    request.body.title,
        description: request.body.description,
        location: request.body.location,
        day: request.body.day,
        time: request.body.time,
        createdby: request.body.createdby
    });

    // Call update() function in repository with the object.
    let responseObject = await _eventRepo.update(tempEventObj);

    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        let events = await _eventRepo.allEvents();
        response.render('Event/Index', { events:events, event:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo, user });
    }

    // Update not successful. Show edit form again.
    else {
        console.log(JSON.stringify(responseObject.errorMessage))
        response.render('Event/Edit', { 
            event:      responseObject.obj, 
            errorMessage: responseObject.errorMessage, reqInfo:reqInfo, user });
    }
}

// This function receives an id when it is posted. 
// It then performs the delete and shows the event listing after.
// A nicer (future) version could take you to a page to confirm the deletion first.
exports.Delete = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);
    let id           = request.body._id;
    let deletedItem  = await _eventRepo.delete(id);

    // Some debug data to ensure the item is deleted.
    console.log(JSON.stringify(deletedItem));
    let events     = await _eventRepo.allEvents();
    response.render('Event/Index', {events:events, reqInfo:reqInfo, user});
}

exports.Join = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);
    let id           = request.body._id;
    let firstName           = request.body.firstName;
    let lastName           = request.body.lastName;
    let email           = request.body.email;

    await _eventRepo.join(reqInfo.username, id, firstName, lastName, email)

    let eventObj = await _eventRepo.getEvent(id);
    let events     = await _eventRepo.allEvents();
    response.render('Event/Index', {events:events, event:eventObj, reqInfo:reqInfo, user});
}

exports.Leave = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUser(reqInfo.username);

    let id           = request.body._id;
    let firstName           = request.body.firstName;
    let lastName           = request.body.lastName;
    let email           = request.body.email;

    await _eventRepo.leave(reqInfo.username, id, firstName, lastName, email)

    let eventObj = await _eventRepo.getEvent(id);
    let events     = await _eventRepo.allEvents();
    response.render('Event/Index', {events:events, event:eventObj, reqInfo:reqInfo, user});
}
