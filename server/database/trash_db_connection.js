const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config(); // load environmental variables
const env_config = require('../../env_config');
env_config.config() // load NODE_ENVIRONMENTAL variables
const TRASH_DB_URI = process.env.TRASH_DB_URI

// make connection function and run query function
module.exports.aydinty = {
          runQuery: async (query) => {
                 const trashConnection = mongoose.createConnection(TRASH_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
                 trashConnection.on('error', console.error.bind(console, 'connection error:'));
                 trashConnection.once('open', async function() {
                    await query(); // run the query
                    await trashConnection.close();
                 });
          }
}