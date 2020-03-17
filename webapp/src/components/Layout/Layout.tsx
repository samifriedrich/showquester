import Head from 'next/head'

/** @jsx jsx */
// @ts-ignore
import { jsx } from 'theme-ui'
import { ThemeProvider } from 'theme-ui'
import theme from '../../styles/theme'

import Footer from '../Footer/Footer'

const Layout = (props: any) => (
  <ThemeProvider theme={theme}>
    <Head>
      <title>ShowQuester</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div
      sx={{
        fontFamily: 'body',
      }}
    >
      {props.children}
      <Footer />
    </div>
  </ThemeProvider>
);

export default Layout;