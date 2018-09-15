
module.exports = function(app) {
    var router = app.loopback.Router();
    
    // preparing multer
    const multer = require('multer');
    var fs = require('fs');
    const multerConfig = {
        storage: multer.diskStorage({
            destination: function (req, file, next) {
                var dirPath = 'client/uploads'
                if (!fs.existsSync(dirPath)) {
                    var dir = fs.mkdirSync(dirPath);
                }
                next(null, dirPath + '/');
            },
            filename: function(req, file, next){
                const ext = file.mimetype.split('/')[1];
                var originalName = file.originalname;
                originalName = originalName.replace(" ","_").replace("."+ext,"");
                next(null,originalName+"_"+Date.now()+"."+ext);
            }
        }),
        fileFilter: function(req, file, next){
            if(!file){
                next();
            }else{
                const mimetype = file.mimetype;
                const isImage = mimetype.startsWith("image/");
                if(isImage){
                    next(null, true);
                }else{
                    next({message:"File type not supported"}, false);
                }
            }
        }
    };

    //declaring post
    router.post('/upload',multer(multerConfig).single('photo'),function(req,res){
        if(req.file){
            url = {url: "http://localhost:3000/client/uploads/"+req.file.filename,
                    path: "/client/uploads/"+req.file.filename}
            res.json(url);
        }else{
            res.send("No file found");
        }
    });
    app.use(router);
  }
