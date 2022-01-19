const mongoose = require("mongoose");
const date =  require('date-and-time');
const now = new Date();

//invite schema
const inviteSchema = new mongoose.Schema({
    invitingUserId: String,
    user_email: String,	
    date:{
      uploadedDate: {
                  type: String,
                  default: date.format(now, 'ddd, MMM DD YYYY')
              },
              uploadedTime: {
                  type: String,
                  default: date.format(now, 'hh:mm:ss A')  
              },
              date: {
                  type: String,
                  default: Date.now()
              }
    }
});


// invite model
const inviteModel = mongoose.model("invites",inviteSchema,"invites");
                
module.exports.invites = {
                 /* GET ALL PLAYS FROM DATABASE*/
                 getInvites: async function(fields="",limit=null,arrayOfIds=null,sortObject={_id: -1}){
                  if(!arrayOfIds){
                  return await inviteModel.find({},fields,function (err, docs) {
                      if (err){
                          throw err;
                      }
                      return docs;
                  }).sort(sortObject).limit(limit);
                  }
                  else{
                      return await inviteModel.find({ _id : { $in : arrayOfIds } },fields,function (err, docs) {
                      if (err){
                          throw err;
                      }
                      return docs;
                  }).sort(sortObject).limit(limit);
                  }

              },
              /* GET ALL PLAYS FROM DATABASE*/
                getInviteByEmail: async function(email){
                      return await inviteModel.find({ email : email },function (err, doc) {
                      if (err){
                          throw err;
                      }
                      return doc;
                  });
                },
                  /* GET ONE PLAY FROM DATABASE*/
                  getInvite: async function(inviteId,fields=null){
                    const filterObject = { _id: inviteId };
                    return await inviteModel.findOne(filterObject, fields, function (err, doc) {
                        if (err){
                            throw err;
                        }
                        return doc;
                     })

                },
                /* ADD A PLAY TO DATABASE AND RETURN SAVED OBJECT*/
                  addInvite: async function(inviteObject){
                    const newInvite = new inviteModel(inviteObject);
                    return await newInvite.save();
                },
                /* UPDATE A PLAY INFO IN DATABASE*/
                  updateInvite: async function(inviteId, inviteUpdateObject){
                    const filterObject = { _id: inviteId };
                    const response = await inviteModel.updateOne(filterObject, inviteUpdateObject);
                    const updated = { updated: response.n };
                    return updated;
                },
                /* DELETE A PLAY FROM DATABASE*/
                  deleteInvite: async function(email){
                    const filterObject = { email: email };
                   //delete invite
                   inviteModel.deleteOne(filterObject, function (err) { if(err) { throw err } return; } );

                } 
}