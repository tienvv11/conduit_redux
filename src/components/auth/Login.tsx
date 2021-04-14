import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { AxiosError } from 'axios';

import { apiService } from '../../shared/services';
import { RootState } from '../../shared/reducers';
import * as reduxActions from '../../shared/actions';
import { UserLoginModel, ErrorModel } from '../../shared/models';

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("email can't be blank")
    .email('email is not valid'),
  password: yup.string().required("password can't be blank"),
});

const initialValues: UserLoginModel = {
  email: '',
  password: '',
};

interface LoginState {
  errorsFromApi: string[];
}

class Login extends Component<
  RouteComponentProps & PropsFromRedux,
  LoginState
> {
  constructor(props: RouteComponentProps & PropsFromRedux) {
    super(props);

    this.state = { errorsFromApi: [] };
  }

  componentDidMount() {
    if (apiService.auth.isTokenExist()) {
      this.props.history.push('/');
    }
  }

  clearErrorsFromApi = () => {
    if (this.state.errorsFromApi.length > 0) {
      this.setState({ errorsFromApi: [] });
    }
  };

  render() {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link to="/register">Need an account?</Link>
              </p>
              <Formik
                initialValues={initialValues}
                onSubmit={async (loginDetails, formikHelpers) => {
                  try {
                    const responseData = await apiService.auth.postLogin({
                      user: {
                        email: loginDetails.email,
                        password: loginDetails.password,
                      },
                    });
                    const authenticatedUser = responseData.user;
                    this.props.loginSucceeded(authenticatedUser);
                    apiService.auth.authorizeApp(authenticatedUser.token);

                    this.props.history.push('/');
                  } catch (err) {
                    const error = err as AxiosError<ErrorModel>;

                    const errorsFromApi = new Array<string>();
                    if (error.response) {
                      const resErrorData = error.response.data;
                      Object.entries(resErrorData.errors).forEach(
                        ([field, message]) => {
                          if (field === 'email' || field === 'password') {
                            formikHelpers.setFieldError(
                              field,
                              `${field} ${message[0]}`
                            );
                          } else {
                            errorsFromApi.push(`${field} ${message[0]}`);
                          }
                        }
                      );
                    }

                    this.setState({ errorsFromApi });

                    // const errObject = JSON.parse(err.message);
                    // Object.entries(errObject).forEach(
                    //   ([field, message]: [string, any]) => {
                    //     if (field === 'email' || field === 'password') {
                    //       formikHelpers.setFieldError(field, message[0]);
                    //     } else {
                    //       formikHelpers.setStatus('Invalid email or password');
                    //     }
                    //   }
                    // );
                  }
                }}
                validationSchema={loginFormSchema}>
                {(formikProps) => (
                  <Form>
                    <ul className="error-messages">
                      <ErrorMessage name="email" component="li" />
                      <ErrorMessage name="password" component="li" />
                      {this.state.errorsFromApi.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>

                    <fieldset disabled={formikProps.isSubmitting}>
                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          placeholder="Email"
                          name="email"
                          onBlur={(event) => {
                            formikProps.handleBlur(event);
                            this.clearErrorsFromApi();
                          }}
                          onChange={(event) => {
                            formikProps.handleChange(event);
                            this.clearErrorsFromApi();
                          }}
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          placeholder="Password"
                          name="password"
                          type="password"
                          onBlur={(event) => {
                            formikProps.handleBlur(event);
                            this.clearErrorsFromApi();
                          }}
                          onChange={(event) => {
                            formikProps.handleChange(event);
                            this.clearErrorsFromApi();
                          }}
                        />
                      </fieldset>
                      <button
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                        className="btn btn-lg btn-primary pull-xs-right"
                        type="submit">
                        Sign in
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

export default connector(Login);
