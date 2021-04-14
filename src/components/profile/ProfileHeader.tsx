import React from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';

import { DEFAULT_PROFILE_IMG } from '../../shared/constants/defaults';
import { ProfileModel } from '../../shared/models';
import ProfileFollowAuthorButton from './ProfileFollowAuthorButton';

export default (
  props: {
    profileInfo: ProfileModel;
    isCurrentUser: boolean;
  } & RouteChildrenProps
) => {
  return (
    <>
      <img
        src={props.profileInfo.image ?? DEFAULT_PROFILE_IMG}
        alt={props.profileInfo.username}
        className="user-img"
      />
      <h4>{props.profileInfo.username}</h4>
      <p>{props.profileInfo.bio ?? ''}</p>
      {props.isCurrentUser ? (
        <Link
          to="/settings"
          className="btn btn-sm btn-outline-secondary action-btn">
          <i className="ion-gear-a"></i>
          &nbsp; Edit Profile Settings
        </Link>
      ) : (
        <ProfileFollowAuthorButton
          {...props}
          initialProfile={props.profileInfo}
        />
      )}
    </>
  );
};
