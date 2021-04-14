import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';

import * as reduxActions from '../../shared/actions';
import { RootState } from '../../shared/reducers';
import { apiService } from '../../shared/services';
import { ArticleModel } from '../../shared/models';
import { handleAxiosError } from '../../shared/utils';

const ArticlePreviewFavoriteButton = (
  props: {
    initialArticle: ArticleModel;
  } & PropsFromRedux &
    RouteChildrenProps
) => {
  const [favoriteState, setFavoriteState] = React.useState({
    isFavorited: props.initialArticle.favorited,
    favoritesCount: props.initialArticle.favoritesCount,
    isSubmitting: false,
  });

  const handleClickFavoriteBtn = async () => {
    try {
      if (!apiService.auth.isTokenExist()) {
        apiService.auth.removeJwt();
        props.logout();
        props.history.push('/login');
        return;
      }

      setFavoriteState({ ...favoriteState, isSubmitting: true });

      let updatedArticle: ArticleModel;
      if (favoriteState.isFavorited) {
        const responseData = await apiService.article.unfavoriteArticle(
          props.initialArticle.slug
        );
        updatedArticle = responseData.article;
      } else {
        const responseData = await apiService.article.postFavoriteArticle(
          props.initialArticle.slug
        );
        updatedArticle = responseData.article;
      }

      setFavoriteState({
        isFavorited: updatedArticle.favorited,
        favoritesCount: updatedArticle.favoritesCount,
        isSubmitting: false,
      });
    } catch (error) {
      handleAxiosError(error, (response) => {
        if (response.status === 401) {
          apiService.auth.removeJwt();
          props.history.push('/login');
        }
      });

      setFavoriteState({ ...favoriteState, isSubmitting: false });
    }
  };

  return (
    <button
      onClick={handleClickFavoriteBtn}
      disabled={favoriteState.isSubmitting}
      className={`btn${
        favoriteState.isFavorited ? ' btn-primary' : ' btn-outline-primary'
      } btn-sm pull-xs-right`}>
      <i className="ion-heart"></i> {favoriteState.favoritesCount}
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

export default connector(ArticlePreviewFavoriteButton);
