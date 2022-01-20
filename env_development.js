module.exports= {
    set: function(){
        process.env.PORT = 1000
        process.env.NODE_ENV = "development"
        process.env.DB_URI = "mongodb://langson:%40Devpassword007@cluster0-shard-00-00.mp97e.mongodb.net:27017,cluster0-shard-00-01.mp97e.mongodb.net:27017,cluster0-shard-00-02.mp97e.mongodb.net:27017/aydinty?ssl=true&replicaSet=atlas-ftsvl5-shard-0&authSource=admin&retryWrites=true&w=majority"
        process.env.FFMPEG_PATH = "bin/ffmpeg"
        process.env.FFPROBE_PATH = "bin/ffprobe"
        process.env.FFPLAY_PATH = "bin/ffplay"
        process.env.SESSION_BD_URI = "mongodb://langson:%40Devpassword007@cluster0-shard-00-00.mp97e.mongodb.net:27017,cluster0-shard-00-01.mp97e.mongodb.net:27017,cluster0-shard-00-02.mp97e.mongodb.net:27017/sessions?ssl=true&replicaSet=atlas-ftsvl5-shard-0&authSource=admin&retryWrites=true&w=majority"
        process.env.SESSION_DB_COLLECTION = "sessions"
        process.env.TRASH_DB_URI = "mongodb://langson:%40Devpassword007@cluster0-shard-00-00.mp97e.mongodb.net:27017,cluster0-shard-00-01.mp97e.mongodb.net:27017,cluster0-shard-00-02.mp97e.mongodb.net:27017/trash?ssl=true&replicaSet=atlas-ftsvl5-shard-0&authSource=admin&retryWrites=true&w=majority"
        process.env.STATIC_FOLDER_NAME = "/public"
        process.env.API_URL = "http://localhost:1000"
        process.env.SESSION_SECRET = "72b95b39f53ddf4967a0d009792bf96f",
        process.env.ACCESS_TOKEN = "72b95b39f53ddf4967a0d009792bf96f"
        process.env.ROOTPATH = __dirname
    }
}
