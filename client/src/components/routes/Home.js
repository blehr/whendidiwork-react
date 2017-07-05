import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import App from "../App";
import TopRow from "../TopRow";
import CalendarSelect from "../Calendar-Select";
import SheetSelect from "../Sheet-Select";
import DatePick from "../Date-Pick";
import TimePick from "../Time-Pick";
import Note from "../../components/Note";
import EventCard from "../../components/Event-Card";
import SheetTable from "../../components/Sheet-Table";
import Paper from "material-ui/Paper";
import FormSubmit from "../Form-Submit";
import EventEditSubmit from "../Event-Edit-Submit";
import RadioDateShortcuts from "../Radio-Date-Shortcuts";
import CreateSheetCalendarCard from "../Create-Sheet-Calendar_Card";
import CreateSheet from "../Create-Sheet";
import CreateCalendar from "../Create-Calendar";
import ResponseDialog from "../Response-Dialog";
import * as actions from "../../actions";
import { scrollToTop } from "../../utils";

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.handleSheetChange = this.handleSheetChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleSetEditClick = this.handleSetEditClick.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
    this.handleRadioDateChange = this.handleRadioDateChange.bind(this);
    this.handleSheetDialogClose = this.handleSheetDialogClose.bind(this);
    this.handleSheetDialogSubmit = this.handleSheetDialogSubmit.bind(this);
    this.handleSheetDialogOpen = this.handleSheetDialogOpen.bind(this);
    this.handleCalendarDialogClose = this.handleCalendarDialogClose.bind(this);
    this.handleCalendarDialogSubmit = this.handleCalendarDialogSubmit.bind(
      this
    );
    this.handleCalendarDialogOpen = this.handleCalendarDialogOpen.bind(this);
    this.handleSheetNameChange = this.handleSheetNameChange.bind(this);
    this.handleCalendarNameChange = this.handleCalendarNameChange.bind(this);
    this.handleResponseDialogClose = this.handleResponseDialogClose.bind(this);
  }

  handleStartDateChange(event, date) {
    this.props.setStartDate(date);
  }
  handleEndDateChange(event, date) {
    this.props.setEndDate(date);
  }
  handleStartTimeChange(event, time) {
    this.props.setStartTime(time);
  }
  handleEndTimeChange(event, time) {
    this.props.setEndTime(time);
  }
  handleCalendarChange(event, key, calendar) {
    this.props.setCalendar(calendar);
    this.props.getCalendarEvents(calendar.id);
  }
  handleSheetChange(event, key, sheet) {
    this.props.setSheet(sheet);
    this.props.getSheetMeta(sheet.id);
  }
  handleNoteChange(event, value) {
    this.props.setNote(value);
  }
  handleSubmit(event) {
    const {
      startDate,
      startTime,
      endDate,
      endTime
    } = this.props.event.createEvent;
    if (
      startDate &&
      startTime &&
      endDate &&
      endTime &&
      this.props.sheet.selectedSheet &&
      this.props.calendar.selectedCalendar
    ) {
      this.props.createEvent(
        this.props.event.createEvent,
        this.props.calendar.selectedCalendar,
        this.props.sheet.selectedSheet
      );
    } else {
      this.props.showFormError();
    }
  }
  handleSetEditClick(event) {
    this.props.editEvent(event);
    scrollToTop();
  }
  handleEditClick(id) {
    this.props.updateEvent(
      id,
      this.props.calendar.selectedCalendar.id,
      this.props.sheet.selectedSheet.id
    );
    scrollToTop();
  }
  handleDeleteClick(id) {
    this.props.deleteEvent(
      id,
      this.props.calendar.selectedCalendar.id,
      this.props.sheet.selectedSheet.id
    );
  }
  handleCancelEdit() {
    this.props.clearForm();
  }
  handleUpdateSubmit() {
    this.props.updateEvent(
      this.props.event.createEvent,
      this.props.calendar.selectedCalendar,
      this.props.sheet.selectedSheet.id
    );
  }
  handleRadioDateChange(event, value) {
    this.props.applyRadioDateShortcut(value);
  }
  handleSheetDialogClose() {
    this.props.sheetDialogClose();
  }
  handleSheetDialogSubmit() {
    this.props.createNewSheet("whendidiwork@" + this.props.sheet.newSheetName);
  }
  handleSheetDialogOpen() {
    this.props.sheetDialogOpen();
  }
  handleSheetNameChange(event, value) {
    this.props.handleSheetNameChange(value);
  }
  handleCalendarDialogClose() {
    this.props.calendarDialogClose();
  }
  handleCalendarDialogSubmit() {
    this.props.createNewCalendar(
      this.props.calendar.newCalendarName,
      this.props.calendar.timeZone
    );
  }
  handleCalendarNameChange(event, value) {
    this.props.handleCalendarNameChange(value);
  }
  handleCalendarDialogOpen() {
    this.props.calendarDialogOpen();
  }
  handleResponseDialogClose() {
    this.props.responseDialogClose();
  }
  render() {
    const paperStyle = this.props.event.isEditing
      ? {
          width: "100%",
          padding: "0 15px",
          backgroundColor: "#E8F5E9",
          marginBottom: "25px"
        }
      : { width: "100%", padding: "0 15px", marginBottom: "25px" };

    return (
      <App>
        <div className="container">
          <TopRow
            user={this.props.auth}
            logout={this.props.unauthUser}
            sheetId={this.props.sheet.selectedSheet && this.props.sheet.selectedSheet.id || ""}
          />
          <hr />
          <div className="row">
            <div className="col-sm-6">
              <CreateSheetCalendarCard
                sheetDialogOpen={this.handleSheetDialogOpen}
                calendarDialogOpen={this.handleCalendarDialogOpen}
              />
              <Paper style={paperStyle} zDepth={1}>
                {this.props.calendar.calendars &&
                  <CalendarSelect
                    calendars={this.props.calendar.calendars}
                    handleCalendarChange={this.handleCalendarChange}
                    value={this.props.calendar.selectedCalendar}
                    error={this.props.event.showFormError}
                  />}
                {this.props.sheet.sheets &&
                  <SheetSelect
                    sheets={this.props.sheet.sheets}
                    handleSheetChange={this.handleSheetChange}
                    value={this.props.sheet.selectedSheet}
                    error={this.props.event.showFormError}
                  />}
                <h3 className="text-center">Start</h3>
                <DatePick
                  text="Start Date"
                  handleChange={this.handleStartDateChange}
                  value={this.props.event.createEvent.startDate}
                  error={this.props.event.showFormError}
                />
                <RadioDateShortcuts
                  handleRadioDateChange={this.handleRadioDateChange}
                  startValue={this.props.event.shortcut}
                />
                <TimePick
                  text="Start Time"
                  handleTimeChange={this.handleStartTimeChange}
                  value={this.props.event.createEvent.startTime}
                  error={this.props.event.showFormError}
                />
                <h3 className="text-center">End</h3>
                <DatePick
                  text="End Date"
                  handleChange={this.handleEndDateChange}
                  value={this.props.event.createEvent.endDate}
                  error={this.props.event.showFormError}
                />
                <TimePick
                  text="End Time"
                  handleTimeChange={this.handleEndTimeChange}
                  value={this.props.event.createEvent.endTime}
                  error={this.props.event.showFormError}
                />
                <Note
                  value={
                    this.props.sheet.selectedSheet &&
                    this.props.sheet.prefix +
                      this.props.event.createEvent.note.substring(
                        this.props.sheet.prefix.length
                      )
                  }
                  handleNoteChange={this.handleNoteChange}
                />
                {this.props.event.isEditing
                  ? <EventEditSubmit
                      handleCancelEdit={this.handleCancelEdit}
                      handleUpdateSubmit={this.handleUpdateSubmit}
                    />
                  : <FormSubmit handleSubmit={this.handleSubmit} />}
              </Paper>
            </div>

            <div className="col-sm-6">
              <SheetTable values={this.props.sheet.sheetValues} />
              {this.props.calendar.events &&
                this.props.calendar.events.map(event =>
                  <EventCard
                    event={event}
                    key={event.id}
                    editId={this.props.event.createEvent.editEventId}
                    handleSetEditClick={this.handleSetEditClick}
                    handleDeleteClick={this.handleDeleteClick}
                  />
                )}
            </div>
          </div>
        </div>
        <CreateSheet
          showSheetDialog={this.props.sheet.showSheetDialog}
          handleSheetDialogSubmit={this.handleSheetDialogSubmit}
          handleSheetDialogClose={this.handleSheetDialogClose}
          handleSheetNameChange={this.handleSheetNameChange}
          nameValue={this.props.sheet.newSheetName}
        />
        <CreateCalendar
          showCalendarDialog={this.props.calendar.showCalendarDialog}
          handleCalendarDialogSubmit={this.handleCalendarDialogSubmit}
          handleCalendarDialogClose={this.handleCalendarDialogClose}
          nameValue={this.props.calendar.newCalendarName}
          handleCalendarNameChange={this.handleCalendarNameChange}
        />
        <ResponseDialog
          handleResponseDialogClose={this.handleResponseDialogClose}
          showResponseDialog={this.props.event.showResponseDialog}
          createdEvent={this.props.event.createdEvent || null}
          error={this.props.event.error}
          message={this.props.event.message}
        />
      </App>
    );
  }
}

