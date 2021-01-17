import AllInboxIcon from "@material-ui/icons/AllInbox";
import InboxIcon from "@material-ui/icons/Inbox";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";

function TodoFilter({ selectedFilter, handleFilter }) {
  return (
    <ToggleButtonGroup
      value={selectedFilter}
      exclusive
      onChange={handleFilter}
      aria-label="text alignment"
    >
      <ToggleButton value="all" aria-label="all">
        <AllInboxIcon />
      </ToggleButton>
      <ToggleButton value="inProgress" aria-label="inProgress">
        <InboxIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default TodoFilter;
