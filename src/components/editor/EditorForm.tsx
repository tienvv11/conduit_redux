import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import { Formik, ErrorMessage, Form, Field } from 'formik';
import * as Yup from 'yup';

import { ArticleModel, EditorFormModel } from '../../shared/models';

interface EditorFormProps {
  initialValues?: ArticleModel;
  onSubmitForm: (formValues: EditorFormModel) => Promise<void>;
}

const editorSchema: Yup.ObjectSchema<EditorFormModel> = Yup.object({
  title: Yup.string().trim().required("title can't be blank"),
  description: Yup.string().trim().required("description can't be blank"),
  body: Yup.string().trim().required("body can't be blank"),
  tags: Yup.string().trim().defined(),
}).defined();

class EditorForm extends Component<EditorFormProps> {
  render() {
    const initialEditor: EditorFormModel = {
      title: this.props.initialValues?.title ?? '',
      description: this.props.initialValues?.description ?? '',
      body: this.props.initialValues?.body ?? '',
      tags: this.props.initialValues?.tagList?.join(', ') ?? '',
    };

    return (
      <Formik
        initialValues={initialEditor}
        onSubmit={this.props.onSubmitForm}
        validationSchema={editorSchema}
        enableReinitialize>
        {(formikProps) => (
          <Form>
            <Prompt
              when={formikProps.dirty && !formikProps.isSubmitting}
              message="Your content has not been properly saved yet! 
              Are you sure you want to leave this page?"
            />
            <div className="editor-page">
              <div className="container page">
                <div className="row">
                  <div className="col-md-10 offset-md-1 col-xs-12">
                    <ul className="error-messages">
                      <ErrorMessage name="title" component="li" />
                      <ErrorMessage name="description" component="li" />
                      <ErrorMessage name="body" component="li" />
                    </ul>

                    <div>
                      <fieldset disabled={formikProps.isSubmitting}>
                        <fieldset className="form-group">
                          <Field
                            name="title"
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Article Title"
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <Field
                            name="description"
                            type="text"
                            className="form-control"
                            placeholder="What's this article about?"
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <Field
                            name="body"
                            className="form-control"
                            as="textarea"
                            rows={8}
                            placeholder="Write your article (in markdown)"></Field>
                        </fieldset>
                        <fieldset className="form-group">
                          <Field
                            name="tags"
                            type="text"
                            className="form-control"
                            placeholder="Enter tags"
                          />
                          <div className="tag-list"></div>
                        </fieldset>
                        <button
                          disabled={
                            !formikProps.isValid || formikProps.isSubmitting
                          }
                          className="btn btn-lg pull-xs-right btn-primary"
                          type="submit">
                          Publish Article
                        </button>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default EditorForm;
