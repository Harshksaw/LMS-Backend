const express = require("express")
const router = express.Router()


// Routes for deleteprofile , updateprofile ,getuserdetails , getEnrolledCourse , updateDisplayPicture;


const { auth, isInstructor } = require("../middlewares/auth")
const {deleteAccount, updateProfile, getAllUserDetails, getProfile} = require("../controllers/Profile")
   
    
// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************
router.delete("/deleteProfile", auth, deleteAccount)                        // Delet User Account
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

router.put("/getProfile", auth, getProfile)



module.exports = router

 