import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink, RouteChildrenProps } from 'react-router-dom';

import * as reduxActions from '../../shared/actions';
import { RootState } from '../../shared/reducers';
import { apiService } from '../../shared/services';
import {
  ARTICLE_REQUEST_DEFAULT_LIMIT,
  ProfileModel,
} from '../../shared/models';
import ArticlesPreviewListContainer from '../common/ArticlesPreviewListContainer';
import ProfileHeader from './ProfileHeader';

const Profile = (
  props: PropsFromRedux & RouteChildrenProps<{ username: string }>
) => {
  const [selectedProfile, setSelectedProfile] = React.useState(initialProfile);

  /**
   * This holds the username in the URL param before a change in URL
   */
  const refUsername = React.useRef('');

  const { match, location, history, getGlobalArticles, unloadArticles } = props;
  React.useEffect(() => {
    const currentUsername = match?.params.username;

    if (currentUsername) {
      // Only retrieve new profile if the user navigates to a different profile
      if (refUsername.current !== currentUsername) {
        refUsername.current = currentUsername;
        apiService.profile.getProfile(currentUsername).then((responseData) => {
          setSelectedProfile(responseData.profile);
        });
      }

      if (isOnTabFavorite(location.pathname)) {
        getGlobalArticles(
          {
            offset: 0,
            limit: ARTICLE_REQUEST_DEFAULT_LIMIT,
            favorited: currentUsername,
          },
          1,
          false
        );
      } else {
        getGlobalArticles(
          {
            offset: 0,
            limit: ARTICLE_REQUEST_DEFAULT_LIMIT,
            author: currentUsername,
          },
          1,
          false
        );
      }
    } else {
      history.push('/');
    }

    return () => {
      unloadArticles();
    };
  }, [match, location.pathname, history, getGlobalArticles, unloadArticles]);

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <ProfileHeader
                {...props}
                profileInfo={selectedProfile}
                isCurrentUser={
                  selectedProfile.username === props.authState.userInfo.username
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink
                    to={`/profile/@${selectedProfile.username}`}
                    exact
                    className="nav-link"
                    activeClassName="active">
                    My Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/profile/@${selectedProfile.username}/favorites`}
                    exact
                    className="nav-link"
                    activeClassName="active">
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            <ArticlesPreviewListContainer
              {...props}
              articlesPaginated={props.articleState.articlesPaginated}
              isLoading={props.articleState.isLoading}
              filterByAuthor={
                isOnTabFavorite(location.pathname)
                  ? undefined
                  : selectedProfile.username
              }
              filterByFavoritesOfUser={
                isOnTabFavorite(location.pathname)
                  ? selectedProfile.username
                  : undefined
              }
              isGlobal={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const initialProfile: ProfileModel = {
  username: '',
  following: false,
  image: null,
  bio: null,
};

const isOnTabFavorite = (pathName: string) => {
  return pathName.trimEnd().toLowerCase().endsWith('/favorites');
};

const mapStateToProps = (state: RootState) => ({
  authState: state.auth,
  articleState: state.article,
});

const mapDispatchToProps = {
  getCurrentUser: reduxActions.getCurrentUserStart,
  getGlobalArticles: reduxActions.getGlobalArticlesStart,
  unloadArticles: reduxActions.unloadArticles,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Profile);
