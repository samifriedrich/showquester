/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'

import * as styles from './About.styles'
import Layout from '../../components/Layout/Layout'
import HeaderLogo from '../../components/HeaderLogo/HeaderLogo';
import InfoPage from '../../components/InfoPage/InfoPage';

const About = () => (
  <Layout>
    <InfoPage>
      <HeaderLogo />

      <Flex sx={styles.FAQBox}>
        <h2 sx={styles.FAQHeader}>
          What does ShowQuester do?
        </h2>

        <p sx={styles.FAQBody}>
          ShowQuester creates custom playlists in your Spotify account for your favorite venues.
          <br /><br />
          When you create or update a playlist, ShowQuester finds the upcoming shows for that venue, and adds each artist's top songs to the playlist.
        </p>
      </Flex>

      <Flex sx={styles.FAQBox}>
        <h2 sx={styles.FAQHeader}>
          Cool, what does ShowQuester do <em>for me</em>?
        </h2>

        <div sx={styles.FAQBody}>
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

      <Flex sx={styles.FAQBox}>
        <h2 sx={styles.FAQHeader}>
          I'm a venue. Can I use this?
        </h2>

        <p sx={styles.FAQBody}>
          Absolutely! Use ShowQuester to automatically build public Spotify playlists for your upcoming shows.
          <br /><br />
          No more needing to manually build and maintain playlists &mdash; let ShowQuester do it for you!
        </p>
      </Flex>

      <Flex sx={styles.FAQBox}>
        <h2 sx={styles.FAQHeader}>
          This is awesome. How can I get invovled?
        </h2>

        <p sx={styles.FAQBody}>
          Want to help make ShowQuester even cooler? Check out the project's GitHub <a href="https://github.com/samifriedrich/showquester">here</a> and feel free to contribute!
          <br /><br />
          You can also get in touch with us at <a href="mailto:contact@showquester.com">contact@showquester.com</a>.
        </p>
      </Flex>

    </InfoPage>
  </Layout>
);

export default About;
