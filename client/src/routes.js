import React from 'react';
import {
  Router,
  Route
} from 'react-router-dom';
import history from './History'
import Home from './components/routes/Home';
import Login from './components/routes/Login';
import Faq from './components/routes/Faq';
import AuthCallback from './components/routes/Auth-Callback';

const Routes = props => (
  <Router history={history}>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/auth/google/callback/:id?" component={AuthCallback} />
      <Route path="/login" component={Login} />
      <Route path="/faq" component={Faq} />
    </div>
  </Router>
);

export default Routes;
