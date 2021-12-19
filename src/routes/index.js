const express = require("express");
const router = express.Router();

// import controller 
// auth 
const { login, register, checkAuth } = require("../controllers/auth");
// literatur 
const { addLiterature, getLiteratureProfile, getSearchLiterature, getLiterature, getLiteratures, deleteLiterature, updateStatusLiterature } = require("../controllers/literature");
// profile 
const { getProfile, changeAvatar } = require("../controllers/profile");
// collection 
const {
    addMyCollection,
    deleteMyCollection,
    getMyCollection,
    getMyCollections
} = require("../controllers/collections");
// user 
const { updateUserData, updateUserAvatar } = require("../controllers/user");

// import middlewares 
const { auth, adminOnly } = require("../middlewares/auth");
const { uploadPdf, uploadImage } = require("../middlewares/uploadFile");

// router auth
router.post("/login", login);
router.post("/register", register);
router.get("/checkAuth", auth, checkAuth);
// router literature
router.get("/literature", auth, getSearchLiterature);
router.post("/literatures",auth, uploadPdf("attache", "uploads/literatures"), addLiterature);
router.get("/profile/literatures", auth, getLiteratureProfile);
router.get("/literatures/:id", auth, getLiterature);
router.get("/literatures", auth, adminOnly, getLiteratures);
router.put("/literatures/:id", auth, adminOnly, updateStatusLiterature);
router.delete("/literature/:id", auth, deleteLiterature);

// router collection
router.post("/collections", auth, addMyCollection);
router.delete("/collections/:id", auth, deleteMyCollection);
router.get("/collections/literature/:id", auth, getMyCollection);
router.get("/collections", auth, getMyCollections)

// router user
router.put("/users", auth, updateUserData);
router.put(
  "/users/avatar",
  uploadImage("avatar", "uploads/avatars"),
  auth,
  updateUserAvatar
);

// router profile 
router.get("/profile/:id", auth, getProfile );
router.get("/avatarProfile/:id", uploadImage("avatar", "uploads/avatars"), auth, changeAvatar );

module.exports = router;