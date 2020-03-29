import Head from 'next/head'

/** @jsx jsx */
// @ts-ignore
import { jsx } from 'theme-ui'
import { ThemeProvider, Flex } from 'theme-ui'
import theme from '../../styles/theme'

import Footer from '../Footer/Footer'

const Layout = (props: any) => (
  <ThemeProvider theme={theme}>
    <Head>
      <title>ShowQuester</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Flex
      sx={{
        fontFamily: 'body',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
      }}
    >
      <div>
        {props.children}
      </div>
      <Footer />
    </Flex>
  </ThemeProvider>
);

export default Layout;