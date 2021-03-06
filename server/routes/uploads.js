const express = require("express");
const router = express.Router();
const uuid = require('uuid');
const uploads = require("../database/uploads").uploads;
const execQuery = require("../database/connection").aydinty.runQuery;
const IncomingForm = require("formidable").IncomingForm;
//const videoThumnaiGenerator = require("../processes/video-thumnail-generation");
const imageResizer = require("../processes/image-processing").imageResizer;
//const videoProcesser = require("../processes/video-processing");
//constants
const dotenv = require('dotenv');
dotenv.config(); // load environmental variables
const env_config = require('../../env_config');
env_config.config() // load NODE_ENVIRONMENTAL variables

const ROOTPATH =  process.env.ROOTPATH 
const STATIC_FOLDER_NAME = process.env.STATIC_FOLDER_NAME
const API_URL = process.env.API_URL

/* UUID CODE*/
const v1options = {
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: Date.now(),
  nsecs: 5678
};
const myUuid = "-aydinty-" + uuid.v4(v1options); 


// GET REQUESTS

/* get all uploads */
router.get("/", (req,res,next)=>{
   let limit =  parseInt(req.query.limit);
   let fields = req.query.fields;
   async function queryPlusResponse(){
        /*query runs here*/
        const result = await uploads.getUploads(fields=fields,limit=limit);
        /*response here*/ 
        res.send(result);
        return {query: "done"};
     }
     /* open connection and run query */
     execQuery(queryPlusResponse);
});
/* get one upload by id */
router.get("/:id", (req,res,next)=>{
  const uploadId = req.params.id;
  async function queryPlusResponse(){
      /*query runs here*/
      const result = await uploads.getUpload(uploadId);
      /*response here if found*/ 
      if(result){
         res.send(result);
      }
      else {
      /* sending 404 headers if not found*/ 
         res.sendStatus(404);
      }
      return {query: "done"};
   }
   /* open connection and run query */
   execQuery(queryPlusResponse);
});


//POST REQUESTS

