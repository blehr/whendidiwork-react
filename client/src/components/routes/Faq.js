import React from "react";
import App from "../App";

const Faq = props => {
  return (
    <App>
      <div className="row text-div">
        <h1>The FAQ's</h1>

        <ul>
          <li>
            <h4>No sheets are showing up in the select sheet drop down!</h4>
          </li>
          <p>
            The app searches your Google Drive for all sheets with
            &ldquo;whendidiwork@&rdquo; in their name. Nothing will show up if
            they have been trashed or if no sheets with this name have been
            created yet.
          </p>
          <li>
            <h4>
              What if I no longer want a particular spreadsheet to show up in
              the drop down?
            </h4>
          </li>
          <p>
            Well, it depends on your reason. If you no longer want the sheet
            even in your Goggle Drive, just delete it. If you on the other hand
            have finished the job or project, or want to start a new sheet for a
            new month or year, etc., just rename the sheet you want to hide from
            the app. As long as the name doesn't contain
            &ldquo;whendidiwork@&rdquo; it won't appear in the list.
          </p>
          <li>
            <h4>Do I have to create a new calendar?</h4>
          </li>
          <p>
            Not if you don't want to. I personally track all of my times on one
            calendar named whendidiwork, and then separate different jobs or
            activities onto their own spreadsheets.
          </p>
          <li>
            <h4>
              Why don't all of the calendar events show up when I select a
              calendar?
            </h4>
          </li>
          <p>
            When a calendar is selected, all currently recorded events from one
            week past, until one week future are displayed.
          </p>
          <li>
            <h4>
              Why do I get a message stating the event can't be edited/deleted?
            </h4>
          </li>
          <p>
            Only events created through the app are able to be edited or
            deleted. Any events created directly on the calendar itself cannot
            be modified through the whendidiwork app.
          </p>
          <li>
            <h4>
              <span>
                I tried it, don't like it, and want to revoke all of the
                permissions I accepted when I first logged in!
              </span>
            </h4>
          </li>
          <p>
            No problem! Just follow this link to{" "}
            <a
              href="https://security.google.com/settings/security/permissions"
              className="primary"
            >
              Google Account Permissions
            </a>, select the whendidiwork application and press revoke.
          </p>
          <li>
            <h4 className="contact-header">
              Questions, Concerns?
              <br />
              <small>Contact me</small>
            </h4>
          </li>
          <div className="contact-info">
            <p className="mail">
              <a
                href="mailto:blehr.mail@gmail.com"
                className="primary"
              >
                blehr.mail@gmail.com
              </a>
            </p>
            <p className="twitter">
              <a
                href="http://twitter.com/intent/tweet?screen_name=brandonlehr"
                className="primary"
              >
                @brandonlehr
              </a>
            </p>
          </div>
        </ul>
      </div>
    </App>
  );
};

Faq.propTypes = {};

export default Faq;
