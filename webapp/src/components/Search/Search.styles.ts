export const searchContainer = {
  flexDirection: ['column', 'column', 'row'],
  width: ['90%', '80%', '100%'],
  justifyContent: 'center',
  alignItems: ['flex-start', 'flex-start', 'flex-end'],
};

export const inputBox = {
  mr: '4',
  mb: ['3', '3', '0'],
};

export const searchBtn = {
  variant: 'buttons.primary',

  '&:hover': {
    variant: 'buttons.primary.hover',
  }
};

export const searchBtnDisabled = {
  variant: 'buttons.disabled',

  '&:hover': {
    variant: 'buttons.disabled',
  }
};
