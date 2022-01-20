const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config(); // load environmental variables
const env_config = require('../../env_config');
env_config.config() // load NODE_ENVIRONMENTAL variables
const DB_URI = process.env.DB_URI

// make connection function and run query function
module.exports.aydinty = {
          runQuery: async (query) => {
                        if(mongoose.connections.length < 2){
                              mongoose.connect(DB_URI,{useNewUrlParser: true, useUnifiedTopology: true });
                        }
                         const db = mongoose.connection;
                         await query();
                         db.on('error', console.error.bind(console, 'connection error:'));
                         db.on('open', function() {
                               process.removeAllListeners(); 
                         });
                         db.on("data", function(){
                               db.removeAllListeners();
                         })
                         process.on('SIGINT', function(){
                         mongoose.connection.close(function(){
                         console.log("Mongoose default connection is disconnected due to application termination");
                         process.exit(0);
                         });
                     });
              //   }
        }
}
