import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import CastForEducationOutlinedIcon from "@mui/icons-material/CastForEducationOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { routePath } from "AppConstants";

const routes = [
  {
    name: { ar: "الصفحة الرئيسية", en: "Dashboard" },
    path: `${routePath}dashboard`,
    Icon: <HomeIcon />,
  },
  {
    name: { ar: "حسابي", en: "Profile" },
    path: `${routePath}myProfile`,
    Icon: <PermIdentityIcon />,
  },
  {
    name: { ar: "الطلاب", en: "Students" },
    path: `${routePath}students`,
    Icon: <GroupIcon />,
  },
  {
    name: { ar: "المساعدين", en: "Assistants" },
    path: `${routePath}assistants`,
    Icon: <AdminPanelSettingsOutlinedIcon />,
  },
  {
    name: { ar: "المجموعات", en: "Groups" },
    path: `${routePath}groups`,
    Icon: <Diversity2OutlinedIcon />,
  },
  {
    name: { ar: "طلبات الطلبه", en: "Student Request" },
    Icon: <CastForEducationOutlinedIcon />,
    childs: [
      {
        name: { ar: "الطلبات", en: "Request" },
        path: `${routePath}student-requests`,
      },
      {
        name: { ar: "الطلبات المقبولة", en: "Accepted Request" },
        path: `${routePath}student-accepted-requests`,
      },
    ],
  },
  {
    name: { ar: "الكروت", en: "Cards" },
    Icon: <BadgeOutlinedIcon />,
    childs: [
      {
        name: { ar: "Barcode", en: "Barcode" },
        path: `${routePath}cards/Barcode`,
      },
      {
        name: { ar: "Default", en: "Default" },
        path: `${routePath}cards/Default`,
      },
      {
        name: { ar: "Vip 1", en: "Vip 1" },
        path: `${routePath}cards/Vip1`,
      },
      {
        name: { ar: "Vip 2", en: "Vip 2" },
        path: `${routePath}cards/Vip2`,
      },
      {
        name: { ar: "Gold", en: "Gold" },
        path: `${routePath}cards/Gold`,
      },
      {
        name: { ar: "Diamond", en: "Diamond" },
        path: `${routePath}cards/Diamond`,
      },
    ],
  },
  {
    name: { ar: "الحضور", en: "Attendance" },
    path: `${routePath}attendances`,
    Icon: <FactCheckOutlinedIcon />,
  },

  {
    name: { ar: "بنك الاسئلة", en: "Question Bank" },
    path: `${routePath}bank-Question`,
    Icon: <AccountBalanceIcon />,
  },
  {
    name: { ar: " نماذج الإمتحانات", en: "Exam Modules" },
    path: `${routePath}exam-modules`,
    Icon: <ArticleIcon />,
  },
  {
    name: { ar: "الإمتحانات و الواجبات", en: "Exams & HW" },
    path: `${routePath}exams`,
    Icon: <ContactSupportOutlinedIcon />,
  },
  {
    name: { ar: "الامتحانات الخارجية", en: "Offline Exams" },
    path: `${routePath}offline-exams`,
    Icon: <ContactSupportOutlinedIcon />,
  },
  {
    name: { ar: "متجري", en: "My Store" },
    path: `${routePath}store`,
    Icon: <ContactSupportOutlinedIcon />,
  },
  {
    name: { ar: "اكواد الدفع", en: "Payment Code" },
    path: `${routePath}payment-Code`,
    Icon: <ContactSupportOutlinedIcon />,
  },
  {
    name: { ar: "الفعليات", en: "Events" },
    path: `${routePath}events`,
    Icon: <ContactSupportOutlinedIcon />,
  },
];

export default routes;