/* create an upload */
router.post("/", (req,res,next)=>{
    let form = new IncomingForm(); /* receive the form-data object */ 
    form.parse(req); /* parse the form-data object from the request */ 
    let  fileName = '';
    form.maxFieldsSize = 300 * 1024 * 1024;
    form.maxFileSize = 300 * 1024 * 1024;
    form.on('error', function(err) {    
       console.log("There was an error ........\n"+err,form);
    })
   
      form.on('fileBegin', function (userid, file){
         /* check if userid is not set, if so, send a bad request response otherwise upload*/
         // split filename into array, add uniqid to it, then rename it
         let fileNameArray = file.name.split('.');
         const fileExt = fileNameArray.pop(); 
         file.ext = fileExt;
         fileNameArray = fileNameArray + myUuid + '.' + fileExt;
         uncleanedfileName = fileNameArray; //file still holds some unwanted characters
         //let uri_path; // the uri path for accessing file through server
         // check if fileNameArray is still a string after splitting, popping and reconcartinating it
         if( typeof fileNameArray === 'object' && fileNameArray.constructor === Array ){
            uncleanedfileName = fileNameArray.join();
         }
         else if (typeof fileNameArray === 'string' || fileNameArray instanceof String) {
            uncleanedfileName = fileNameArray;
         }
         else{
            uncleanedfileName = fileNameArray.join();
         }

         /* clean off the unwanted characters from the filename and store it in new variable */
         fileName = uncleanedfileName.replace(/[\|&;\$%@"<>\(\)\+,]/g, "-");
         file.fileName = fileName;
         /* split file type to get the type of the upload from pending file.
            IS IT: audio, video or image, then upload to respective folder*/ 
            const splitFileType = file.type.split("/");
         
         // // check if file is an audio file, then upload 
         // if(splitFileType[0] === "audio"){
         //    file.path = ROOTPATH + STATIC_FOLDER_NAME+'/files/tracks/' + fileName; 
         //    file.uri_path =  '/files/tracks/' + fileName; 
         // }

         // // check if file is a video file, then upload 
         // else if(splitFileType[0] === "video"){
         //    file.path = ROOTPATH + STATIC_FOLDER_NAME+'/files/videos/' + fileName;
         //    file.uri_path =  '/files/videos/' + fileName; 
         //    //videoProcesser.resizeVideo(file.path);
         //    // send you a response that the video has been uploaded, but is being processed, you will be notified when it's done
         //    // res.send({videoUpload: "pending"});
         // }
         // check if file is an image file, then upload 
         /*else*/ if(splitFileType[0] === "image"){
            file.path = ROOTPATH + STATIC_FOLDER_NAME+'/files/images/' + fileName;
            file.uri_path =  '/files/images/'+fileName; 
         }
         
         else{
            /* sending 403 headers if not audio, video or image file*/ 
            res.sendStatus(403);
         }
         
       });
    


    form.on('file', function (userid, file){ //  event after file has uploaded
      // initialize empty file object
      let fileObject = {};
      // check if file-type is any of file types audio, video or image 
      let fileFormat = file.type;
      let splitFileType = fileFormat.split("/");

      // make a download link uri
      const download_link = "/downloads/download/?type="+splitFileType[0]+"&filename="+fileName;
      
      // check if file is audio then overwrite the fileObject to send to database 
      // if(splitFileType[0] === "audio"){
      //    fileObject = {
      //       type: "audio",
      //       track:{
      //          full_track_path : file.uri_path,
      //          uri_path: file.uri_path,
      //          size: file.size,
      //          download_link: download_link
      //       }
      //    }; 
      // }
      // // check if file is video then overwrite the fileObject to send to database 
      // else if(splitFileType[0] === "video"){
      //    // run video processing here and send response after done
      //    // generate thumails for video
      //    const image = videoThumnaiGenerator.generateThumnail(file.path,ROOTPATH+STATIC_FOLDER_NAME+'/files/images/',file.fileName);
      //    let cover = image.image_uri_path;
      //    let medium = image.image_uri_path.replace("."+image.thumbExt, "-500-270."+image.thumbExt);
      //    let thumbnail = image.image_uri_path.replace("."+image.thumbExtt, "-160-155."+image.thumbExt);
      //    let small = image.image_uri_path.replace("."+image.thumbExt, "-60-60."+image.thumbExt);
      //    fileObject = {
      //       type: "video",
      //       video: {
      //          full_video_path : file.uri_path,
      //          uri_path: file.uri_path,
      //          size: file.size,
      //          download_link: download_link
      //       },
      //       image: {
      //          cover: cover,
      //          medium: medium,
      //          thumbnail: thumbnail,
      //          small: small,
      //       }
      //    }; 
      // }
      // check if file is image then overwrite the fileObject to send to database 
      /*else*/ if(splitFileType[0] === "image"){
         imageResizer(file.uri_path, file.path, file.ext); 
         let cover = file.uri_path;
         let medium = file.uri_path.replace("."+file.ext, "-500-270."+file.ext);
         let thumbnail = file.uri_path.replace("."+file.ext, "-160-155."+file.ext);
         let small = file.uri_path.replace("."+file.ext, "-60-60."+file.ext);
         fileObject = {
            type: "image",
            image: {
               cover: cover,
               medium: medium,
               thumbnail: thumbnail,
               small: small,
               image_full_path : file.uri_path,
               uri_path: file.uri_path,
               size: file.size,
               download_link: download_link
            }
         }; 
      }
      else{
         // check if file is an attachement then overwrite the fileObject to send to database 
         fileObject = {
            type: "attachment",
            attachment:{
               full_attachment_path : file.uri_path,
               size: file.size,
               download_link: download_link
            }
            
         }; 
      }
      
      // define query function
      async function queryPlusResponse(){ 
       ResponseObject = await uploads.addUpload(fileObject);
       res.send(ResponseObject);
       return {query: "done"};
      }
      /* open connection and run query */
      execQuery(queryPlusResponse); 
    });
  
});


//PUT REQUESTS
router.put("/:id", (req,res,next)=>{
  const updateObject = req.body;
  const uploadId = req.params.id;
  async function queryPlusResponse(){
      /*query runs here*/
      const result = await uploads.updateUpload(uploadId,updateObject);
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
  const uploadId = req.params.id;
  async function queryPlusResponse(){
      /*query runs here*/
      await uploads.deleteUpload(uploadId);
      /*rREDIRECT USER TO HOMEPAGE AND NOT SEND ANY RESPONSE*/ 
      res.send({success: "deleted"});
   }
   /* open connection and run query */
   execQuery(queryPlusResponse);
});

module.exports = router