import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Tabs, Tab } from "@mui/material";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import GroupIcon from "@mui/icons-material/Group";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import Loading from "Components/Loading";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import groupServices from "Services/group";
import { routePath } from "AppConstants";
import ViewGroupStudents from "./Students";
import ViewGroupAttendance from "./Attendance";
import TabPanel from "Components/TabPanel";

const MemoTabPanel = memo(TabPanel);

const ViewDetails = () => {
  const { id, activeTab: activeTabParam } = useParams();
  const navigate = useNavigate();
  const { data: group, isLoading } = useQueryService({
    key: ["groupServices.getById", id],
    fetcher: () => groupServices.getById(id),
    enabled: !!id,
  });

  const handleTabChange = (_, newValue) => {
    navigate(`${routePath}groups/view/${id}/${newValue}`);
  };

  if (isLoading) {
    return <Loading />;
  }
  const activeTab = activeTabParam ?? "";
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="teacher tabs"
        >
          <Tab value={""} icon={<PersonPinIcon />} label={strings.basicInfo} />
          <Tab value="students" icon={<GroupIcon />} label={strings.students} />
          <Tab
            value="attendance"
            icon={<FactCheckOutlinedIcon />}
            label={strings.attendance}
          />
        </Tabs>
      </Box>
      <MemoTabPanel value={""} activeTab={activeTab}>
        Basic Info
      </MemoTabPanel>
      <MemoTabPanel value={"students"} activeTab={activeTab}>
        <ViewGroupStudents group={group} />
      </MemoTabPanel>
      {/* <MemoTabPanel value={"attendance"} activeTab={activeTab}>
        <ViewGroupAttendance group={group} />
      </MemoTabPanel> */}
    </Box>
  );
};

export default ViewDetails;
