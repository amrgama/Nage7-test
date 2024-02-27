import { useState, memo } from "react";
import { useParams } from "react-router-dom";

import { Box, Tabs, Tab } from "@mui/material";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BasicInfoTab from "./BasicInfoTab";
import SubscriptionsTab from "./Subscriptions";
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

  const { date, group } = useParams();

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
  return <Box sx={{ width: "100%" }}></Box>;
};

export default ViewDetails;
