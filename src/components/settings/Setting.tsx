import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteChildrenProps, Prompt } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { UserSettingModel, ErrorModel } from '../../shared/models';
import { apiService } from '../../shared/services';
import { RootState } from '../../shared/reducers';
import { getCurrentUserStart, logoutSucceeded } from '../../shared/actions';
import { handleAxiosError } from '../../shared/utils';

class Setting extends Component<PropsFromRedux & RouteChildrenProps> {
  componentDidMount() {
    if (!apiService.auth.isTokenExist()) {
      this.logout();
    }
  }

  logout = () => {
    apiService.auth.removeJwt();
    this.props.logout();
    this.props.history.push('/');
  };

  render() {
    const currentUserInfo: UserSettingModel = {
      ...this.props.authState.userInfo,
      password: '',
      image: this.props.authState.userInfo.image ?? '',
      bio: this.props.authState.userInfo.bio ?? '',
    };

    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>
              <Formik
                initialValues={currentUserInfo}
                onSubmit={async (submittedUserSettings, { setErrors }) => {
                  const { userInfo } = this.props.authState;
                  try {
                    await apiService.setting.putSetting({
                      user: submittedUserSettings,
                    });
                    this.props.getCurrentUser();
                    this.props.history.push(`/profile/@${userInfo.username}`);
                  } catch (error) {
                    handleAxiosError(error, (response) => {
                      if (response.status === 401) {
                        this.logout();
                      }
                    });

                    const errors = error.response.data as ErrorModel;
                    if (errors.errors.username) {
                      setErrors({
                        username: 'username ' + errors.errors.username,
                      });
                    }
                  }
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .trim()
                    .required("email can't be blank")
                    .email('email is not valid'),
                  username: Yup.string()
                    .trim()
                    .required("username can't be blank")
                    .max(20, 'username is too long (maximum is 20 characters)'),
                  password: Yup.string()
                    .trim()
                    .required("password can't be blank")
                    .min(8, 'password is too short (minimum is 8 characters)'),
                  image: Yup.string()
                    .nullable()
                    .trim()
                    .url('image must be a valid url'),
                  bio: Yup.string().nullable().trim(),
                })}
                enableReinitialize>
                {(formikProps) => (
                  <Form>
                    <Prompt
                      when={formikProps.dirty && !formikProps.isSubmitting}
                      message="Your content has not been properly saved yet!
                      Are you sure you want to leave this page?"
                    />
                    <ul className="error-messages">
                      <ErrorMessage name="username" component="li" />
                      <ErrorMessage name="email" component="li" />
                      <ErrorMessage name="password" component="li" />
                      <ErrorMessage name="image" component="li" />
                    </ul>
                    <fieldset disabled={formikProps.isSubmitting}>
                      <fieldset className="form-group">
                        <Field
                          name="image"
                          className="form-control"
                          type="text"
                          placeholder="URL of profile picture"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="username"
                          className="form-control form-control-lg"
                          type="text"
                          placeholder="Your Name"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="bio"
                          className="form-control form-control-lg"
                          rows={8}
                          placeholder="Short bio about you"
                          as="textarea"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="email"
                          className="form-control form-control-lg"
                          type="email"
                          placeholder="Email"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="password"
                          className="form-control form-control-lg"
                          type="password"
                          placeholder="New Password"
                        />
                      </fieldset>
                      <button
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                        className="btn btn-lg btn-primary pull-xs-right"
                        type="submit">
                        Update Settings
                      </button>
                    </fieldset>
                  </Form>
                )}
              </Formik>
              <hr />
              <button className="btn btn-outline-danger" onClick={this.logout}>
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  authState: state.auth,
});

const mapDispatchToProps = {
  getCurrentUser: getCurrentUserStart,
  logout: logoutSucceeded,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Setting);
