// eslint-disable-next-line import/prefer-default-export
export const get = (req, res) => {
  res.json([
    {
      id: '1',
      publishTimestamp: 1491138263,
      title: 'twitch split',
      permalink: 'twitch-split',
      // featuredImage: 'https://raw.githubusercontent.com/strothj/twitch-split/master/screenshots/twitch-split-0.png',
      featuredImageCaption: 'twitch-split Screenshot',
      content: `
Thinkful ([https://www.thinkful.com](https://www.thinkful.com))
end of unit portfolio project - a multi-stream viewer for the [Twitch.tv](https://twitch.tv) service with sharable links.

![Instant Search](https://raw.githubusercontent.com/strothj/twitch-split/master/screenshots/twitch-split-1.png)
![Split Stream View](https://raw.githubusercontent.com/strothj/twitch-split/master/screenshots/twitch-split-2.png)

## Summary
twitch split makes it easy to experience a match between opponents by offering
an instant search feature and split video view.
Search for your favorite streamer by typing the name of the game being played or
their streamer tag.
Switch between chats using the convenient chat switcher.
When you've found the perfect split view, send the url to friends so they can
share in the experience.

## Live Site
You can access twitch split at [https://strothj.github.io/twitch-split](https://strothj.github.io/twitch-split).

## Technologies Used
* HTML5
* CSS (SASS)
* ES6+ (Babel, Webpack)
* React (Redux)`,
    },
    {
      id: '2',
      publishTimestamp: 1491051863,
      title: 'Aliquip commodo laboris elit',
      permalink: 'aliquip-commodo-laboris-elit',
      featuredImage: 'https://placekitten.com/250/150',
      featuredImageCaption: 'Lorem ipsum dolor.',
      content: `# Sunt Lorem ea do proident adipisicing mollit incididunt exercitation nisi officia in.

Tempor cupidatat eiusmod amet consequat do officia consectetur qui aliquip. Culpa aliquip velit magna officia amet labore. Amet culpa do aute adipisicing cupidatat elit irure.
`,
    },
  ]);
};
