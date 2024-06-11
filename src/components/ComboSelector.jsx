import { FormControl, MenuItem, Select } from "@mui/material";

export const ComboSelector = (props) => {
  const { items, ...others } = props;

  return (
    <FormControl>
      <Select
        labelId="demo-simple-select-label"
        {...others}
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
