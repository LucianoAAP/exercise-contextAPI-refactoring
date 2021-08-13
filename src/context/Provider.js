import React from 'react';
import PropTypes from 'prop-types';
import MyContext from './MyContext';
import { getPostsBySubreddit } from '../services/redditAPI';

class Provider extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSubreddit: 'reactjs',
      postsBySubreddit: {
        frontend: {
          shouldRefreshSubreddit: false,
          isFetching: false,
        },
        reactjs: {
          shouldRefreshSubreddit: false,
          isFetching: false,
        },
      },
    }
    this.selectSubreddit = this.selectSubreddit.bind(this);
    this.refreshSubreddit = this.refreshSubreddit.bind(this);
    this.requestPosts = this.requestPosts.bind(this);
    this.receivePostsSuccess = this.receivePostsSuccess.bind(this)
    this.receivePostsFailure = this.receivePostsFailure.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
    this.shouldFetchPosts = this.shouldFetchPosts.bind(this);
    this.fetchPostsIfNeeded = this.fetchPostsIfNeeded.bind(this);
  }

  selectSubreddit(subreddit) {
    this.setState({ selectedSubreddit: subreddit });
  };
  
  refreshSubreddit(subreddit) {
    this.setState((prevState) => ({ postsBySubreddit: {
      ...prevState.postsBySubreddit,
      [subreddit]: { shouldRefreshSubreddit: true,
        isFetching: prevState.postsBySubreddit[subreddit].isFetching, },
    } }));
  };
  
  requestPosts = (subreddit) => ({
    type: REQUEST_POSTS,
    subreddit,
  });
  
  receivePostsSuccess = (subreddit, json) => ({
    type: RECEIVE_POSTS_SUCCESS,
    posts: json.data.children.map((child) => child.data),
    receivedAt: Date.now(),
    subreddit,
  });
  
  receivePostsFailure = (subreddit, error) => ({
    type: RECEIVE_POSTS_FAILURE,
    error,
    subreddit,
  });
  
  fetchPosts(subreddit) {
    return (dispatch) => {
      dispatch(requestPosts(subreddit));
  
      return getPostsBySubreddit(subreddit).then(
        (posts) => dispatch(receivePostsSuccess(subreddit, posts)),
        (error) => dispatch(receivePostsFailure(subreddit, error.message)),
      );
    };
  }
  
  shouldFetchPosts = (state, subreddit) => {
    const posts = state.postsBySubreddit[subreddit];
  
    if (!posts.items) return true;
    if (posts.isFetching) return false;
    return posts.shouldRefreshSubreddit;
  };
  
  fetchPostsIfNeeded(subreddit) {
    return (dispatch, getState) =>
      shouldFetchPosts(getState(), subreddit) && dispatch(fetchPosts(subreddit));
  }

  render() {
    const { children } = this.props;
    return (
      <MyContext.Provider
        value={ {
          ...this.state,
          selectSubreddit: this.selectSubreddit,
          refreshSubreddit: this.refreshSubreddit,
          requestPosts: this.requestPosts,
          fetchPostsIfNeeded: this.fetchPostsIfNeeded,
        } }
      >
        { children }
      </MyContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
