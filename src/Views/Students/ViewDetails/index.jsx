import { useState, memo } from "react";
import { useParams } from "react-router-dom";

import { Box, Tabs, Tab } from "@mui/material";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BasicInfoTab from "./BasicInfoTab";
import SubscriptionsTab from "./Subscriptions";
import GroupsTab from "./GroupTab";

import Loading from "Components/Loading";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { userServices } from "Services";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
const MemoTabPanel = memo(TabPanel);

const ViewDetails = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { id } = useParams();

  const {
    data: userData,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQueryService({
    key: ["userServices.getUserInfo", id],
    fetcher: () => userServices.getUserInfo(id),
    enabled: !!id,
  });

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoadingUser) {
    return <Loading />;
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Student tabs"
        >
          <Tab icon={<PersonPinIcon />} label={strings.basicInfo} />
          <Tab icon={<AssignmentIcon />} label={strings.groups} />
        </Tabs>
      </Box>

      <MemoTabPanel value={activeTab} index={0}>
        <BasicInfoTab user={userData?.user} />
      </MemoTabPanel>
      <MemoTabPanel value={activeTab} index={1}>
        <GroupsTab groups={userData?.user?.studentGroups}  />
      </MemoTabPanel>
    </Box>
  );
};

export default ViewDetails;
