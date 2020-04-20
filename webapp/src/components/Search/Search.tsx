/** @jsx jsx */
import { jsx, Box, Button, Flex, Label, Input } from 'theme-ui'
import { useState } from 'react';

import * as styles from './Search.styles'

export interface Venue {
  name: string;
  location: string;
}

interface SearchProps {
  handleVenueSearch: (arg0: Venue) => void;
}

const Search = ({ handleVenueSearch }: SearchProps) => {

  const [name, setVenueName] = useState('');
  const [location, setLocation] = useState('');

  return (
    <Flex
      as='form'
      onSubmit={e => e.preventDefault()}
      sx={styles.searchContainer}
    >
      <Box sx={styles.inputBox}>
        <Label htmlFor="name">Venue Name</Label>
        <Input
          name="name"
          type="text"
          value={name}
          onChange={event => setVenueName(event.target.value)}
        />
      </Box>

      <Box sx={styles.inputBox}>
        <Label htmlFor="location">Location</Label>
        <Input
          name="location"
          type="text"
          value={location}
          onChange={event => setLocation(event.target.value)}
          />
      </Box>

      <Button
        sx={!name || !location ? styles.searchBtnDisabled : styles.searchBtn}
        type="submit"
        disabled={!name || !location}
        onClick={() => handleVenueSearch({name, location})}
      >
        Search
      </Button>
    </Flex>
  )
};

export default Search;