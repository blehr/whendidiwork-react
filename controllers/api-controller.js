var moment = require("moment-timezone");
var Event = require("../models/event.js");
var User = require("../models/users.js");
var {google} = require("googleapis");
var OAuth2 = google.auth.OAuth2;
var auth = require("../services/auth");

const oauth2Client = new OAuth2(
  auth.googleAuth.clientID,
  auth.googleAuth.clientSecret,
  auth.googleAuth.callbackURL
);

var calendar = google.calendar("v3");
var drive = google.drive("v3");
var sheets = google.sheets("v4");

/* use a function for the exact format desired... */
function ISODateString(d) {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    ":" +
    pad(d.getUTCMinutes()) +
    ":" +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function formatDateTime(date, time) {
  return (
    moment(date).format("YYYY-MM-DD") +
    "T" +
    moment(time).format("HH:mm:ss.SSS")
  );
}

function formatSheetValues(event) {
  return {
    startDate: moment(event.startDate).format("ddd MM/DD/YYYY"),
    startTime: moment(event.startTime).format("hh:mm A"),
    endDate: moment(event.endDate).format("ddd MM/DD/YYYY"),
    endTime: moment(event.endTime).format("hh:mm A"),
    summary: event.note
  };
}

async function storeAccessToken() {
  var accessToken = oauth2Client.credentials.access_token;
  var expire_time = oauth2Client.credentials.expiry_date;

   // store token in case of refresh
   try {
    var user = await User.findOne({ "google.id": req.user.google.id });

    user.google.token = accessToken;
    user.google.expire_time = expire_time;

    await user.save();
  } catch (err) {
    return err;
  }
}

module.exports = function ApiController() {
  const logout = function(req, res) {
    req.logout();
    res.json("bye");
  };

  const getUser = function(req, res, next) {
    if (!req.user) {
      const err = { message: "No logged in user" };
      return next(err);
    }
    res.json(req.user);
  };

  const getCalendarList = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    calendar.calendarList.list(
      {
        auth: oauth2Client
      },
      function(err, response) {
        if (err) {
          return next(err);
        }
        // get user timeZone
        const primaryTimeZone = response.data.items.filter(cal => cal.primary);

        storeAccessToken();

        res.json({
          calendars: response.data.items,
          lastUsed: req.user.lastUsed.calendar,
          timeZone: primaryTimeZone[0].timeZone
        });
      }
    );
  };

  const getFiles = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date,
    });

    drive.files.list(
      {
        auth: oauth2Client,
        q:
          "name contains 'whendidiwork' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false"
      },
      function(err, response) {
        if (err) {
          return next(err);
        }

        storeAccessToken();
        res.send({ sheets: response.data.files, lastUsed: req.user.lastUsed.sheet });
      }
    );
  };

  const getEvents = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;
    var CalId = req.params.calendarId;

    const weekPast = moment().subtract(7, "days").toDate();
    const weekAhead = moment().add(7, "days").toDate();
    const weekPastGCF = ISODateString(weekPast);
    const weekAheadGCF = ISODateString(weekAhead);

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    calendar.events.list(
      {
        auth: oauth2Client,
        calendarId: CalId,
        timeMin: weekPastGCF,
        timeMax: weekAheadGCF,
        singleEvents: true,
        orderBy: 'startTime'
      },
      function(err, response) {
        if (err) {
          return next(err);
        }

        storeAccessToken();
        if (response.data.items) {
          res.send(response.data.items);
        } else {
          res.send([]);
        }
      }
    );
  };

  const createEvent = async function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;
    var CalId = req.params.calendarId;
    var sheetId = req.params.sheetId;

    var event = req.body.event;
    var sheet = formatSheetValues(event);

    var startDateTime = formatDateTime(event.startDate, event.startTime);
    var endDateTime = formatDateTime(event.endDate, event.endTime);

    if (startDateTime > endDateTime) {
      return next("Events must start before they end!");
    }

    function formatTimeZone(date) {
      return moment(date).tz(event.timeZone).format();
    }

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    // track last used calendar and sheet
    try {
      var user = await User.findOne({ "google.id": req.user.google.id });

      user.lastUsed.calendar = CalId;
      user.lastUsed.sheet = sheetId;

      await user.save();
    } catch (err) {
      return next(err);
    }

    const createRowPromise = new Promise((resolve, reject) => {
      sheets.spreadsheets.values.append(
        {
          auth: oauth2Client,
          spreadsheetId: sheetId,
          valueInputOption: "RAW",
          range: "Sheet1",
          resource: {
            majorDimension: "ROWS",
            values: [
              [
                sheet.startDate,
                sheet.startTime,
                sheet.endDate,
                sheet.endTime,
                sheet.summary
              ]
            ]
          }
        },
        function(err, response) {
          if (err) reject(err);
          storeAccessToken();
          resolve(response.data);
        }
      );
    });

    const createEventPromise = new Promise((resolve, reject) => {
      calendar.events.insert(
        {
          auth: oauth2Client,
          calendarId: CalId,
          resource: {
            summary: sheet.summary,
            description: sheet.summary,
            start: {
              dateTime: formatTimeZone(startDateTime)
            },
            end: {
              dateTime: formatTimeZone(endDateTime)
            }
          }
        },
        function(err, response) {
          if (err) reject(err);
          resolve(response.data);
        }
      );
    });

    Promise.all([createRowPromise, createEventPromise])
      .then(values => {
        const newEvent = new Event({
          google: {
            id: req.user.google.id
          },
          sheet: {
            id: sheetId,
            range: values[0].updates.updatedRange
          },
          calendar: {
            id: CalId,
            eventId: values[1].id
          }
        });

        newEvent.save(function(err, doc) {
          if (err) {
            return next(err);
          }
        });

        res.send(values[1]);
      })
      .catch(err => next(err));
  };

  const updateEvent = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;
    var CalId = req.params.calendarId;
    var eventId = req.params.eventId;

    var event = req.body.event;
    var sheet = formatSheetValues(event);

    var startDateTime = formatDateTime(event.startDate, event.startTime);
    var endDateTime = formatDateTime(event.endDate, event.endTime);

    function formatTimeZone(date) {
      return moment(date).tz(event.timeZone).format();
    }

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    const query = Event.findOne({
      $and: [
        {
          "google.id": req.user.google.id
        },
        {
          "calendar.eventId": eventId
        }
      ]
    });

    query.exec(function(err, event) {
      if (err) return next(err);
      if (event === null) {
        res.status(404).send({ err: "This event cannot be updated" });
        return;
      }
      const sheetId = event.sheet.id;
      const range = event.sheet.range;

      const updateRowPromise = new Promise((resolve, reject) => {
        sheets.spreadsheets.values.update(
          {
            auth: oauth2Client,
            spreadsheetId: sheetId,
            valueInputOption: "RAW",
            range: range,
            resource: {
              majorDimension: "ROWS",
              values: [
                [
                  sheet.startDate,
                  sheet.startTime,
                  sheet.endDate,
                  sheet.endTime,
                  sheet.summary
                ]
              ]
            }
          },
          function(err, response) {
            if (err) reject(err);
            storeAccessToken();
            resolve(response.data);
          }
        );
      });

      const updateEventPromise = new Promise((resolve, reject) => {
        calendar.events.update(
          {
            auth: oauth2Client,
            calendarId: CalId,
            eventId: eventId,
            resource: {
              summary: sheet.summary,
              description: sheet.summary,
              start: {
                dateTime: formatTimeZone(startDateTime)
              },
              end: {
                dateTime: formatTimeZone(endDateTime)
              }
            }
          },
          function(err, response) {
            if (err) reject(err);
            resolve(response.data);
          }
        );
      });

      Promise.all([updateRowPromise, updateEventPromise])
        .then(values => {
          res.send(values[1]);
        })
        .catch(err => next(err));
    });
  };

  const deleteEvent = async function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;
    var eventId = req.params.eventId;
    var CalId = req.params.calendarId;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    // find db doc
    const event = Event.findOne({
      $and: [
        {
          "google.id": req.user.google.id
        },
        {
          "calendar.eventId": eventId
        }
      ]
    });

    event.exec(function(err, doc) {
      if (err) return next(err);
      if (doc === null) {
        res.status(404).send({ err: "This event cannot be deleted" });
        return;
      }
      const row = doc.sheet.range;
      const sheetId = doc.sheet.id;

      const deleteRowPromise = new Promise((resolve, reject) => {
        sheets.spreadsheets.values.update(
          {
            auth: oauth2Client,
            spreadsheetId: sheetId,
            range: row,
            valueInputOption: "RAW",
            resource: {
              majorDimension: "ROWS",
              values: [["deleted", "event", "keep", "as", "placeholder"]]
            }
          },
          function(err, response) {
            if (err) reject(err);
            storeAccessToken();
            resolve(response.data);
          }
        );
      });

      const deleteEventPromise = new Promise((resolve, reject) => {
        calendar.events.delete(
          {
            auth: oauth2Client,
            calendarId: CalId,
            eventId: eventId
          },
          function(err, response) {
            if (err) reject(err);
            resolve(response.data);
          }
        );
      });

      Promise.all([deleteRowPromise, deleteEventPromise])
        .then(values => {
          res.send(values);
        })
        .catch(err => next(err));
    });
  };

  const getSheetMeta = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;
    var sheetId = req.params.sheetId;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    sheets.spreadsheets.values.get(
      {
        auth: oauth2Client,
        spreadsheetId: sheetId,
        range: "Sheet1"
      },
      function(err, response) {
        if (err) {
          return next(err);
        }
        storeAccessToken();
        if (response.data.values) {
          response.data.values.length < 11
            ? res.send(response.data.values.slice(1))
            : res.send(response.data.values.slice(-10));
        } else {
          res.send([[]]);
        }
      }
    );
  };

  const createCalendar = async function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;

    try {
      req.sanitizeBody("calendar").trim();
      req.sanitizeBody("calendar").escape();
      req.checkBody("calendar", "Must provide a calendar name").notEmpty();

      var errors = await req.getValidationResult();

      if (!errors.isEmpty()) {
        return next(errors.array().map(e => e.msg));
      }

    } catch (err) {
      return next(err);
    }

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    calendar.calendars.insert(
      {
        auth: oauth2Client,
        resource: {
          summary: req.body.calendar,
          timeZone: req.body.timeZone
        }
      },
      function(err, response) {
        if (err) {
          return next(err);
        }
        storeAccessToken();
        res.send(response.data);
      }
    );
  };

  const createSheet = async function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var expiry_date = +req.user.google.expiry_date;

    try {
      req.sanitizeBody("sheet").trim();
      req.sanitizeBody("sheet").escape();
      req.checkBody("sheet", "Must provide a sheet name").notEmpty();

      var errors = await req.getValidationResult();

      if (!errors.isEmpty()) {
        return next(errors.array().map(e => e.msg));
      }

    } catch (err) {
      return next(err);
    }

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken,
      expiry_date: expiry_date
    });

    const createFilePromise = new Promise((resolve, reject) => {
      drive.files.create(
        {
          auth: oauth2Client,
          resource: {
            name: req.body.sheet,
            mimeType: "application/vnd.google-apps.spreadsheet"
          }
        },
        function(err, response) {
          if (err) return next(err);
          resolve(response.data);
        }
      );
    });

    try {
      const fileResponse = await createFilePromise;

      sheets.spreadsheets.values.append(
        {
          auth: oauth2Client,
          spreadsheetId: fileResponse.id,
          valueInputOption: "RAW",
          range: "Sheet1",
          resource: {
            majorDimension: "ROWS",
            values: [["Date In", "Time In", "Date Out", "Time Out", "Notes"]]
          }
        },
        function(err, response) {
          if (err) return next(err);
          storeAccessToken();
          res.send(fileResponse);
        }
      );
    } catch (err) {
      if (err) return next(err);
    }
  };

  return {
    logout,
    getUser,
    getCalendarList,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getFiles,
    getSheetMeta,
    createCalendar,
    createSheet
  };
};
