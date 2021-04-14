import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';

import * as reduxActions from '../../shared/actions';
import { RootState } from '../../shared/reducers';
import { apiService } from '../../shared/services';
import { ProfileModel } from '../../shared/models';
import { handleAxiosError } from '../../shared/utils';

const ProfileFollowAuthorButton = (
  props: { initialProfile: ProfileModel } & RouteChildrenProps & PropsFromRedux
) => {
  const [followingState, setFollowingState] = React.useState({
    isFollowing: props.initialProfile.following,
    isSubmitting: false,
  });

  const handleClickFollowingBtn = async () => {
    try {
      if (!apiService.auth.isTokenExist()) {
        apiService.auth.removeJwt();
        props.logout();
        props.history.push('/login');
        return;
      }

      setFollowingState({ ...followingState, isSubmitting: true });

      let updatedProfile: ProfileModel;
      if (followingState.isFollowing) {
        const responseData = await apiService.profile.unFollow(
          props.initialProfile.username
        );
        updatedProfile = responseData.profile;
      } else {
        const responseData = await apiService.profile.postFollow(
          props.initialProfile.username
        );
        updatedProfile = responseData.profile;
      }

      setFollowingState({
        isFollowing: updatedProfile.following,
        isSubmitting: false,
      });
    } catch (error) {
      handleAxiosError(error, (response) => {
        if (response.status === 401) {
          apiService.auth.removeJwt();
          props.history.push('/login');
        }
      });
      setFollowingState({ ...followingState, isSubmitting: false });
    }
  };

  return (
    <button
      onClick={handleClickFollowingBtn}
      className={`btn btn-sm action-btn ${
        followingState.isFollowing ? 'btn-secondary ' : 'btn-outline-secondary '
      }${followingState.isSubmitting ? 'disabled' : ''}`}>
      <i className="ion-plus-round"></i>
      &nbsp; {followingState.isFollowing ? 'Unfollow ' : 'Follow '}
      {props.initialProfile.username}
    </button>
  );
};

const mapStateToProps = (state: RootState) => ({
  authState: state.auth,
});

const mapDispatchToProps = {
  logout: reduxActions.logoutSucceeded,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProfileFollowAuthorButton);
