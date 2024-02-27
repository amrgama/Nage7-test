import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Tabs, Tab } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import strings from "Assets/Local/Local";
import { routePath } from "AppConstants";
import TabPanel from "Components/TabPanel";
import ViewStudents from "./ViewStudents";
import ViewGroups from "./ViewGroups";

const MemoTabPanel = memo(TabPanel);

const ViewCards = () => {
  const { tab: activeTabParam, type } = useParams();
  const navigate = useNavigate();
  const handleTabChange = (_, newValue) => {
    navigate(`${routePath}cards/${type}/${newValue}`);
  };

  const activeTab = activeTabParam ?? "";
  console.log("active tab", activeTabParam, activeTab);
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="teacher tabs"
        >
          <Tab value="" icon={<GroupIcon />} label={strings.students} />
          <Tab
            value="groups"
            icon={<FactCheckOutlinedIcon />}
            label={strings.groups}
          />
        </Tabs>
      </Box>
      <Box style={{ paddingTop: "1rem" }}>
        <MemoTabPanel unMountOnHide value={""} activeTab={activeTab}>
          <ViewStudents />
        </MemoTabPanel>
        <MemoTabPanel unMountOnHide value={"groups"} activeTab={activeTab}>
          <ViewGroups />
        </MemoTabPanel>
      </Box>
    </Box>
  );
};

export default ViewCards;
