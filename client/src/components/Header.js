import React from "react";
import Navigation from "./Navigation";

const Header = props => {
  return (
    <header className="container-fluid">
      <div className="row">
        <div id="statusbar" />
        <h1><a href="/">whendidiwork</a></h1>
        <p>Track hours on Google Calendar and Sheets</p>
        <Navigation />
      </div>
    </header>
  );
};


export default Header;
