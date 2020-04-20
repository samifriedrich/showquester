/** @jsx jsx */
import { jsx, ThemeProvider, Flex } from 'theme-ui'
import Head from 'next/head'

import theme from '../../styles/theme'
import Footer from '../Footer/Footer'

const Layout = ({ children }: {children: any}) => (
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
        {children}
      </div>
      <Footer />
    </Flex>
  </ThemeProvider>
);

export default Layout;