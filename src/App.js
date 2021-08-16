// src/App.js

import React, { Component } from 'react';
import Posts from './components/Posts';
import Selector from './components/Selector';
import MyContext from './context/MyContext';

class App extends Component {
  componentDidMount() {
    const value = this.context;
    const { selectedSubreddit, fetchPostsIfNeeded } = value;
    fetchPostsIfNeeded(selectedSubreddit);
  }

  selectSubreddit(nextSubreddit) {
    const { selectSubreddit } = this.context;
    selectSubreddit(nextSubreddit);
  }

  handleRefreshClick(event) {
    event.preventDefault();

    const { selectedSubreddit, refreshSubreddit, fetchPostsIfNeeded } = this.props;
    refreshSubreddit(selectedSubreddit);
    fetchPostsIfNeeded(selectedSubreddit);
  }

  renderLastUpdatedAt() {
    const { selectedSubreddit, postsBySubreddit } = this.context;
    const { lastUpdated } = postsBySubreddit[selectedSubreddit];

    return <span>{`Last updated at ${new Date(lastUpdated).toLocaleTimeString()}.`}</span>;
  }

  renderRefreshButton() {
    const { selectedSubreddit, postsBySubreddit } = this.context;
    const { isFetching } = postsBySubreddit[selectedSubreddit];

    return (
      <button
        type="button"
        onClick={(event) => this.handleRefreshClick(event)}
        disabled={isFetching}
      >
        Refresh
      </button>
    );
  }

  render() {
    const { selectedSubreddit, postsBySubreddit } = this.context;
    const availableSubreddits = Object.keys(postsBySubreddit);
    const {
      posts = [],
      isFetching,
      lastUpdated = null,
    } = postsBySubreddit;

    const isEmpty = posts.length === 0;

    return (
      <div>
        <Selector
          value={selectedSubreddit}
          onChange={(nextSubreddit) => this.selectSubreddit(nextSubreddit)}
          options={availableSubreddits}
        />
        <div>
          {lastUpdated && this.renderLastUpdatedAt()}
          {this.renderRefreshButton()}
        </div>
        {isFetching && <h2>Loading...</h2>}
        {!isFetching && isEmpty && <h2>Empty.</h2>}
        {!isFetching && !isEmpty && <Posts posts={posts} />}
      </div>
    );
  }
}

App.contextType = MyContext;

export default App;