Home.propTypes = {
  getCalendarList: PropTypes.func,
  getFiles: PropTypes.func,
  getUser: PropTypes.func,
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  setStartTime: PropTypes.func,
  setEndTime: PropTypes.func,
  setCalendar: PropTypes.func,
  getCalendarEvents: PropTypes.func,
  setSheet: PropTypes.func,
  getSheetMeta: PropTypes.func,
  setNote: PropTypes.func,
  createEvent: PropTypes.func,
  showFormError: PropTypes.func,
  editEvent: PropTypes.func,
  updateEvent: PropTypes.func,
  deleteEvent: PropTypes.func,
  clearForm: PropTypes.func,
  applyRadioDateShortcut: PropTypes.func,
  sheetDialogClose: PropTypes.func,
  createNewSheet: PropTypes.func,
  sheetDialogOpen: PropTypes.func,
  handleSheetNameChange: PropTypes.func,
  calendarDialogClose: PropTypes.func,
  createNewCalendar: PropTypes.func,
  handleCalendarNameChange: PropTypes.func,
  calendarDialogOpen: PropTypes.func,
  responseDialogClose: PropTypes.func,
  auth: PropTypes.object,
  calendar: PropTypes.object,
  sheet: PropTypes.object,
  event: PropTypes.object
};
const mapStateToProps = ({ auth, calendar, sheet, event }) => ({
  auth,
  calendar: calendar,
  sheet: sheet,
  event: event
});

export default connect(mapStateToProps, actions)(Home);
