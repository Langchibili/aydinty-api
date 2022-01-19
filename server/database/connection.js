const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI


// make connection function and run query function
module.exports.aydinty = {
          runQuery: (query) => {
                        if(mongoose.connections.length < 2){
                              mongoose.connect(DB_URI, {useNewUrlParser: true, poolSize: 1000, useUnifiedTopology: true });
                        }
                         const db = mongoose.connection;
                         query();
                         db.on('error', console.error.bind(console, 'connection error:'));
                         db.on('open', function() {
                               process.removeAllListeners();
                               // const qry = await
                                  // run the query
                                //db.close();
                                
                              // if(mongoose.connections.length > 2){
                              //      await db.close();
                              // }
                              
                         });
                         db.on("data", function(){
                               db.removeAllListeners();
                         })
                         // db.on("close",()=>{
                         // mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true });
                         // });
                         process.on('SIGINT', function(){
                         mongoose.connection.close(function(){
                         console.log("Mongoose default connection is disconnected due to application termination");
                         process.exit(0);
                         });
                     });
              //   }
        }
}
