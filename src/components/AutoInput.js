import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function AutoInput(props) {
  const { data, autocomplete, onChange } = props;
  const handleChange = (e, v) => {
    onChange(v);
  };
  const handleAutoComplete = (e, v) => {
    autocomplete(v);
    if (v === '') onChange(null);
  };

  React.useEffect(() => {
    autocomplete('');
  }, []);
  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        value={props.value}
        id="free-solo-2-demo"
        onChange={handleChange}
        onInputChange={handleAutoComplete}
        options={data}
        disableClearable
        getOptionLabel={(option) => (option ? option.label : '')}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={props.placeholder ?? 'Search input'}
            InputProps={{
              ...params.InputProps,
              type: 'search'
            }}
          />
        )}
      />
    </Stack>
  );
}
