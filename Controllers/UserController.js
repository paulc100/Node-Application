const UserRepo   = require('../Data/UserRepo');
const _userRepo  = new UserRepo();
const User       = require('../Models/User');

var   passport       = require('passport');
const RequestService = require('../Services/RequestService');

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password = req.body.password;

    if (password) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            password: 'Temporary',
            email:        req.body.email,
            username:     req.body.username,
            streetAddress: req.body.streetAddress,
            phoneNumber: req.body.phoneNumber
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register', 
                        { user : newUser, errorMessage: err, 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                            function () { res.redirect('/'); });
                });

    }
    else {
      res.render('User/Register', { user:newUser, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

// Receives login information & redirects 
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {

  passport.authenticate('local', {
      successRedirect : '/', 
      failureRedirect : '/User/Login?errorMessage=Invalid login.', 
  }) (req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.Profile  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let user = await _userRepo.getUser(reqInfo.username);
    
    if(reqInfo.authenticated) {
        res.render('User/Profile', { user, errorMessage:"", reqInfo:reqInfo })
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

// Displays 'edit' form and is accessed with get request.
exports.Edit = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let user = await _userRepo.getUser(reqInfo.username); 
    
    res.render('User/Edit', {user, errorMessage:"", reqInfo:reqInfo});
}

// Receives posted data that is used to update the item.
exports.Update = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);

    // Parcel up data in a 'User' object.
    let tempUserObj  = new User( {
        username: request.body.username,
        password: request.body.password,
        email:    request.body.email,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        streetAddress: request.body.streetAddress,
        phoneNumber: request.body.phoneNumber
    });

    // Call update() function in repository with the object.
    let responseObject = await _userRepo.update(tempUserObj);

    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        response.render('User/Profile', { user:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        console.log(JSON.stringify(responseObject.errorMessage))
        response.render('User/Edit', { 
            user:      responseObject.obj, 
            errorMessage: responseObject.errorMessage, reqInfo:reqInfo });
    }
}

// This function receives an id when it is posted. 
// It then performs the delete and shows the user listing after.
// A nicer (future) version could take you to a page to confirm the deletion first.
exports.Delete = async function(request, response) {
    let reqInfo = RequestService.reqHelper(req);

    let id           = request.body._id;
    let deletedItem  = await _userRepo.delete(id);

    // Some debug data to ensure the item is deleted.
    console.log(JSON.stringify(deletedItem));
    let users     = await _userRepo.allUsers();
    response.render('User/Index', {users:users, reqInfo:reqInfo});
}
