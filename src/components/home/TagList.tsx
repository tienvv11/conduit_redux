import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import * as reduxActions from '../../shared/actions';
import { ARTICLE_REQUEST_DEFAULT_LIMIT } from '../../shared/models';

const TagList = (
  props: PropsFromRedux & { tags: string[]; isLoading: boolean }
) => {
  return (
    <div>
      <p>Popular Tags</p>

      <div className="tag-list">
        {props.tags.map((tag, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            key={index}
            onClick={(event) => {
              event.preventDefault();
              props.getGlobalArticles(
                { tag, limit: ARTICLE_REQUEST_DEFAULT_LIMIT, offset: 0 },
                1,
                false
              );
            }}
            href="#"
            className="tag-pill tag-default">
            {tag}
          </a>
        ))}
      </div>

      {props.isLoading ? <div>Loading tags...</div> : null}
    </div>
  );
};

const mapDispatchToProps = {
  getGlobalArticles: reduxActions.getGlobalArticlesStart,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TagList);
