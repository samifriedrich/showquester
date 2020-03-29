/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import Link from 'next/link'

import Layout from '../../components/Layout/Layout'

const About = () => {
  const FAQBox = {
    mb: ['4', '4', '6'],
    flexDirection: ['column', 'column', 'row'],
    justifyContent: 'flex-start',
    alignItems: ['flex-start', 'flex-start', 'center'],
    width: '100%',
  };

  const FAQHeader = {
    fontSize: ['3', '4'],
    m: '0',
    width: '8',
    maxWidth: '8',
    minWidth: '8',
    lineHeight: 'heading',
  };

  const FAQBody = {
    ml: ['0', '0', '4'],
  };

  return (
    <Layout>
      <Flex
        sx={{
          variant: 'flex.center',
          flexDirection: 'column',
          my: ['2', '2', '3'],
          mx: ['3', '5', '7'],
          lineHeight: 'body',
        }}
      >
        <Link href="/">
          <h1
            sx={{
              mb: ['5', '5', '6'],
              fontSize: ['5', '6'],
              lineHeight: 'heading',
              color: 'primary',
              '&:hover': {
                cursor: 'pointer',
                color: 'darken',
              },
            }}
          >
            ShowQuester
          </h1>
        </Link>

        <Flex sx={FAQBox}>
          <h2 sx={FAQHeader}>
            What does ShowQuester do?
          </h2>

          <p sx={FAQBody}>
            ShowQuester creates custom playlists in your Spotify account for your favorite venues.
            <br /><br />
            When you create or update a playlist, ShowQuester finds the upcoming shows for that venue, and adds each artist's top songs to the playlist.
          </p>
        </Flex>

        <Flex sx={FAQBox}>
          <h2 sx={FAQHeader}>
            Cool, what does ShowQuester do <em>for me</em>?
          </h2>

          <div sx={FAQBody}>
            <p>
              Not obvious from the answer above? Alright, well, it let's you
            </p>
            <ul>
              <li>Discover new bands you'll love 😍</li>
              <li>Remember shows you're excited about 💡</li>
              <li>Learn more about a venue and the kind of music they bring in 🎸</li>
              <li>And, most importantly, be the first of your friends to know about upcoming shows so you look super cool 😎</li>
            </ul>
          </div>
        </Flex>

        <Flex sx={FAQBox}>
          <h2 sx={FAQHeader}>
            I'm a venue. Can I use this?
          </h2>

          <p sx={FAQBody}>
            Absolutely! Use ShowQuester to automatically build public Spotify playlists for your upcoming shows.
            <br /><br />
            No more needing to manually build and maintain playlists &mdash; let ShowQuester do it for you!
          </p>
        </Flex>

        <Flex sx={FAQBox}>
          <h2 sx={FAQHeader}>
            This is awesome. How can I get invovled?
          </h2>

          <p sx={FAQBody}>
            Want to help make ShowQuester even cooler? Check out the project's GitHub <a href="https://github.com/samifriedrich/showquester">here</a> and feel free to contribute!
            <br /><br />
            You can also get in touch with us at <a href="mailto:contact@showquester.com">contact@showquester.com</a>.
          </p>
        </Flex>

      </Flex>
    </Layout>
  );
};

export default About;