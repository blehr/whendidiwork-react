const express = require("express");
const passport = require("passport");
const path = process.cwd();
const cors = require("cors");
const {checkToken} = require("../services/token-validator");

const ApiController = require("../controllers/api-controller.js")();

const apiRouter = express.Router();
apiRouter.use(cors({ origin: true, credentials: true }));
apiRouter.use(checkToken);

const routes = () => {
  apiRouter.route("/user").get(ApiController.getUser);

  apiRouter.route("/logout").get(ApiController.logout);

  apiRouter.route("/getCalendarList").get(ApiController.getCalendarList);

  apiRouter.route("/getEvents/:calendarId").get(ApiController.getEvents);

  apiRouter
    .route("/createEvent/:calendarId/:sheetId")
    .post(ApiController.createEvent);

  apiRouter
    .route("/updateEvent/:calendarId/:eventId")
    .put(ApiController.updateEvent);

  apiRouter
    .route("/deleteEvent/:calendarId/:eventId")
    .delete(ApiController.deleteEvent);

  apiRouter.route("/getFiles").get(ApiController.getFiles);

  apiRouter.route("/getSheetMeta/:sheetId").get(ApiController.getSheetMeta);

  apiRouter.route("/createCalendar").post(ApiController.createCalendar);

  apiRouter.route("/createSheet").post(ApiController.createSheet);

  apiRouter.route("/checkToken").get(ApiController.checkToken);

  return apiRouter;
};

module.exports = routes;
