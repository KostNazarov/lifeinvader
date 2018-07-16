import React from 'react';
import { Image, Label } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { parsePostText, wasMentioned } from 'utils/parsePostText';
import convertLinksToEmbed from 'utils/convertLinksToEmbed';

import './post.css';
const SYMBOL = {
  LIKE: '♥',
  EDIT: '✎',
  COMMENT: '❞',
};

export class Post extends React.Component {
  state = {
    words: [],
    hidden: false,
    shortened: true,
    canBeShortened: false,
    ref: null,
  };

  componentDidUpdate = () => this.handleCanBeShortened();

  getTagWithWord = (word) => {
    /* TODO Enable hashtag feature again
    if (word.hashtag) {
      return (
        <a
          key={word.key}
          href={`#${word.value}`}
        >{`${word.value} `} </a>
      );
    } else*/ if (word.mention) {
      return (
        <a
          key={word.key}
          href={`/user/${word.value}`}
        >{`${word.value} `} </a>
      );
    } else if (word.image) {
      return (
        <img
          key={word.key}
          className={'post-image'}
          src={word.value}
          alt={`${this.props.post.author} posted`}
        />
      );
    } else if (word.video) {
      const link = convertLinksToEmbed(word.value, word.video);

      return (
        <div
          className={'post-video'}
          key={word.key}
        >
          <iframe
            className={'post-video-iframe'}
            width={'100%'}
            height={'100%'}
            title={word.value}
            src={link}
          >
            {word.value}
          </iframe>
        </div>
      );
    } else if (word.link) {
      return (<a href={word.value}>{word.value}</a>);
    }
    return (`${word.value} `);
  };

  generateWords = () => parsePostText(this.props.post.text);

  toggleHidden = () => this.setState({ hidden: !this.state.hidden });

  toggleShortened = () => this.setState({ shortened: !this.state.shortened });

  handleCanBeShortened = (ref = this.state.ref) => {
    if (!ref) return;

    const node = ReactDOM.findDOMNode(ref); // eslint-disable-line react/no-find-dom-node
    if (!node) return;

    const canBeShortened = node.getBoundingClientRect().height >= 512;
    if (this.state.ref === ref && this.state.canBeShortened === canBeShortened) return;

    this.setState({
      ref,
      canBeShortened,
    });
  };
  render() {
    const post = this.props.post;
    if (post == null || post.date == null) return (null);

    const words = this.generateWords();
    // const mentioned = words.filter((word) => word.mention && word.value.substring(1, word.value.length) === this.props.displayName).length;
    const mentioned = wasMentioned(post.text, this.props.displayName);

    // If it is a private post, and you wasn't mentioned in it - return null
    if (post.private && !mentioned && !this.props.dev && post.author !== this.props.displayName) return (null);

    const postClass =
      'post-content' + // eslint-disable-line
      (this.state.hidden ? ' post-hidden' : '') +
      (this.state.shortened && this.state.canBeShortened ? ' post-shortened' : '') +
      (mentioned ? ' post-mention' : '') +
      (post.private ? ' post-private' : '');

    const date = new Date(this.props.post.date)
      .toLocaleString('ru-EU', { hour12: false })
      .split(', ')
      .reverse()
      .join(' ');

    // TODO Move all symbols to SYMBOLS object
    // TODO Cut on components
    return (
      <div className={'post'}>
        <div className={'post-info'}>
          {
            post.photoURL &&
            <Link
              to={`/user/${post.uid}`}
              className={'post-user-info'}
            >
              <Image
                src={post.photoURL}
                className={'avatar-icon'}
                href={`users/${post.uid}`}
              />
              <div className={'post-name'}>
                <Label style={{ backgroundColor: '#bd362f' }}>{post.author}</Label>
              </div>
            </Link>
          }
          {
            post.date &&
            <div className={'post-sub-info'}>
              <div className={'post-date'}>
                <Label style={{ backgroundColor: '#ee5f5b' }}>
                  {date}
                </Label>
              </div>
            </div>
          }
        </div>
        <br />
        <div
          className={postClass}
          ref={this.handleCanBeShortened}
        >
          {words.map(this.getTagWithWord)}
          {
            post.edited &&
              <span className={'help'}>{SYMBOL.EDIT}</span>
          }
        </div>
        {
          <div className={'post-subinfo'}>
            <div className={'post-left-buttons-container'}>
              {
                !this.props.nonInteractive &&
                <Link to={`/post/${post.uid}/${post.date}`}>
                  <button>
                    {SYMBOL.COMMENT} {post.comments ? Object.keys(post.comments).length : 0}
                  </button>
                </Link>
              }
              <button
                className={'post-float-button'}
                onClick={this.toggleHidden}
              >
                {this.state.hidden ? '>' : '^'}
              </button>
              {
                this.state.canBeShortened &&
                <button
                  className={'post-float-button'}
                  onClick={this.toggleShortened}
                >
                  {this.state.shortened ? '+' : '-'}
                </button>
              }
            </div>
            <div className={'post-left-buttons-container'}>
              {
                this.props.enableButton &&
                <button
                  className={'post-float-button'}
                  onClick={this.props.toggleEdit}
                >
                  {SYMBOL.EDIT}
                </button>
              }
              {
                this.props.enableButton &&
                  <button
                    className={'post-float-button'}
                    onClick={this.props.onDelete}
                  >X
                  </button>
              }
              {
                !this.props.nonInteractive &&
                <button
                  className={'button-like'}
                  onClick={() => this.props.onLike(post)}
                >
                  {SYMBOL.LIKE} {post.likes ? Object.keys(post.likes).length : 0}
                </button>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

Post.propTypes = {
  displayName: PropTypes.string,
  post: PropTypes.object,
  onDelete: PropTypes.func,
  onLike: PropTypes.func,
  enableButton: PropTypes.bool,
  nonInteractive: PropTypes.bool,
  toggleEdit: PropTypes.func,
  dev: PropTypes.bool,
};

export default Post;
