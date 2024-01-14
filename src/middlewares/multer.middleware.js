import multer from "multer";

//this returns filename(/public/temp/originalname)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //file is with multer,req is from user,cb is for callback
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //name of the on the storage
  },
});

export const upload = multer({
  storage: storage,
});
