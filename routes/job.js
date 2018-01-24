var express = require("express");
var router = express.Router();

// import controllers
var jobController = require("../controller/jobController");

/** POST a job request to schedule metrics collection. **/
router.post('/schedule', jobController.schedule);


module.exports = router;