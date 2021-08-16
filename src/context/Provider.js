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

  componentDidUpdate(_prevProps, prevState) {
    const { state } = this;

    if (prevState.selectedSubreddit !== state.selectedSubreddit) {
      const { selectedSubreddit } = state;
      this.fetchPostsIfNeeded(selectedSubreddit);
    }
  }

  selectSubreddit(subreddit) {
    this.setState({ selectedSubreddit: subreddit });
  };
  
  refreshSubreddit(subreddit) {
    const { postsBySubreddit } = this.state;
    const newState = {
      ...postsBySubreddit,
      [subreddit]: { ...postsBySubreddit[subreddit], shouldRefreshSubreddit: true }
    };
    this.setState({ postsBySubreddit: newState});
  };
  
  requestPosts(subreddit) {
    const { postsBySubreddit } = this.state;
    const newState = {
      ...postsBySubreddit,
      [subreddit]: { ...postsBySubreddit[subreddit], shouldRefreshSubreddit: true, isFetching: false }
    };
    this.setState({ postsBySubreddit: newState});
  };
  
  receivePostsSuccess(subreddit, json) {
    posts = json.data.children.map((child) => child.data),
    receivedAt = Date.now();
    const { postsBySubreddit } = this.state;
    const newState = {
      ...postsBySubreddit,
      [subreddit]: {
        ...postsBySubreddit[subreddit],
        shouldRefreshSubreddit: false,
        isFetching: false,
        items: posts,
        lastUpdated: receivedAt,
      }
    };
    this.setState({ postsBySubreddit: newState});
  };
  
  receivePostsFailure(subreddit, error) {
    const { postsBySubreddit } = this.state;
    const newState = {
      ...postsBySubreddit,
      [subreddit]: {
        ...postsBySubreddit[subreddit],
        shouldRefreshSubreddit: false,
        isFetching: false,
        items: [],
        error,
      }
    };
    this.setState({ postsBySubreddit: newState});
  };
  
  fetchPosts(subreddit) {
    return () => {
      requestPosts(subreddit);
  
      return getPostsBySubreddit(subreddit).then(
        (posts) => receivePostsSuccess(subreddit, posts),
        (error) => receivePostsFailure(subreddit, error.message),
      );
    };
  }
  
  shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit];
  
    if (!posts.items) return true;
    if (posts.isFetching) return false;
    return posts.shouldRefreshSubreddit;
  };
  
  fetchPostsIfNeeded(subreddit) {
    state = this.state;
    return (state) =>
      shouldFetchPosts(state, subreddit) && fetchPosts(subreddit);
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
