import React, { useContext, useState } from "react";
import { UserContext } from "App";
import TeacherCard from "Components/TeacherCard";



const ViewMyProfile = () => {
    const { user } = useContext(UserContext);

   return (
   <>
   <TeacherCard  user={user}  />
   </>
  );
};

export default ViewMyProfile;
