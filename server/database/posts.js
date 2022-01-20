const mongoose = require("mongoose");
const date =  require('date-and-time');
const docApiConcatinator = require("../functions").docApiConcatinator; // adds current API_URL to uris
const now = new Date();

const API_URL = process.env.API_URL

//post schema
const postSchema = new mongoose.Schema({
      categorNames: [],
      userId: String,
      userName: String,
      userfullName: String,
			type: {
                type: String,
                default: "post"
            },
			post_type: {
                type: String,
                default: "text"
            },
			status:{
                type: String,
                default: "published"
            },
            privacy: {
                type: String,
                default: "public"
            },   
			title:{
        type: String,
        default: "untitled"
      },
			title_short: {
        type: String,
        default: "untitled"
     },
      full_title: {
        type: String,
        default: "untitled"
     },
      dashed_title: {
        type: String,
        default: "untitled"
     },
			description: String,
			short_description: String,
      author: {
          authorId: String,
          authorName: String,
          picture_xl: String,
          authorUserName: String,
          linkToUploaderPage: String
      },
			explicit:Boolean,
			isofficial: Boolean,
      copyrightText: String,
			ediited:{
				status:{
                    type: Boolean,
                    default: false
                },
				editCount: {
                    type: Number,
                    default: 0
                }
			},
			previewed:{
                status:{
                    type: Boolean,
                    default: false
                },
                previewCount: {
                    type: Number,
                    default: 0
                }
			},
      embed:{
        type: {type: String, default: "video"},
        srcOrigin: {type: String, default: "youtube"},
        belongsToSong: {type: Boolean, default: false},
        embedUri: {type: String},
        embedHtml: {type: String},
        youtubeId: {type: String}
      },
			thumbnail:{
                  size:  { type: Number },
                  user_id: { type: String },
                  cover: { type: String, default : "/images/blankthumbnail-full-width.jpg" },
                  medium: { type: String, default : "/images/blankthumbnail-mid-width.png" },
                  thumbnail: { type: String, default : "/images/blankthumbnail-thumb-width.png" },
                  small: { type: String, default : "/images/blankthumbnail-small-width.png"},
                  cover_big: { type: String },
                  cover_xl: { type: String },
                  type: { type: String },
                  size: Number
              },
            atttachment: {
                post_url: { type: String },
                post_thumnail: { type: String },
                size: Number,
                type: String
            },
			counts: {
				likes: {
                    type: Number,
                    default: 0
                  },
                unique_plays: {
                    type: Number,
                    default: 0
                  },
                unique_downloads: {
                type: Number,
                default: 0
                } ,
				unique_likes: {
                    type: Number,
                    default: 0
                  },
				shares: {
                    type: Number,
                    default: 0
                  },
                views: {
                    type: Number,
                    default: 0
                  },
                unique_views: {
                type: Number,
                default: 0
                },
				totalcounts: {
                    type: Number,
                    default: 0
                  },
                reposts: {
                    type: Number,
                    default: 0
                  },
                comments: {
                    type: Number,
                    default: 0
                  },
                replies: {
                    type: Number,
                    default: 0
                  },
                commentsAndReplies: {
                    type: Number,
                    default: 0
                  }
			},
			chatrank: {
				thisWeek: Number,
				lastWeek: Number
			},
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
                },
				revisions: []
            },
        tags:[]
        });


// post model
const postModel = mongoose.model("posts",postSchema,"posts");        
  
