import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Home from './components/routes/Home';
import Login from './components/routes/Login';
import Faq from './components/routes/Faq';
import AuthCallback from './components/routes/Auth-Callback';
import RequireAuth from './components/Require-Auth';

const Routes = props => (
  <Router>
    <div>
      <Route exact path="/" component={RequireAuth(Home)} />
      <Route path="/auth/google/callback/:id?" component={AuthCallback} />
      <Route path="/login" component={Login} />
      <Route path="/faq" component={Faq} />
    </div>
  </Router>
);

export default Routes;
