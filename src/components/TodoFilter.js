import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const filters = [
  { type: "all", label: "すべて" },
  { type: "inProgress", label: "買うもの" },
  { type: "completed", label: "買い物かご" },
];

function TodoFilter({ selectedFilter, handleFilter }) {
  const classes = useStyles();
  const filterList = filters.map((filter) => {
    return (
      <MenuItem value={filter.type}>{filter.label}</MenuItem>
    );
  });

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">フィルタ</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedFilter}
          onChange={handleFilter}
          className={classes.selectEmpty}
        >
          {filterList}
        </Select>
      </FormControl>
    </div>
  );
}

export default TodoFilter;