module.exports.posts = {
                 /* GET ALL POSTS FROM DATABASE*/
                 getPosts: async function(fields=null,limit=null,arrayOfIds=null, sortObject={_id: -1}){
                    if(!arrayOfIds){
                      return await docApiConcatinator(API_URL, null, await postModel.find({},fields).sort(sortObject).limit(limit));
                      }
                      else{
                        return docApiConcatinator(API_URL, null, await postModel.find({ _id : { $in : arrayOfIds } },fields).sort(sortObject).limit(limit));
                      }

                  },
                  getPostsByUserId: async function(userId=null, post_type="music", fields=null,limit=null,sortObject={_id: -1}){
                    return await docApiConcatinator(API_URL, null, await postModel.find({ userId :userId, post_type: post_type},fields).sort(sortObject={_id: -1}).limit(limit));
                 },

                 getPostsByPostCount: async function(postId=null,count,fields=null,limit=null,sortObject={_id: -1}){
                  return await docApiConcatinator(API_URL, null, await postModel.find({ _id :postId},fields).sort(sortObject={counts: {[count]: -1}}).limit(limit));
                 },
                  getPostsByUserIds: async function(fields=null,limit=null,arrayOfIds=null,sortObject={_id: -1}){
                    return await docApiConcatinator(API_URL, null, await postModel.find({ userId : { $in : arrayOfIds } },fields).sort(sortObject={_id: -1}).limit(limit));
                  },
                  getPostsByPostIds: async function(fields=null,limit=null,arrayOfIds=null,sortObject={_id: -1}){
                    return await docApiConcatinator(API_URL, null, await postModel.find({ _id : { $in : arrayOfIds } },fields).sort(sortObject={_id: -1}).limit(limit));
                  },
                  getPostsByTypeAndUserIds: async function(fields=null,limit=null,arrayOfIds=null,post_type="music",sortObject={_id: -1}){
                    return await docApiConcatinator(API_URL, null, await postModel.find({ userId : { $in : arrayOfIds }, post_type: post_type },fields).sort(sortObject={_id: -1}).limit(limit));
                  },
                  getPostsByType: async function(post_type, fields=null,limit=null, sortObject={_id: -1}){
                    return await docApiConcatinator(API_URL, null, await postModel.find({ post_type: post_type },fields).sort(sortObject).limit(limit));
                  },
                  getPostsByTypeAndTaxonomy: async function(post_type, taxonomy, taxonomyValue, fields=null,limit=null,arrayOfIds=null,sortObject={_id: -1}){
                    return await docApiConcatinator(API_URL, null, await postModel.find({ [taxonomy] : taxonomyValue, post_type: post_type },fields).sort(sortObject={_id: -1}).limit(limit));
                  },
                  getUserPostsByTypeAndTaxonomy: async function(post_type,taxonomy, taxonomyValue,userId=null,username=null,fields=null,limit=null,arrayOfIds=null,sortObject={_id: -1}){
                    let filterObject;
                    if(userId){
                      filterObject = { userId: userId, [taxonomy] : taxonomyValue, post_type: post_type };
                    }
                    else{
                      filterObject = { userName: username, [taxonomy] : taxonomyValue, post_type: post_type }
                    }
                    return await docApiConcatinator(API_URL, null, await postModel.find(filterObject,fields).sort(sortObject={_id: -1}).limit(limit));
                  },
                  /* GET ONE POST FROM DATABASE*/
                  getPost: async function(postId,fields=null){
                    const filterObject = { _id: postId };
                    return await docApiConcatinator(API_URL, await postModel.findOne(filterObject, fields),[]);

                },
                /* ADD A POST TO DATABASE AND RETURN SAVED OBJECT*/
                  addPost: async function(postObject){
                    let tagsString = postObject.author.authorName+" "+postObject.short_description;
                    tagsString = tagsString.toLowerCase();
                    tagsString = tagsString.replace(" - "," ");
                    tagsString = tagsString.replace("-"," ");
                    const tagsArray = tagsString.split(" ");
                    postObject.tags = tagsArray;
                    postObject.dashed_title = tagsArray.join("-");
                    const newPost = new postModel(postObject);
                    return await newPost.save();
                },
                /* UPDATE A POST INFO IN DATABASE*/
                  updatePost: async function(postId, postUpdateObject){
                    const filterObject = { _id: postId };
                    const response = await postModel.updateOne(filterObject, postUpdateObject);
                    const updated = { updated: response.n };
                    return updated;
                },
                /* DELETE A POST FROM DATABASE*/
                  deletePost: async function(postId){
                    return await postModel.findByIdAndDelete(postId, async function(err, doc) {
                      if(err) console.log(err);
                      console.log("Successful deletion");
                      return doc
                    });
                  },
                /* DELETE A POST FROM DATABASE*/
                searchPost: async function(keyword, fields=null, limit=null){
                  keyword = keyword.toLowerCase();
                  return await docApiConcatinator(API_URL, null, await postModel.find({ ["tags"] : keyword },fields).sort(sortObject={_id: -1}).limit(limit));             
                },
                getByQuery: function(){
                     return;
                } 
}