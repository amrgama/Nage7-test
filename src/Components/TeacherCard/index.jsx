import { useContext } from "react";
import { format } from "date-fns";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

import { API_ENDPOINT,routePath } from "AppConstants";
import userAvatar from "Assets/Images/user.png";
import strings from "Assets/Local/Local";
import styles from "./styles";
import { Button } from "@mui/material";

const TeacherCart = ({ user }) => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <Box sx={classes.teacherCard}>
      <Box component="figure">
        <img
          src={user.image ? `${API_ENDPOINT}${user.image}` : userAvatar}
          alt={`${user.name} `}
        />
      </Box>
    
     
      <Typography>
        <Typography variant="h6" component="span" color='#036BB9' fontSize={'15px'}>
          {strings.teacherName}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user.name ?? ""}
        </Typography>
      </Typography>
     <Box display={'flex'} justifyContent={'space-between'}>     
       <Typography>
        <Typography variant="h6" component="span" color='#036BB9' fontSize={'15px'}>
          {`${strings.mobile} (1)`}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user.phone ?? ""}
        </Typography>
      </Typography>
      <Typography>
        <Typography variant="h6" component="span" color='#036BB9' fontSize={'15px'}>
          {`${strings.mobile} (2)`}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user.phoneNumber_2 ?? ""}
        </Typography>
      </Typography>
      </Box>


      <Typography>
        <Typography variant="h6" component="span" color='#036BB9'>
          {strings.email}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user.email ?? strings.NotExist}
        </Typography>
      </Typography>
    
      {user.birthDate ? (
        <Typography>
          <Typography variant="h6" component="span" color='#036BB9'>
            {strings.birthDate}:{" "}
          </Typography>
          <Typography variant="subtitle1" component="span">
            {format(new Date(user.birthDate), "dd/MM/yyyy")}
          </Typography>
        </Typography>
      ) : null}
        {user.gender ? (
        <Typography>
          <Typography variant="h6" component="span" color='#036BB9'>
            {strings.gender}:{" "}
          </Typography>
          <Typography variant="subtitle1" component="span">
            {user.gender === "MALE" ? strings.male : strings.female}
          </Typography>
        </Typography>
      ) : null}
     
        <Button mt={3} variant={"contained"} sx={{background:'#1f5ca9',width:'50%',margin:'auto'}} component={Link} to={`${routePath}myProfile/updateInfo`}>
          {strings.editUserInfo}
        </Button>
        <Button variant={"contained"} sx={{background:'#b70d0d',width:'50%',margin:'auto'}} component={Link} to={`${routePath}myProfile/changePassword`}>
          {strings.changePassword}
        </Button>
    </Box>
  );
};

export default TeacherCart;
