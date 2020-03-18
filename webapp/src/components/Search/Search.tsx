/** @jsx jsx */
import { jsx, Box, Button, Flex, Label, Input } from 'theme-ui'
import { useState } from 'react';

import { Venue } from '../../models/venue'

const Search = (props: {handleVenueSearch: (arg0: Venue) => void}) => {

  const [name, setVenueName] = useState('');
  const [location, setLocation] = useState('');

  return (
    <Flex
      as='form'
      onSubmit={e => e.preventDefault()}
      sx={{
        flexDirection: ['column', 'column', 'row'],
        width: ['90%', '80%', '100%'],
        justifyContent: 'center',
        alignItems: ['flex-start', 'flex-start', 'flex-end'],
      }}
    >
      <Box
        sx={{
          mr: '4',
          mb: ['3', '3', '0'],
        }}
      >
        <Label htmlFor="name">Venue Name</Label>
        <Input
          name="name"
          type="text"
          value={name}
          onChange={event => setVenueName(event.target.value)}
        />
      </Box>

      <Box
        sx={{
          mr: '4',
          mb: ['3', '3', '0'],
        }}
      >
        <Label htmlFor="location">Location</Label>
        <Input
          name="location"
          type="text"
          value={location}
          onChange={event => setLocation(event.target.value)}
          />
      </Box>

      <Button
        sx={{
          variant: !name || !location ? 'buttons.disabled' : 'buttons.primary',
          '&:hover': {
            variant: !name || !location ? 'buttons.disabled' : 'buttons.primary.hover',
          }
        }}
        type="submit"
        disabled={!name || !location}
        onClick={() => props.handleVenueSearch({name, location})}
      >
        Search
      </Button>
    </Flex>
  )
};

export default Search;