const express = require("express");
const router = express.Router();
// const posts = require("../database/posts").posts;
// const users = require("../database/users").users;
// const activities = require("../database/activities").activities;
// const notifications = require("../database/notifications").notifications;
// const logPostActionAndSendNotification = require("../functions").logPostActionAndSendNotification;
// const getActedOnPost = require("../functions").getActedOnPost;
// const getActedOnPostsById = require("../functions").getActedOnPostsById;
const invites = require("../database/invites").invites;
const execQuery = require("../database/connection").aydinty.runQuery;


// GET REQUESTS

/* get all plays 
router.get("/", (req,res,next)=>{
   async function queryPlusResponse(){
       /*query runs here
       const result = await plays.getInvite();
       /*response here
       res.send(result);
    }
    /* open connection and run query 
    execQuery(queryPlusResponse);
});
*/
/* get one play by id */
router.get("/:email", (req,res,next)=>{
   //const requestObject = req.query;
   const email = req.params.email;
   async function queryPlusResponse(){
       let invite = await invite.getInviteByEmail(email);  //get invite by email
       res.send(invite);
       
    }
    if(req.params.hasOwnProperty("email")){
    /* open connection and run query */
        execQuery(queryPlusResponse);
    }  
    else{
        res.sendStatus(403)
        res.end();
    }
});


//POST REQUESTS

/* create a play */
router.post("/", (req,res,next)=>{
    // get play from request
    const inviteObject = req.body;
    
    //add to database object and sending response object 
    async function queryPlusResponse(){
       /*query runs here: add play, and create activity and send notifitation*/
       //await logPostActionAndSendNotification(playObject.userId, playObject.postId, "play", [activities.addActivity,notifications.addNotification,plays.addPlay],[users.getUser,posts.getPost], [users.updateUser,posts.updatePost], users.updateUsers);
       await invites.addInvite(inviteObject)
       /*response here*/;
       res.send({"success": "invite sent"});
       
    }

    /* open connection and run query */
    execQuery(queryPlusResponse);
    
});


/*
//PUT REQUESTS
router.put("/:id", (req,res,next)=>{
  const updateObject = req.body;
  const playId = req.params.id;
  async function queryPlusResponse(){
      /*query runs here
      const result = await plays.updatePlay(playId,updateObject);
      /* response here if found
      if(result){
         res.send(result);
      }
      else {
      /* sending 404 headers if not found
         res.sendStatus(404);
      }
      
   }
   /* open connection and run query 
   execQuery(queryPlusResponse);
});
*/
//DELETE REQUESTS
router.delete("/:email", (req,res,next)=>{
  const email = req.params.email;
  async function queryPlusResponse(){
      /*query runs here*/
      await invites.deleteInvite(email);
      /*RESPOND THAT DELETE WAS SUCCESSFULL*/ 
      res.send({success: "deleted"});
   }
   /* open connection and run query */
   execQuery(queryPlusResponse);
});


module.exports = router