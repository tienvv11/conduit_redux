import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';

import { apiService } from './shared/services';
import * as reduxActions from './shared/actions';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ArticleView from './components/articles/ArticleView';
import Profile from './components/profile/Profile';
import Editor from './components/editor/Editor';
import Home from './components/home/Home';
import Setting from './components/settings/Setting';

class App extends Component<PropsFromRedux> {
  constructor(props: PropsFromRedux) {
    super(props);

    const token = apiService.auth.getToken();
    if (token) {
      apiService.auth.authorizeApp(token);
      this.props.getCurrentUser();
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <div>
            <Switch>
              <Route path="/article/:slug" component={ArticleView} />
              <Route
                path={['/editor/:slug', '/editor']}
                render={(props) => <Editor {...props} />}
              />
              <Route
                path={`/profile/@:username`}
                render={(props) => <Profile {...props} />}
              />
              <Route path="/settings" component={Setting} />
              <Route path="/login" render={(props) => <Login {...props} />} />
              <Route
                path="/register"
                render={(props) => <Register {...props} />}
              />
              <Route path="/" render={props => <Home {...props} />} />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = {
  getCurrentUser: reduxActions.getCurrentUserStart,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
