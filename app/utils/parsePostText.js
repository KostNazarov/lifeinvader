export function parsePostText(text) {
  const words = [];
  if (text) {
    text.split(' ').map((word) => {
      const video = (word.indexOf('youtu') > -1 && 'youtube') ||
        (word.indexOf('twitch') > -1 && 'twitch') ||
        (word.indexOf('coub') > -1 && 'coub');
      const image = /\.jpg/i.test(word) || /\.png/i.test(word) || /\.jpeg/i.test(word) || /\.gif/i.test(word);

      words.push({
        value: word,
        mention: word[0] === '@' && word[1] != null,
        hashtag: word[0] === '#' && word[1] != null,
        link: word.indexOf('http') > -1,
        key: Math.random().toString(36).substring(7),
        video,
        image,
      });
      return true;
    });
  }
  return words;
}

export function isPrivate(text) {
  return text && text.indexOf('!P') > -1;
}

export function wasMentioned(text, displayName) {
  return (
      text.indexOf(`@${displayName}`) > -1 ||
      text.indexOf('@everyone') > -1 ||
      text.indexOf('@все') > -1
  );
}
