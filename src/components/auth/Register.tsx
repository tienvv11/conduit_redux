import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { AxiosError } from 'axios';

import * as reduxActions from '../../shared/actions';
import { RootState } from '../../shared/reducers';
import { apiService } from '../../shared/services';
import { UserRegisterModel, ErrorModel } from '../../shared/models';

const RegisterFormSchema = yup
  .object()
  .shape({
    username: yup
      .string()
      .trim()
      .required("username can't be blank")
      .max(20, 'username is too long (maximum is 20 characters)'),
    email: yup
      .string()
      .trim()
      .required("email can't be blank")
      .email('email is not valid'),
    password: yup
      .string()
      .required("password can't be blank")
      .min(8, 'password is too short (minimum is 8 characters)'),
  })
  .defined();

const initialValues: UserRegisterModel = {
  username: '',
  email: '',
  password: '',
};

class Register extends Component<RouteComponentProps & PropsFromRedux> {
  componentDidMount() {
    if (apiService.auth.isTokenExist()) {
      this.props.history.push('/');
    }
  }
  
  render() {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center mb-4">
                <Link to="/login">Have an account?</Link>
              </p>
              <Formik
                initialValues={initialValues}
                onSubmit={async (values, formikHelpers) => {
                  try {
                    const responseData = await apiService.auth.postRegister({
                      user: {
                        username: values.username,
                        email: values.email,
                        password: values.password,
                      },
                    });
                    const user = responseData.user;
                    this.props.loginSucceeded(user);
                    apiService.auth.authorizeApp(user.token);

                    this.props.history.push('/');
                  } catch (err) {
                    const error = err as AxiosError<ErrorModel>;

                    if (error.response) {
                      const resErrorData = error.response.data;
                      Object.entries(resErrorData.errors).forEach(
                        ([field, message]) => {
                          formikHelpers.setFieldError(
                            field,
                            `${field} ${message[0]}`
                          );
                        }
                      );
                    }

                    // const errorsObj = JSON.parse(err.message);
                    // Object.entries(errorsObj).forEach(
                    //   ([field, message]: [string, any]) => {
                    //     setFieldError(field, `${field} ${message[0]}`);
                    //   }
                    // );
                  }
                }}
                validationSchema={RegisterFormSchema}>
                {(formikProps) => (
                  <Form>
                    <ul className="error-messages">
                      <ErrorMessage name="username" component="li" />
                      <ErrorMessage name="email" component="li" />
                      <ErrorMessage name="password" component="li" />
                      {formikProps.status ? (
                        <li>{formikProps.status}</li>
                      ) : null}
                    </ul>
                    <fieldset disabled={formikProps.isSubmitting}>
                      <fieldset className="form-group">
                        <Field
                          className="form-control form-control-lg"
                          placeholder="Your Name"
                          name="username"
                        />
                      </fieldset>

                      <fieldset className="form-group">
                        <Field
                          className="form-control form-control-lg"
                          placeholder="Email"
                          name="email"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          className="form-control form-control-lg"
                          type="password"
                          placeholder="Password"
                          name="password"
                        />
                      </fieldset>

                      <button
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                        className="btn btn-lg btn-primary pull-xs-right"
                        type="submit">
                        Sign up
                      </button>
                    </fieldset>
                  </Form>
                )}
              </Formik>
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
  loginSucceeded: reduxActions.loginSucceeded,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Register);
