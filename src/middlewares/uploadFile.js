const multer = require("multer");

// upload pdf 
exports.uploadPdf = (imageFile, location) => {
  // initialization multer diskstorage
  // make destination file for upload
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, location); //file storage location
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename filename by date now + original filename
    },
  });

  // function for file filter based on extension
  const fileFilter = (req, file, cb) => {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(pdf||PDF)$/)) {
        req.fileValidationError = {
          message: "Only pdf file are allowed",
        };
        return cb(new Error("Only pdf file are allowed"), false);
      }
      cb(null, true);
    }
  }

  const sizeInMB = 10;
  const maxSize = sizeInMB * 1000 * 1000; // Maximum file size in MB

  // generate multer instance for upload include storage, validation and max file size
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(imageFile);

  // middleware handler
  return (req, res, next) => {
    upload(req, res, function (err) {
      // show an error if validation failed
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);
      // show an error if it exceeds the max size
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10MB",
          });
        }
        return res.status(400).send(err);
      }

      // if okay next to controller
      // in the controller we can access using req.file
      return next();
    });
  };
};

// upload img 
exports.uploadImage = (imageFile, location) => {
  // initialization multer diskstorage
  // make destination file for upload
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, location); //file storage location
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename filename by date now + original filename
    },
  });

  // function for file filter based on extension
  const fileFilter = (req, file, cb) => {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|svg)$/)) {
        req.fileValidationError = {
          message: "Only image file are allowed",
        };

        return cb(new Error("Only image file are allowed"), false);
      }

      cb(null, true);
    }
  };

  const sizeMB = 10;
  const maxSize = sizeMB * 1024 * 1024; // Maximum file size in MB

  // generate multer instance for upload include storage, validation and max file size
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(imageFile);

  // middleware handler
  return (req, res, next) => {
    upload(req, res, function (error) {
      // show an error if validation failed
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      // show an error if it exceeds the max size
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized is 10MB",
          });
        }
        return res.status(400).send(error);
      }

      // if okay next to controller
      // in the controller we can access using req.file
      return next();
    });
  };
};