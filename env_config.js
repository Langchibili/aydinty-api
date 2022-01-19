const env_local = require("./env_local");
const env_production = require("./env_production");
const env_development = require("./env_development");

module.exports = {
      config: function(){
        if(process.env.NODE_ENV === "local"){
            env_local.set()
        }
        else if(process.env.NODE_ENV === "development"){
            env_development.set()
        }
        else if(process.env.NODE_ENV === "production"){
            env_production.set()
        }
      }
}