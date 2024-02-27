import Box from "@mui/material/Box";

function TabPanel({
  children,
  activeTab,
  value,
  unMountOnHide = false,
  ...other
}) {
  return unMountOnHide && activeTab !== value ? null : (
    <Box
      role="tabpanel"
      hidden={activeTab !== value}
      id={`full-width-tabpanel-${value}`}
      aria-labelledby={`full-width-tab-${value}`}
      display={activeTab === value ? "block" : "none"}
      {...other}
    >
      {children}
    </Box>
  );
}
export default TabPanel;
