import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ApplicationsTab from "./ApplicationsTab";

function HeaderTabs() {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const onTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    index: number
  ) => {
    setTabIndex(index);
  };

  const tabContent = () => {
    if (tabIndex === 0) return <ApplicationsTab tabIndex={tabIndex} />;
    else return "TODO";
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            onChange={onTabChange}
            value={tabIndex}
            aria-label="basic tabs example"
          >
            <Tab label="Applications" />

            <Tab label="Resources" />
          </Tabs>
        </Box>
        {tabContent()}
      </Box>
    </>
  );
}

export default HeaderTabs;
