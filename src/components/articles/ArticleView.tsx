import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, RouteChildrenProps, Prompt } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import ReactMarkdown from 'react-markdown';

import * as reduxActions from '../../shared/actions';
import { RootState } from '../../shared/reducers';
import { apiService } from '../../shared/services';
import {
  ArticleModel,
  ProfileModel,
  CommentsModel,
  PostCommentModel,
} from '../../shared/models';
import { DEFAULT_PROFILE_IMG } from '../../shared/constants/defaults';
import { formatDate } from '../../shared/utils';

type ArticleViewState = {
  article: ArticleModel;
  profile: ProfileModel;
  isFavoriteButtonSubmitting: boolean;
  isFollowingButtonSubmitting: boolean;
  comment: CommentsModel;
};

class ArticleView extends Component<
  PropsFromRedux & RouteChildrenProps<{ slug: string; username: string }>,
  ArticleViewState
> {
  constructor(
    props: PropsFromRedux &
      RouteChildrenProps<{ slug: string; username: string }>
  ) {
    super(props);
    this.state = {
      article: {
        body: '',
        createdAt: '',
        description: '',
        slug: '',
        tagList: [],
        title: '',
        favorited: false,
        favoritesCount: 0,
        updatedAt: '',
        author: {
          username: '',
          bio: null,
          following: false,
          image: DEFAULT_PROFILE_IMG,
        },
      },
      profile: {
        username: '',
        bio: null,
        following: false,
        image: DEFAULT_PROFILE_IMG,
      },
      comment: { comments: [] },
      isFavoriteButtonSubmitting: false,
      isFollowingButtonSubmitting: false,
    };
  }

  componentDidMount = async () => {
    const slug = this.props.match?.params.slug;
    if (slug) {
      const [articleData, commentData] = await Promise.all([
        apiService.article.getArticle(slug),
        apiService.article.getComments(slug),
      ]);
      const profileData = await apiService.profile.getProfile(
        articleData.article.author.username
      );

      this.setState({
        article: articleData.article,
        comment: commentData,
        profile: profileData.profile,
      });
    } else {
      this.props.history.push('/');
    }
  };

  handleDeleteArticle = async () => {
    const slug = this.props.match?.params.slug;
    if (slug) {
      await apiService.article.deleteArticle(slug);
      this.props.history.push('/');
    }
  };

  handleDeleteComment = async (id: string) => {
    const slug = this.props.match?.params.slug;
    if (slug) {
      await apiService.article.deleteComment(slug, id);
      const commentData = await apiService.article.getComments(slug);
      this.setState({ comment: commentData });
    }
  };

  handleClickFavoriteBtn = async () => {
    if (!apiService.auth.isTokenExist()) {
      this.logout();
    }

    this.setState({ isFavoriteButtonSubmitting: true });

    try {
      let updatedArticle: ArticleModel;
      if (this.state.article.favorited) {
        const responseData = await apiService.article.unfavoriteArticle(
          this.state.article.slug
        );
        updatedArticle = responseData.article;
      } else {
        const responseData = await apiService.article.postFavoriteArticle(
          this.state.article.slug
        );
        updatedArticle = responseData.article;
      }

      this.setState({
        article: updatedArticle,
        isFavoriteButtonSubmitting: false,
      });
    } catch (error) {
      this.setState({ ...this.state, isFavoriteButtonSubmitting: false });
    }
  };

  handleClickFollow = async () => {
    if (!apiService.auth.isTokenExist()) {
      this.logout();
    }

    this.setState({ isFollowingButtonSubmitting: true });

    try {
      let updatedProfile: ProfileModel;
      if (this.state.profile.following) {
        const responseData = await apiService.profile.unFollow(
          this.state.article.author.username
        );
        updatedProfile = responseData.profile;
      } else {
        const responseData = await apiService.profile.postFollow(
          this.state.article.author.username
        );
        updatedProfile = responseData.profile;
      }

      this.setState({
        profile: updatedProfile,
        isFollowingButtonSubmitting: false,
      });
    } catch (error) {
      this.setState({ ...this.state, isFollowingButtonSubmitting: false });
    }
  };

  logout = () => {
    apiService.auth.removeJwt();
    this.props.logout();
    this.props.history.push('/login');
  };

  render() {
    const { userInfo } = this.props.authState;
    const canModify =
      userInfo && userInfo.username === this.state.article.author.username;
    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{this.state.article.title}</h1>
            <div className="article-meta">
              <Link to="/">
                <img
                  src={this.state.article.author.image ?? DEFAULT_PROFILE_IMG}
                  alt={this.state.article.author.username}
                />
              </Link>
              <div className="info">
                <Link to="/" className="author">
                  {this.state.article.author.username}
                </Link>
                <span className="date">
                  {formatDate(this.state.article.createdAt)}
                </span>
              </div>

              {canModify ? (
                <span>
                  <Link
                    to={`/editor/${this.state.article.slug}`}
                    className="btn btn-outline-secondary btn-sm">
                    <i className="ion-edit"></i> Edit Article
                  </Link>
                  &nbsp;
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={this.handleDeleteArticle}>
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </span>
              ) : (
                <>
                  <button
                    disabled={this.state.isFollowingButtonSubmitting}
                    className={`btn btn-sm${
                      this.state.profile.following
                        ? ' btn-secondary'
                        : ' btn-outline-secondary'
                    }`}
                    onClick={this.handleClickFollow}>
                    <i className="ion-plus-round"></i>
                    <span className="counter">
                      {!this.state.profile.following
                        ? ` Follow ${this.state.article.author.username}`
                        : ` Unfollow ${this.state.article.author.username}`}
                    </span>
                  </button>
                  &nbsp;
                  <button
                    disabled={this.state.isFavoriteButtonSubmitting}
                    onClick={this.handleClickFavoriteBtn}
                    className={`btn btn-sm${
                      this.state.article.favorited
                        ? ' btn-primary'
                        : ' btn-outline-primary'
                    }`}>
                    <i className="ion-heart"></i>
                    <span className="counter">
                      {!this.state.article.favorited
                        ? ` Favorite Post (${this.state.article.favoritesCount})`
                        : ` UnFavorite Post (${this.state.article.favoritesCount})`}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <div>
                <ReactMarkdown source={this.state.article.body} />
              </div>

              <ul className="tag-list">
                {this.state.article.tagList.map((tag, index) => (
                  <li key={index} className="tag-default tag-pill tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <Link to="/">
                <img
                  src={this.state.article.author.image ?? DEFAULT_PROFILE_IMG}
                  alt={this.state.article.author.username}
                />
              </Link>
              <div className="info">
                <Link to="/" className="author">
                  {this.state.article.author.username}
                </Link>
                <span className="date">
                  {formatDate(this.state.article.createdAt)}
                </span>
              </div>
              {canModify ? (
                <span>
                  <Link
                    to={`/editor/${this.state.article.slug}`}
                    className="btn btn-outline-secondary btn-sm">
                    <i className="ion-edit"></i> Edit Article
                  </Link>
                  &nbsp;
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={this.handleDeleteArticle}>
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </span>
              ) : (
                <>
                  <button
                    disabled={this.state.isFollowingButtonSubmitting}
                    className={`btn btn-sm${
                      this.state.profile.following
                        ? ' btn-secondary'
                        : ' btn-outline-secondary'
                    }`}
                    onClick={this.handleClickFollow}>
                    <i className="ion-plus-round"></i>
                    <span className="counter">
                      {!this.state.profile.following
                        ? ` Follow ${this.state.article.author.username}`
                        : ` Unfollow ${this.state.article.author.username}`}
                    </span>
                  </button>
                  &nbsp;
                  <button
                    disabled={this.state.isFavoriteButtonSubmitting}
                    className={`btn btn-sm${
                      this.state.article.favorited
                        ? ' btn-primary'
                        : ' btn-outline-primary'
                    }`}
                    onClick={this.handleClickFavoriteBtn}>
                    <i className="ion-heart"></i>
                    <span className="counter">
                      {!this.state.article.favorited
                        ? ` Favorite Post (${this.state.article.favoritesCount})`
                        : ` UnFavorite Post (${this.state.article.favoritesCount})`}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              {userInfo.token ? (
                <Formik
                  initialValues={{ comment: { body: '' } }}
                  onSubmit={async (values: PostCommentModel, { resetForm }) => {
                    const slug = this.props.match?.params.slug;
                    if (slug) {
                      await apiService.article.postComment(slug, values);
                      const commentData = await apiService.article.getComments(
                        slug
                      );
                      this.setState({ comment: commentData });
                      resetForm({ values: { comment: { body: '' } } });
                    }
                  }}>
                  {(formikProps) => (
                    <Form className="card comment-form">
                      <Prompt
                        when={formikProps.dirty && !formikProps.isSubmitting}
                        message="Your content has not been properly saved yet! 
                                  Are you sure you want to leave this page?"
                      />
                      <div className="card-block">
                        <Field
                          name="comment.body"
                          as="textarea"
                          className="form-control"
                          placeholder="Write a comment..."
                          rows={3}
                        />
                      </div>
                      <div className="card-footer">
                        <img
                          src={userInfo.image ?? DEFAULT_PROFILE_IMG}
                          className="comment-author-img"
                          alt={userInfo.username}
                        />
                        <button
                          disabled={formikProps.isSubmitting}
                          className="btn btn-sm btn-primary"
                          type="submit">
                          Post Comment
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <>
                  <p>
                    <Link to="/login">Sign in</Link> or{' '}
                    <Link to="/register">sign up</Link> to add comments on this
                    article.
                  </p>
                </>
              )}

              {this.state.comment.comments.map((comment) => (
                <div className="card" key={comment.id}>
                  <div className="card-block">
                    <p className="card-text">{comment.body}</p>
                  </div>
                  <div className="card-footer">
                    <Link
                      to={`/profile/@${comment.author.username}`}
                      className="comment-author">
                      <img
                        src={comment.author.image ?? DEFAULT_PROFILE_IMG}
                        className="comment-author-img"
                        alt={comment.author.username}
                      />
                    </Link>
                    &nbsp;
                    <Link
                      to={`/profile/@${comment.author.username}`}
                      className="comment-author">
                      {comment.author.username}
                    </Link>
                    <span className="date-posted">
                      {formatDate(comment.createdAt)}
                    </span>
                    {userInfo.username === comment.author.username && (
                      <span className="mod-options">
                        <i
                          className="ion-trash-a"
                          onClick={() =>
                            this.handleDeleteComment(comment.id)
                          }></i>
                      </span>
                    )}
                  </div>
                </div>
              ))}
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
  getCurrentUser: reduxActions.getCurrentUserStart,
  logout: reduxActions.logoutSucceeded,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ArticleView);
