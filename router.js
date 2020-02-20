var HomeController = require('./Controllers/HomeController');
var UserController = require('./Controllers/UserController');
var EventController = require('./Controllers/EventController');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);    

    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/User/Profile', UserController.Profile);

    app.get('/Event/Index', EventController.Index);
    app.get('/Event/Detail', EventController.Detail); 

    app.get('/Event/Create', EventController.Create);
    app.post('/Event/CreateEvent', EventController.CreateEvent);
    app.post('/Event/Join', EventController.Join);
    app.post('/Event/Leave', EventController.Leave);

    
    app.get('/User/Edit', UserController.Edit);
    app.post('/User/Update', UserController.Update);

    app.get('/Event/Edit', EventController.Edit);
    app.post('/Event/Update', EventController.Update);

    app.post('/User/Delete', UserController.Delete);
    app.post('/Event/Delete', EventController.Delete);
};
