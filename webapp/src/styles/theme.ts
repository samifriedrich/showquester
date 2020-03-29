export default {
  breakpoints: [
    '450px', '700px', '1000px', '1400px',
  ],
  space: [
    0,
    4,
    8,
    16,
    24,
    32,
    64,
    128,
    256,
    512
  ],
  sizes: [
    0,
    4,
    8,
    16,
    32,
    36,
    64,
    128,
    256,
    512
  ],
  fonts: {
    body: 'Josefin Sans, system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', sans-serif',
    heading: 'Josefin Sans, system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', sans-serif',
    monospace: 'Menlo, monospace'
  },
  fontSizes: [
    12,
    14,
    16,
    20,
    24,
    32,
    48,
    64,
    96
  ],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25
  },
  colors: {
    text: '#454f5b',
    background: '#fff',
    primary: '#5c6ac4',
    secondary: '#006fbb',
    highlight: '#47c1bf',
    muted: '#e6e6e6',
    gray: '#dfe3e8',
    accent: '#f49342',
    darken: '#4454bb',
    modes: {
      dark: {
        text: '#3e4155',
        background: '#000639',
        primary: '#9c6ade',
        secondary: '#b4e1fa',
        highlight: '#b7ecec',
        muted: '#e6e6e6'
      }
    }
  },
  buttons: {
    primary: {
      color: 'white',
      bg: 'primary',
      height: '5',
      fontWeight: 'bold',
      hover: {
        color: 'white',
        bg: 'darken',
        height: '5',
        fontWeight: 'bold',
        cursor: 'pointer',
      },
      outline: {
        color: 'primary',
        bg: 'white',
        height: '5',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'primary',
        hover: {
          color: 'darken',
          bg: 'white',
          height: '5',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'darken',
          cursor: 'pointer',
        },
      },
    },
    secondary: {
      color: 'text',
      bg: 'secondary',
      height: '5',
      fontWeight: 'bold',
    },
    disabled: {
      color: 'background',
      bg: 'gray',
      height: '5',
      fontWeight: 'bold',
    },
  },
  borders: {
    primary: {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'primary',
      borderRadius: '5px',
    },
    muted: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'muted',
      borderRadius: '5px',
    },
  },
  forms: {
    label: {
      fontSize: 1,
      fontWeight: 'bold',
    },
    input: {
      borderColor: 'gray',
      width: ['90vw', '80vw', 225, 300],

      '&:focus': {
        borderColor: 'primary',
        boxShadow: (t: any) => `0 0 0 2px ${t.colors.primary}`,
        outline: 'none',
      },
    },
  },
  flex: {
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    }
  }
}
