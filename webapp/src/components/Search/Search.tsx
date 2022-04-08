/** @jsx jsx */
import { jsx, Box, Flex, Label, Input, Button } from 'theme-ui'
import { useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';

import * as styles from './Search.styles';

type AddressComponent = {
  types: string[];
  long_name: string;
  short_name: string;
};

export interface Venue {
  name: string;
  city: string;
}

interface SearchProps {
  handleVenueSearch: (venue: Venue) => void;
}

const MAPS_API_KEY: string = process.env.MAPS_API_KEY as string;

const Search = ({ handleVenueSearch }: SearchProps) => {
  const [name, setVenueName] = useState('');

  const { ref } = usePlacesWidget({
    apiKey: MAPS_API_KEY,
    onPlaceSelected: (selection: { name: string, address_components: any }) => {
      const { name, address_components } = selection;
      const formattedName = name.split(',')[0];
      const city = address_components.find((comp: AddressComponent) => comp.types.includes('locality'))?.long_name || '';

      handleVenueSearch({
        name: formattedName,
        city,
      });
    },
    options: {
      types: ['establishment'],
      fields: ['name', 'address_components'],
    },
  });

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
          // @ts-ignore
          ref={ref}
          autoComplete="off"
          onChange={event => {
            setVenueName(event.target.value);
          }}
        />
      </Box>

      <Button
        sx={!name || !location ? styles.searchBtnDisabled : styles.searchBtn}
        type="submit"
        disabled={!name || !location}
        onClick={() => handleVenueSearch({name, city: ''})}
      >
        Search
      </Button>
    </Flex>
  )
};

export default Search;