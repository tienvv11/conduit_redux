import React from 'react';

export default (props: { isLoading: boolean }) => {
  return props.isLoading ? (
    <div className="article-preview">Loading articles...</div>
  ) : null;
};
