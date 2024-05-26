import { useContext } from "react";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { API_ENDPOINT } from "AppConstants";
import userAvatar from "Assets/Images/user.png";
import parentAvatar from "Assets/Images/parent.png";
import strings from "Assets/Local/Local";
import styles from "./styles";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Barcode from 'react-jsbarcode';

const UserCart = ({ user }) => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <Box sx={classes.userCard}>
      <Box component="figure">
        <img
          src={user.image ? `${API_ENDPOINT}${user?.image}` : userAvatar}
          alt={`${user?.name} `}
        />
      </Box>
      <Box textAlign={'center'}>
      <Barcode value={user?.barCode} />
      </Box>
      <Box 
      component={'a'}  
      href={`https://api.whatsapp.com/send?phone=2${user?.parentNumber}&text=${strings.welcomeParent}%0Ahttps://nage7-rds.com/nage7-parent/${user?.encrptedCode}`}
      target="_blank"
       bgcolor={'#42E760'} 
       borderRadius={1.5}
        display={'flex'} 
        justifyContent={'space-around'} 
        alignItems={'center'}
         sx={{cursor:'pointer',textDecoration:'none'}}
        
         >
        <WhatsAppIcon sx={{color:'#fff'}}/>
        <Box display={'inline-grid'} textAlign={'center'}>
          <Typography variant="subtitle1" component="span" sx={{color:'#fff'}}>
            {strings.sendUrl}
          </Typography>
          <Typography variant="subtitle2" component="span" sx={{color:'#E05B5B'}}>
            {strings.verifyPhone}
          </Typography>
        </Box>
        <img
          src={parentAvatar}
          alt={`parentAvatar`}
        />
      </Box>
      <Typography>
        <Typography variant="h6" component="span">
          {strings.name}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user?.name ?? ""}
        </Typography>
      </Typography>
      <Typography>
        <Typography variant="h6" component="span">
          {strings.code}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user?.code ?? ""}
        </Typography>
      </Typography>
      <Typography>
        <Typography variant="h6" component="span">
          {strings.mobile}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user?.phone ?? ""}
        </Typography>
      </Typography>
      <Typography>
        <Typography variant="h6" component="span">
          {strings?.parentNumber}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user?.parentNumber ?? ""}
        </Typography>
      </Typography>
      <Typography>
        <Typography variant="h6" component="span">
          {strings.schoolName}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user?.schoolName ?? strings.NotExist}
        </Typography>
      </Typography>
      <Typography>
        <Typography variant="h6" component="span">
          {strings.schoolYear}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user?.level?.name ?? ""}
        </Typography>
      </Typography>

      <Typography>
        <Typography variant="h6" component="span">
          {strings.email}:{" "}
        </Typography>
        <Typography variant="subtitle1" component="span">
          {user?.email ?? strings.NotExist}
        </Typography>
      </Typography>
      {user?.gender ? (
        <Typography>
          <Typography variant="h6" component="span">
            {strings.gender}:{" "}
          </Typography>
          <Typography variant="subtitle1" component="span">
            {user?.gender === "MALE" ? strings.male : strings.female}
          </Typography>
        </Typography>
      ) : null}
      {user?.birthDate ? (
        <Typography>
          <Typography variant="h6" component="span">
            {strings.birthDate}:{" "}
          </Typography>
          <Typography variant="subtitle1" component="span">
            {format(new Date(user?.birthDate), "dd/MM/yyyy")}
          </Typography>
        </Typography>
      ) : null}
    </Box>
  );
};

export default UserCart;
