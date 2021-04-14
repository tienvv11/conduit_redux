import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import * as reduxActions from '../../shared/actions';
import { RootState } from '../../shared/reducers';
import { generateUniqueString } from '../../shared/utils';

const ArticlesPagination = (
  props: PropsFromRedux & {
    query: {
      limit: number;
      tag?: string;
      author?: string;
      favorited?: string;
    };
    total: number;
    isGlobal: boolean;
  }
) => {
  if (props.total <= props.query.limit) {
    return null;
  }

  const pagesCount = Math.ceil(props.total / props.query.limit);

  const getArticlesInPage = (page: number) => {
    if (page === props.pageCurrent) {
      return;
    }

    const offset = (page - 1) * props.query.limit;

    if (props.isGlobal) {
      props.getGlobalArticles(
        {
          ...props.query,
          offset,
        },
        page,
        true
      );
    } else {
      props.getArticlesInFeed({ limit: props.query.limit, offset }, page, true);
    }
  };

  return (
    <nav>
      {buildPageItems(pagesCount, props.pageCurrent, getArticlesInPage)}
    </nav>
  );
};

const buildPageItems = (
  pagesCount: number,
  pageCurrent: number,
  onPaging: (page: number) => void
): React.ReactNode => {
  const pageItems = new Array<React.ReactNode>(
    (
      <li
        key={unique + '_first'}
        className={`page-item ${pageCurrent === 1 ? 'd-none' : ''}`}>
        <button
          onClick={() => {
            onPaging(1);
          }}
          className="page-link">
          &laquo;
        </button>
      </li>
    )
  );

  const pageStart = Math.max(1, pageCurrent - 5);
  const pageEnd = Math.min(pagesCount, pageCurrent + 5);

  for (let page = pageStart; page <= pageEnd; page++) {
    const pageItem = (
      <li
        key={page}
        className={`page-item ${page === pageCurrent ? 'active' : ''}`}>
        <button
          onClick={() => {
            onPaging(page);
          }}
          className="page-link">
          {page}
        </button>
      </li>
    );
    pageItems.push(pageItem);
  }

  return <ul className="pagination">{pageItems}</ul>;
};

const unique = generateUniqueString('paging');

const mapStateToProps = (state: RootState) => ({
  pageCurrent: state.article.pageCurrent,
});

const mapDispatchToProps = {
  getGlobalArticles: reduxActions.getGlobalArticlesStart,
  getArticlesInFeed: reduxActions.getArticlesInFeedStart,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ArticlesPagination);
