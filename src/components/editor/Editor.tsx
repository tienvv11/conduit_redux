import React, { Component } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';

import * as reduxActions from '../../shared/actions';
import { apiService } from '../../shared/services';
import {
  ArticleRequestModel,
  ArticleModel,
  EditorFormModel,
} from '../../shared/models';
import { RootState } from '../../shared/reducers';
import { handleAxiosError } from '../../shared/utils';
import EditorForm from './EditorForm';

interface EditorState {
  article?: ArticleModel;
}

class Editor extends Component<
  PropsFromRedux & RouteChildrenProps<{ slug: string }>,
  EditorState
> {
  constructor(props: PropsFromRedux & RouteChildrenProps<{ slug: string }>) {
    super(props);
    this.state = {};
  }

  handleSubmitArticle = async (formValues: EditorFormModel) => {
    const submittedArticle: ArticleRequestModel = {
      article: {
        title: formValues.title,
        description: formValues.description,
        body: formValues.body,
        tagList: formValues.tags ? toTagList(formValues.tags) : [],
      },
    };

    const slug = this.props.match?.params.slug;
    if (slug) {
      try {
        const putData = await apiService.editor.putEditor(
          slug,
          submittedArticle
        );
        this.props.history.push(`/article/${putData.article.slug}`);
      } catch (error) {
        handleAxiosError(error, (response) => {
          if (response.status === 401) {
            this.logout();
          }
        });
      }
    } else {
      try {
        const responseData = await apiService.editor.postEditor(
          submittedArticle
        );
        this.props.history.push(`/article/${responseData.article.slug}`);
      } catch (error) {
        handleAxiosError(error, (response) => {
          if (response.status === 401) {
            this.logout();
          }
        });
      }
    }
  };

  logout = () => {
    apiService.auth.removeJwt();
    this.props.logout();
    this.props.history.push('/login');
  };

  componentDidMount = async () => {
    if (!apiService.auth.isTokenExist()) {
      this.logout();
    }

    const slug = this.props.match?.params.slug;
    if (slug) {
      try {
        const responseData = await apiService.article.getArticle(slug);
        this.setState({
          article: responseData.article,
        });
      } catch (error) {
        this.props.history.push('/');
      }
    }
  };

  render() {
    return (
      <div>
        <EditorForm
          initialValues={this.state.article}
          onSubmitForm={this.handleSubmitArticle}
        />
      </div>
    );
  }
}

const toTagList = (tags: string) => {
  const parts = tags.split(',');
  const trimmedTags = parts.map((item) => {
    return item.trim();
  });

  return trimmedTags;
};

const mapStateToProps = (state: RootState) => ({
  authState: state.auth,
});

const mapDispatchToProps = {
  getCurrentUser: reduxActions.getCurrentUserStart,
  logout: reduxActions.logoutSucceeded,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Editor);
