import React from 'react';
import PropTypes from 'prop-types';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Label } from 'react-bootstrap';

import './newspage.css';
import { setError } from '../App/actions';
import saga from './saga';
import reducer from './reducer';
import * as actions from './actions';
import * as Selectors from './selectors';
import messages from './messages';

export class NewsPage extends React.Component {
  componentDidMount = () => this.props.loadNews(this.props.user.uid);

  // TODO Move method to utils
  getNewsDescription = (type, content) => {
    switch (type) {
      case 'COMMENT_ADDED':
        return (
          <span>
            <Link to={`/user/${content.comment.uid}`}>
              {content.comment.author}
            </Link>
            <FormattedMessage {...messages.commented} />
            <Link to={`post/${content.post.uid}/${content.post.date}`}>
              <FormattedMessage {...messages.post} />
            </Link>
          </span>
        );

      case 'SUBSCRIBED':
        return (
          <span>
            <Link to={`/user/${content.uid}`}>
              {content.displayName}
            </Link>
            <FormattedMessage {...messages.subscribed} />
          </span>
        );

      case 'UNSUBSCRIBED':
        return (
          <span>
            <Link to={`/user/${content.uid}`}>
              {content.displayName}
            </Link>
            <FormattedMessage {...messages.unsubscribed} />
          </span>
        );

      case 'POST_ADDED':
        return (
          <span>
            <Link to={`/user/${content.uid}`}>
              {content.author}
            </Link>
            <FormattedMessage {...messages.created} />
            <Link to={`post/${content.uid}/${content.date}`}>
              <FormattedMessage {...messages.post} />
            </Link>
          </span>
        );

      case 'COMMENT_MENTION':
        return (
          <span>
            <Link to={`/user/${content.uid}`}>
              {content.author}
            </Link>
            <FormattedMessage {...messages.mentionedInComment} />
            <Link to={`post/${content.uid}/${content.date}`}>
              <FormattedMessage {...messages.post2} />
            </Link>
          </span>
        );

      case 'POST_MENTION':
        return (
          <span>
            <Link to={`/user/${content.uid}`}>
              {content.author}
            </Link>
            <FormattedMessage {...messages.mentionedInPost} />
            <Link to={`post/${content.uid}/${content.date}`}>
              <FormattedMessage {...messages.post2} />
            </Link>
          </span>
        );

      default:
        return (null);
    }
  };

  convertDate = (date) => new Date(date)
      .toLocaleString('ru-EU', { hour12: false })
      .split(', ')
      .reverse()
      .join(', ');

  render() {
    return (
      <div className={'page-container'}>
        <Label style={{ backgroundColor: '#ee5f5b' }}>
          <FormattedMessage {...messages.news} />
        </Label>
        <div>
          {
          this.props.news.map((news) => (
            <div
              className={'user-info-post'}
              key={news.date}
            >
              {
                <span>
                  {this.getNewsDescription(news.type, news.content)}
                </span>
              }
              <div className={'news-info'}>
                {
                  news.date &&
                  <div className={'post-sub-info'}>
                    <div className={'post-date'}>
                      <Label style={{ backgroundColor: '#ee5f5b' }}>
                        {this.convertDate(news.date)}
                      </Label>
                    </div>
                  </div>
                }
                <button
                  className={'news-info__button'}
                  onClick={() => this.props.toggleRead(news)}
                >
                  <FormattedMessage {...messages.markAsRead} />
                </button>
              </div>
            </div>
          ))
        }
        </div>
        <br />
        <Label style={{ backgroundColor: '#ee5f5b' }}>
          <FormattedMessage {...messages.read} />
        </Label>
        <div className={'read-messages-list'}>
          {
          this.props.readNews.map((news) => (
            <div
              className={'user-info-post'}
              key={news.date}
            >
              {
                <span>
                  {this.getNewsDescription(news.type, news.content)}
                </span>
              }
              <div className={'news-info'}>
                {
                  news.date &&
                  <div className={'post-sub-info'}>
                    <div className={'post-date'}>
                      <Label style={{ backgroundColor: '#ee5f5b' }}>
                        {this.convertDate(news.date)}
                      </Label>
                    </div>
                  </div>
                }
                <button
                  className={'news-info__button'}
                  onClick={() => this.props.toggleRead(news)}
                >
                  <FormattedMessage {...messages.markAsUnread} />
                </button>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    );
  }
}

NewsPage.propTypes = {
  loadNews: PropTypes.func,
  news: PropTypes.array,
  readNews: PropTypes.array,
  user: PropTypes.object,
  toggleRead: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadNews: actions.loadNews,
    toggleRead: actions.toggleRead,
    setError,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  news: Selectors.makeSelectNews(),
  readNews: Selectors.makeSelectReadNews(),
  user: Selectors.makeSelectUser(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'NewsPage', reducer });
const withSaga = injectSaga({ key: 'NewsPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(NewsPage);
