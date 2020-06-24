import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  static PropTypes = {
    selectedSubreddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props;
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectSubreddit !== this.props.selectedSubreddit) {
      const {dispatch, selectedSubreddit} = this.props;
      dispatch(fetchPostsIfNeeded(selectedSubreddit));
    }
  }

  handleChange = nextSubreddit => {
    this.props.dispatch(selectSubreddit(nextSubreddit));
  }

  handleRefresherClick = e => {
    e.preventDefault();
    const {dispatch, selectedSubreddit} = this.props;
    dispatch(invalidateSubreddit(selectedSubreddit));
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }

  render () {
    const {selectSubreddit, posts, isFetching, lastUpdated} = this.props;
    const isEmpty = post.length === 0;
    return (
      <div>
        <Picker
          value={selectedSubreddit}
          onChange={this.handleChange}
          options={[
            'reactjs', 'frontend'
          ]}
        />
        <p>
          {
          lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString}
              {' '}
            </span>
          }
          {
            !isFetching &&
              <button onClick={this.handleRefreshClick}>
                Refresh
              </button>
          }
        </p>
        {
          isEmpty
            ? (isFetching ? <h2>Loading...</h2> : <h2> Empty </h2>)
            : <div style={{ opacity: isFetching ? 0.5 : 1}}>
                <Posts post={posts} />
              </div>
        }
      </>
    )
  }
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit } = state;
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectSubreddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated,
  }
};

export default connect(mapStateToProps)(App);
