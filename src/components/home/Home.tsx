import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';

import * as reduxActions from '../../shared/actions';
import { RootState } from '../../shared/reducers';
import { ARTICLE_REQUEST_DEFAULT_LIMIT } from '../../shared/models';
import { apiService } from '../../shared/services';
import TagList from './TagList';
import ArticlesPreviewListContainer from '../common/ArticlesPreviewListContainer';

interface HomeComponentState {
  isFeedTabSelected: boolean;
}

//TODO: Handle error while getting tags and articles
class Home extends Component<
  PropsFromRedux & RouteChildrenProps,
  HomeComponentState
> {
  constructor(props: PropsFromRedux & RouteChildrenProps) {
    super(props);

    if (apiService.auth.isTokenExist()) {
      this.state = { isFeedTabSelected: true };
    } else {
      this.state = { isFeedTabSelected: false };
    }
  }

  componentDidMount = () => {
    // Using redux saga
    // Use Dispatch to ask the store to change the global state
    // Dispatch a GET_TAGS_START action to the store
    // The tags are stored in the global store, so any component can get the current tags
    // The component now receives different props
    this.props.getTags();

    if (apiService.auth.isTokenExist()) {
      this.getMyInitialArticlesFeed();
    } else {
      this.getInitialGlobalFeed();
    }
  };

  componentWillUnmount = () => {
    this.props.unloadArticles();
  };

  private handleSelectMyFeedTab = () => {
    this.setState({ isFeedTabSelected: true });
    this.getMyInitialArticlesFeed();
  };

  private getMyInitialArticlesFeed = () => {
    this.props.getArticlesInFeed(
      { offset: 0, limit: ARTICLE_REQUEST_DEFAULT_LIMIT },
      1,
      false
    );
  };

  private handleSelectGlobalFeedTab = () => {
    this.setState({ isFeedTabSelected: false });
    this.getInitialGlobalFeed();
  };

  private getInitialGlobalFeed = () => {
    this.props.getGlobalArticles(
      { offset: 0, limit: ARTICLE_REQUEST_DEFAULT_LIMIT },
      1,
      false
    );
  };

  render = () => {
    return (
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {this.props.authState.userInfo.token && (
                    <li className="nav-item">
                      <button
                        onClick={this.handleSelectMyFeedTab}
                        className={`nav-link ${
                          this.state.isFeedTabSelected &&
                          !this.props.articleState.selectedTag
                            ? 'active'
                            : ''
                        }`}>
                        Your Feed
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button
                      onClick={this.handleSelectGlobalFeedTab}
                      className={`nav-link ${
                        !this.state.isFeedTabSelected &&
                        !this.props.articleState.selectedTag
                          ? 'active'
                          : ''
                      }`}>
                      Global Feed
                    </button>
                  </li>
                  {this.props.articleState.selectedTag && (
                    <li className="nav-item">
                      <button className="nav-link active">
                        #{this.props.articleState.selectedTag}
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              <ArticlesPreviewListContainer
                {...this.props}
                articlesPaginated={this.props.articleState.articlesPaginated}
                isLoading={this.props.articleState.isLoading}
                filterByTag={this.props.articleState.selectedTag}
                isGlobal={
                  !this.state.isFeedTabSelected ||
                  !!this.props.articleState.selectedTag
                }
              />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <TagList
                  tags={this.props.tagState.tags}
                  isLoading={this.props.tagState.isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state: RootState) => ({
  authState: state.auth,
  tagState: state.tag,
  articleState: state.article,
});

const mapDispatchToProps = {
  getTags: reduxActions.getTagsStart,
  getGlobalArticles: reduxActions.getGlobalArticlesStart,
  unloadArticles: reduxActions.unloadArticles,
  getArticlesInFeed: reduxActions.getArticlesInFeedStart,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Home);
