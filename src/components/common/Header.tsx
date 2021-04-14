import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import { RootState } from '../../shared/reducers';

class Header extends Component<PropsFromRedux> {
  render() {
    const { userInfo } = this.props.authState;
    return (
      <nav className="navbar navbar-light">
        <div className="container">
          <Link to="/" className="navbar-brand" href="index.html">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-link">
                Home
              </NavLink>
            </li>
            {userInfo.token ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/editor"
                    activeClassName="active"
                    className="nav-link">
                    <i className="ion-compose"></i>&nbsp;New Post
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/settings"
                    activeClassName="active"
                    className="nav-link">
                    <i className="ion-gear-a"></i>&nbsp;Settings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    activeClassName="active"
                    to={`/profile/@${userInfo.username}`}>
                    {userInfo.image && (
                      <img
                        src={userInfo.image}
                        className="user-pic"
                        alt={userInfo.username}
                      />
                    )}
                    {userInfo.username}
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    activeClassName="active"
                    className="nav-link">
                    Sign in
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    activeClassName="active"
                    className="nav-link">
                    Sign up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  authState: state.auth,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Header);
