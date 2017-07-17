exports.validateInputs = async (req, res, next) => {
  try {
    req.sanitizeBody("event.startDate").trim();
    req.sanitizeBody("event.startTime").trim();
    req.sanitizeBody("event.endDate").trim();
    req.sanitizeBody("event.endTime").trim();
    req.sanitizeBody("event.note").trim();
    req.checkBody("event.startDate", "Must provide a start date.").notEmpty();
    req.checkBody("event.startTime", "Must provide a start time.").notEmpty();
    req.checkBody("event.endDate", "Must provide an end date.").notEmpty();
    req.checkBody("event.endTime", "Must provide an end time.").notEmpty();
    req.checkBody("event.note", "Must provide an end time.").notEmpty();

    req.sanitizeBody("event.startDate").escape();
    req.sanitizeBody("event.startTime").escape();
    req.sanitizeBody("event.endDate").escape();
    req.sanitizeBody("event.endTime").escape();
    req.sanitizeBody("event.note").escape();

    var errors = await req.getValidationResult();

    if (!errors.isEmpty()) {
      return next(errors.array().map(e => e.msg));
    }

    next();
  } catch (err) {
    return next(err);
  }
};

exports.validateParams = async (req, res, next) => {
  try {
    req.sanitizeParams("calendarId").trim();
    req.sanitizeParams("calendarId").escape();
    req.sanitizeParams("sheetId").trim();
    req.sanitizeParams("sheetId").escape();
    req.sanitizeParams("eventId").trim();
    req.sanitizeParams("eventId").escape();

    var errors = await req.getValidationResult();

    if (!errors.isEmpty()) {
      return next(errors.array().map(e => e.msg));
    }

    next();

  } catch (err) {
    return next(err);
  }
};