/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'

const InfoPage = ({ children }: {children: any}) => (
  <Flex
    sx={{
      variant: 'flex.center',
      flexDirection: 'column',
      my: ['2', '2', '3'],
      mx: ['3', '5', '7'],
      lineHeight: 'body',
    }}
  >
    <>
      {children}
    </>
  </Flex>
);

export default InfoPage;