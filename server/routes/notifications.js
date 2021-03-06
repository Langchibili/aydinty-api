const express = require("express");
const router = express.Router();
const notifications = require("../database/notifications").notifications;
const users = require("../database/users").users;
const execQuery = require("../database/connection").aydinty.runQuery;


// GET REQUESTS

/* get all notifications */
router.get("/", (req,res,next)=>{
   async function queryPlusResponse(){
       /*query runs here*/
       const result = await notifications.getNotifications();
       /*response here*/ 
       res.send(result);
    }
    /* open connection and run query */
    execQuery(queryPlusResponse);
});

/* get one notification by id */
router.get("/:id", (req,res,next)=>{
  const notificationId = req.params.id;
  async function queryPlusResponse(){
      /*query runs here*/
      const result = await notifications.getNotification(notificationId);
      /*response here if found*/ 
      if(result){
         res.send(result);
      }
      else {
      /* sending 404 headers if not found*/ 
         res.sendStatus(404);
      }
   }
   /* open connection and run query */
   execQuery(queryPlusResponse);
});


//POST REQUESTS

/* create a notification */
router.post("/:user_identifier/:user", (req,res,next)=>{
   const userIdentifier = req.params.user_identifier;
   const user = req.params.user;
   const notificationObjectLimit = req.body.limit;
   let notificationsObject;
   
    //add to database object and sending response object 
    async function queryPlusResponse(){
      if(userIdentifier === "username"){
         notificationsObject = await users.getUser(null,user,"notifications");
      }
      else if(userIdentifier === "userid"){
         notificationsObject = await users.getUser(user,null,"notifications");
      }
      else{
         res.sendStatus(403)
         res.end()
      }
       // get notificationIds from notificationObject stripped from user object
       notificationIds = notificationsObject.notifications;
       
       /*query runs here*/
       if(notificationIds.length === 0 || notificationIds.includes("0")){
         res.send([]);
       }
       else{
         const getNotifications = await notifications.getNotifications("",notificationObjectLimit,notificationIds);
         /*response here*/
         res.send(getNotifications);
       }
       
    }

    /* open connection and run query */
    execQuery(queryPlusResponse);
    
});

/* create a notification */
router.post("/", (req,res,next)=>{
   // get notification from request
   const notificationObject = req.body;
   const notificationObjectLimit = parseInt(notificationObject.limit); 
   //add to database object and sending response object 
   async function queryPlusResponse(){
      /*query runs here*/
      if(!notificationObject.notificationIds || notificationObject.notificationIds.includes("0")){
        res.send([]);
      }
      else{
        const getNotifications = await notifications.getNotifications("",notificationObjectLimit,notificationObject.notificationIds);
        /*response here*/
        res.send(getNotifications);
      }
      
   }

   /* open connection and run query */
   execQuery(queryPlusResponse);
   
});


//PUT REQUESTS
router.put("/:id", (req,res,next)=>{
  const updateObject = req.body;
  const notificationId = req.params.id;
  async function queryPlusResponse(){
      /*query runs here*/
      const result = await notifications.updateNotification(notificationId,updateObject);
      /* response here if found*/ 
      if(result){
         res.send(result);
      }
      else {
      /* sending 404 headers if not found*/ 
         res.sendStatus(404);
      }
      
   }
   /* open connection and run query */
   execQuery(queryPlusResponse);
});

//DELETE REQUESTS
router.delete("/:id", (req,res,next)=>{
  const notificationId = req.params.id;
  async function queryPlusResponse(){
      /*query runs here*/
      await notifications.deleteNotification(notificationId);
      /*RESPOND THAT DELETE WAS SUCCESSFULL*/ 
      res.send({success: "deleted"});
   }
   /* open connection and run query */
   execQuery(queryPlusResponse);
});

module.exports = router