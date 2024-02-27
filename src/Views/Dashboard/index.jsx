import React, { useContext, useState } from "react";
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  Popover,
  Button,
} from "@mui/material";
import strings from "Assets/Local/Local";
import { UserContext } from "App";
import { API_ENDPOINT, routePath } from "AppConstants";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import { Link } from "react-router-dom";
import { postServices } from "Services";
import useQueryService from "Hooks/useQueryService";
import Moment from "react-moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteModal from "Components/Modal/DeleteModal";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPosts, setSelectedRow] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user } = useContext(UserContext);
  const {
    data: postData,
    isLoading: loadingPosts,
    refetch: refetchData,
  } = useQueryService({
    key: ["postServices.getAll", { all: true }],
    fetcher: () => postServices.getAll({ all: true }),
    keepPreviousData: true,
  });
  const posts = postData?.data || [];
  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await postServices.deleteById(selectedPosts);
      toast.success(strings.deleteSuccess);
      refetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
      setOpenModal(false);
      setAnchorEl(null);
    }
  };
  return (
    <Grid container spacing={3}>
      <DeleteModal
        openDeleteModal={openModal}
        deleteTitle={strings.deleteConfirm}
        handleClose={() => setOpenModal(false)}
        handleDelete={handleDeleteRow}
        loading={deleteLoading}
      />
      <Grid item xs={12}>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Box component={Link} to={`${routePath}myProfile`}>
            <img
              src={`${API_ENDPOINT}${user.image}`}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          </Box>
          <Box
            width={"95%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            component={Link}
            to={`${routePath}posts/add`}
          >
            <FormControl fullWidth sx={{ m: 0.5 }}>
              <InputLabel htmlFor="outlined-adornment-amount">
                {strings.inYourMind}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label={strings.inYourMind}
              />
            </FormControl>
            <PermMediaRoundedIcon sx={{ color: "green", fontSize: 25 }} />
          </Box>
        </Box>
      </Grid>
      {posts.map((postEl, index) => {
        return (
          <Grid
            item
            xs={12}
            bgcolor={"#e8e8e852"}
            my={2}
            borderRadius={"15px"}
            margin={1}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"}>
                <img
                  src={`${API_ENDPOINT}${postEl?.user?.image}`}
                  style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                />
                <Box>
                  <Typography variant="h6" mx={2}>
                    {postEl?.user?.name}
                  </Typography>
                  <Box display={"flex"}>
                    <Typography mx={2} fontSize={"12px"} color={"gray"}>
                      <Moment date={postEl?.updatedAt} format="DD-MM-YYYY" />
                      &nbsp; - &nbsp;
                      {postEl?.privacy === "PUBLIC"
                        ? strings.PUBLIC
                        : postEl?.privacy === "MY_STUDENTS"
                        ? strings.MYSTUDENT
                        : postEl?.privacy === "GROUPS" &&
                          postEl?.groups?.length > 0
                        ? strings.specificGroups
                        : strings.allGroups}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Button
                  aria-describedby={index}
                  onClick={(e) => handleClick(e, postEl.id)}
                >
                  <MoreVertIcon sx={{ color: "gray" }} />
                </Button>
                <Popover
                  id={index}
                  open={anchorEl}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Typography
                    component={Link}
                    to={`${routePath}posts/edit/${selectedPosts}`}
                    sx={{
                      pt: 2,
                      px: 2,
                      color: "#036BB9",
                      textDecoration: "none",
                    }}
                  >
                    {strings.edit}
                  </Typography>
                  <Typography
                    sx={{ pb: 2, px: 2, color: "#FF0000", cursor: "pointer" }}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    {strings.delete}
                  </Typography>
                </Popover>
              </Box>
            </Box>

            <Box px={6} py={1}>
              {postEl?.text}
            </Box>
            <Box
              px={6}
              py={1}
              textAlign={"center"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"end"}
            >
              {postEl?.attachments.map((el, index) => {
                return index < 3 ? (
                  <Grid item xs={4}>
                    {el.mimType.startsWith("image") ? (
                      <img
                        src={`${API_ENDPOINT}${el.url}`}
                        alt={index}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    ) : el.mimType.startsWith("video") ? (
                      <video
                        src={`${API_ENDPOINT}${el.url}`}
                        controls
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    ) : null}
                  </Grid>
                ) : null;
              })}
              {postEl?.attachments.length > 3 ? (
                <Box
                  sx={{
                    backgroundColor: "#1f5ca9",
                    color: "white",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "10px",
                    direction: "ltr",
                  }}
                >
                  + {postEl?.attachments.length - 3}
                </Box>
              ) : null}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
