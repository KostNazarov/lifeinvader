export default function convertLinkToEmbed(link, type) {
  switch (type) {
    case 'youtube':
      return link
        .replace(/watch\?v=/, 'embed/')
        .replace(/youtu.be/, 'youtube.com/embed')
        .replace(/&/, '?');

    case 'twitch':
      return link.replace(/clips.twitch.tv\//, 'clips.twitch.tv/embed?autoplay=false&clip=');

    case 'coub':
      return link.replace(/coub.com\/view/, 'coub.com/embed') + '?muted=false&autostart=false&originalSize=false&startWithHD=true'; // eslint-disable-line

    default:
      return link;
  }
}