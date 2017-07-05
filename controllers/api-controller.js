// var request = require("request");
var moment = require("moment-timezone");
var Event = require("../models/event.js");
var User = require("../models/users.js");
var google = require("googleapis");
var OAuth2 = google.auth.OAuth2;
var auth = require("../services/auth");
// const checkToken = require("../services/token-validator");

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

var today = moment();
var weekPast = moment().subtract(7, "days").toDate();
var weekAhead = moment().add(7, "days").toDate();

var weekPastGCF = ISODateString(weekPast);
var weekAheadGCF = ISODateString(weekAhead);

module.exports = function ApiController() {
  const logout = function(req, res) {
    req.logout();
    res.json("bye");
  };

  const getUser = function(req, res, next) {
    if (!req.user) {
      const err = { message: "No logged in user"};
      return next(err);
    }
    res.json(req.user);
  };

  const getCalendarList = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
        const primaryTimeZone = response.items.filter(cal => cal.primary);

        res.json({
          calendars: response.items,
          lastUsed: req.user.lastUsed.calendar,
          timeZone: primaryTimeZone[0].timeZone
        });
      }
    );
  };

  const getFiles = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
        res.send({ sheets: response.files, lastUsed: req.user.lastUsed.sheet });
      }
    );
  };

  const getEvents = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var CalId = req.params.calendarId;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
    });

    calendar.events.list(
      {
        auth: oauth2Client,
        calendarId: CalId,
        timeMin: weekPastGCF,
        timeMax: weekAheadGCF
      },
      function(err, response) {
        if (err) {
          return next(err);
        }
        if (response.items) {
          res.send(response.items);
        } else {
          res.send([]);
        }
      }
    );
  };

  const createEvent = async function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;
    var CalId = req.params.calendarId;
    var sheetId = req.params.sheetId;
    var event = req.body.event;
    var startDate = moment(event.startDate).format("ddd MM/DD/YYYY");
    var startTime = moment(event.startTime).format("hh:mm A");
    var endDate = moment(event.endDate).format("ddd MM/DD/YYYY");
    var endTime = moment(event.endTime).format("hh:mm A");
    var summary = event.note;

    function formatDateTime(date, time) {
      return (
        moment(date).format("YYYY-MM-DD") +
        "T" +
        moment(time).format("HH:mm:ss.SSS")
      );
    }

    const startDateTime = formatDateTime(event.startDate, event.startTime);
    const endDateTime = formatDateTime(event.endDate, event.endTime);

    function formatTimeZone(date) {
      return moment(date).tz(event.timeZone).format();
    }

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
            values: [[startDate, startTime, endDate, endTime, summary]]
          }
        },
        function(err, response) {
          if (err) reject(err);
          resolve(response);
        }
      );
    });

    const createEventPromise = new Promise((resolve, reject) => {
      calendar.events.insert(
        {
          auth: oauth2Client,
          calendarId: CalId,
          resource: {
            summary: summary,
            description: summary,
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
          resolve(response);
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
    var CalId = req.params.calendarId;
    const eventId = req.params.eventId;
    var event = req.body.event;
    var startDate = moment(event.startDate).format("ddd MM/DD/YYYY");
    var startTime = moment(event.startTime).format("hh:mm A");
    var endDate = moment(event.endDate).format("ddd MM/DD/YYYY");
    var endTime = moment(event.endTime).format("hh:mm A");
    var summary = event.note;

    function formatDateTime(date, time) {
      return (
        moment(date).format("YYYY-MM-DD") +
        "T" +
        moment(time).format("HH:mm:ss.SSS")
      );
    }

    const startDateTime = formatDateTime(event.startDate, event.startTime);
    const endDateTime = formatDateTime(event.endDate, event.endTime);

    function formatTimeZone(date) {
      return moment(date).tz(event.timeZone).format();
    }

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
              values: [[startDate, startTime, endDate, endTime, summary]]
            }
          },
          function(err, response) {
            if (err) reject(err);
            resolve(response);
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
              summary: summary,
              description: summary,
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
            resolve(response);
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
    var eventId = req.params.eventId;
    var CalId = req.params.calendarId;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
      if (doc === null) res.end("NO");
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
            resolve(response);
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
            resolve(response);
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
    var sheetId = req.params.sheetId;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
        if (response.values) {
          response.values.length < 11
            ? res.send(response.values.slice(1))
            : res.send(response.values.slice(-10));
        } else {
          res.send([[]]);
        }
      }
    );
  };

  const createCalendar = function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
        res.send(response);
      }
    );
  };

  const createSheet = async function(req, res, next) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;

    oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refreshToken
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
          resolve(response);
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
          res.send(fileResponse);
        }
      );
    } catch (err) {
      if (err) return next(err);
    }
  };

  const checkToken = function(req, res) {
    var token = req.user.google.token;
    var refreshToken = req.user.google.refreshToken;

    var options = {
      method: "GET",
      url:
        "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token
    };
    request(options, function(err, response, body) {
      if (err) throw err;
      res.send(body);
    });
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
    createSheet,
    checkToken
  };
};
