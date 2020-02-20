const Event = require('../Models/Event');

class EventRepo {
    
    // This is the constructor.
    EventRepo() {        
    }

    // Gets all events.
    async allEvents() {     
        let events = await Event.find().sort([['day', -1]]).exec();
        return   events;
    }
    async getEvent(id) {  
        let event = await Event.findOne({_id:id}).exec();
        return   event;
    }
    async create(eventObj) {
        try {
            // Checks if model conforms to validation rules that we set in Mongoose.
            var error = await eventObj.validateSync();
    
            // The model is invalid. Return the object and error message. 
            if(error) {
                let response = {
                    obj:          eventObj,
                    errorMessage: error.message };
    
                return response; // Exit if the model is invalid.
            } 
    
            // Model is not invalid so save it.
            const result = await eventObj.save();
    
            // Success! Return the model and no error message needed.
            let response = {
                obj:          result,
                errorMessage: "" };
    
            return response;
        } 
        //  Error occurred during the save(). Return orginal model and error message.
        catch (err) {
            let response = {
                obj:          eventObj,
                errorMessage: err.message };
    
            return  response;
        }    
    }

    async update(editedObj) {   
    
        // Set up response object which contains origianl event object and empty error message.
        let response = {
            obj:          editedObj,
            errorMessage: "" };
    
        try {
            // Ensure the content submitted by the user validates.
            var error = await editedObj.validateSync();
            if(error) {
                response.errorMessage = error.message;
                return response;
            } 
    
            // Load the actual corresponding object in the database.
            let eventObject = await this.getEvent(editedObj.id);
    
            // Check if event exists.
            if(eventObject) {
    
                // Event exists so update it.
                let updated = await Event.updateOne(
                    { _id: editedObj.id}, // Match id.
    
                    // Set new attribute values here.
                    {$set: { title: editedObj.title,
                        description: editedObj.description,
                        location: editedObj.location,
                        day: editedObj.day,
                        time: editedObj.time,
                        createby: editedObj.createby
                    }})
    
                // No errors during update.
                if(updated.nModified!=0){
                    response.obj = editedObj;
                    return response;
                }
                // Errors occurred during the update.
                else {
                    respons.errorMessage = 
                        "An error occurred during the update. The item did not save." 
                };
                return response; 
            }
                
            // Event not found.
            else {
                response.errorMessage = "An item with this id cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    }

    async delete(id) {
        console.log("Id to be deleted is: " + id);
        let deletedItem =  await Event.find({_id:id}).remove().exec();
        console.log(deletedItem);
        return deletedItem;
    }

    async join(username,id,firstName,lastName,email) {

        await Event.updateOne(
            { _id: id}, // Match id.

            // Set new attribute values here.
            {$push: { attendees: {username:username,firstName:firstName,lastName:lastName,email:email}
        }})

        return;
    }

    async leave(username,id,firstName,lastName,email) {
        
        await Event.updateOne(
            { _id: id}, // Match id.

            // Set new attribute values here.
            {$pull: { attendees: {username:username,firstName:firstName,lastName:lastName,email:email}
        }})

        return;
    }
    

}
module.exports = EventRepo;
