import { Player } from "@lottiefiles/react-lottie-player";
import lottie from "Assets/Lottie/loading.json";
import { routePath } from "./AppConstants";
import Dashboard from "./Views/Dashboard";
import ViewStudent from "Views/Students/ViewDetails";
import AddStudent from "Views/Students/Add";
import ViewStudents from "Views/Students/View";
import EditStudent from "Views/Students/Edit";
import ViewAssistants from "Views/Assistants/View";
import AddAssistant from "Views/Assistants/Add";
import EditAssistant from "Views/Assistants/Edit";
import ViewGroups from "Views/Groups/View";
import AddGroup from "Views/Groups/Add";
import EditGroup from "Views/Groups/Edit";
import ViewLessons from "Views/Lessons/View";
import AddLesson from "Views/Lessons/Add";
import EditLesson from "Views/Lessons/Edit";
import ViewAttendances from "Views/Attendances/View";
import AddAttendance from "Views/Attendances/Add";
import ViewGroup from "Views/Groups/ViewDetails";
import ViewRequests from "Views/StudentsRequests/View";
import AssignRequests from "Views/StudentsRequests/AssignGroup";

import ViewAcceptedRequests from "Views/StudentsRequests/AcceptedView";
import ViewCards from "Views/Cards/View";
import ViewPreviousAttendance from "Views/Attendances/PreviousAttendance";
import editBankQuestion from "Views/BankQuestion/Edit";
import addBankQuestion from "Views/BankQuestion/Add";
import bankQuestion from "Views/BankQuestion/View";
import bankQuestionDetails from "Views/BankQuestion/Details";
import ExamModule from "Views/ExamModules/View";
import AddExamModule from "Views/ExamModules/Add";
import ViewExams from "Views/Exams/View";
import AddExam from "Views/Exams/Add";
import EditExam from "Views/Exams/Edit";

import ViewOfflineExams from "Views/OfflineExams/View";
import AddOfflineExam from "Views/OfflineExams/Add";
import AddLecture from "Views/Attendances/AddLecture";
import AddPosts from "Views/Dashboard/Posts/addPosts";
import EditPosts from "Views/Dashboard/EditPosts/editPosts";
import myProfile from "Views/UserSetting";
import changePassword from "Views/UserSetting/changePassword";
import updateInfo from "Views/UserSetting/userInfo";
import paymentStoreCode from "Views/paymentStoreCode/View";
import AddpaymentStoreCode from "Views/paymentStoreCode/Add";
import store from "Views/Store/View";
import Addstore from "Views/Store/Add";
import Editstore from "Views/Store/Edit";
import ViewEvents from "Views/Events/View";
import AddEvent from "Views/Events/Add";
import EditOfflineExam from "Views/OfflineExams/Edit";
import ViewOfflineExam from "Views/OfflineExams/ViewDetails";
import AddGrade from "Views/OfflineExams/ViewDetails/AddGrade";
import EditExamModule from "Views/ExamModules/Edit";
import ViewDetails from "Views/Assistants/ViewDetails";

export function Loading() {
  return (
    <div className="loading">
      <Player src={lottie} autoplay loop style={{ height: "700px" }} />
    </div>
  );
}

const routes = [
  { path: `${routePath}store`, Component: store },
  { path: `${routePath}store/add`, Component: Addstore },
  { path: `${routePath}store/edit/:id`, Component: Editstore },

  { path: `${routePath}payment-Code`, Component: paymentStoreCode },
  { path: `${routePath}payment-Code/add`, Component: AddpaymentStoreCode },

  { path: `${routePath}myProfile`, Component: myProfile },
  { path: `${routePath}myProfile/changePassword`, Component: changePassword },
  { path: `${routePath}myProfile/updateInfo`, Component: updateInfo },

  { path: `${routePath}dashboard`, Component: Dashboard },
  { path: `${routePath}posts/add`, Component: AddPosts },
  { path: `${routePath}posts/edit/:id`, Component: EditPosts },

  // Students
  { path: `${routePath}students`, Component: ViewStudents },
  { path: `${routePath}students/add`, Component: AddStudent },
  { path: `${routePath}students/edit/:id`, Component: EditStudent },
  { path: `${routePath}students/view/:id`, Component: ViewStudent },
  // Requests
  { path: `${routePath}student-requests`, Component: ViewRequests },
  {
    path: `${routePath}student-requests/assign/:id/:level`,
    Component: AssignRequests,
  },

  {
    path: `${routePath}student-accepted-requests`,
    Component: ViewAcceptedRequests,
  },

  // Groups
  { path: `${routePath}groups`, Component: ViewGroups },
  { path: `${routePath}groups/add`, Component: AddGroup },
  { path: `${routePath}groups/edit/:id`, Component: EditGroup },
  { path: `${routePath}groups/view/:id`, Component: ViewGroup },
  { path: `${routePath}groups/view/:id/:activeTab`, Component: ViewGroup },
  // Assistants
  { path: `${routePath}assistants`, Component: ViewAssistants },
  { path: `${routePath}assistants/add`, Component: AddAssistant },
  { path: `${routePath}assistants/edit/:id`, Component: EditAssistant },
  { path: `${routePath}assistants/view/:id`, Component: ViewDetails },
  { path: `${routePath}lessons`, Component: ViewLessons },
  { path: `${routePath}lessons/add`, Component: AddLesson },
  { path: `${routePath}lessons/edit/:id`, Component: EditLesson },
  // { path: `${routePath}lessons/view/:id`, Component: ViewLesson },
  { path: `${routePath}attendances`, Component: ViewPreviousAttendance },
  { path: `${routePath}attendances/add`, Component: AddLecture },
  { path: `${routePath}attendances/add/:lecture`, Component: AddAttendance },
  {
    path: `${routePath}attendances/view/:lecture`,
    Component: ViewAttendances,
  },
  {
    path: `${routePath}cards/:type/:tab`,
    Component: ViewCards,
  },
  {
    path: `${routePath}cards/:type`,
    Component: ViewCards,
  },
  {
    path: `${routePath}bank-Question/add`,
    Component: addBankQuestion,
  },
  {
    path: `${routePath}bank-Question/edit/:id`,
    Component: editBankQuestion,
  },
  {
    path: `${routePath}bank-Question`,
    Component: bankQuestion,
  },
  {
    path: `${routePath}bank-Question/view/:id`,
    Component: bankQuestionDetails,
  },
 
  {
    path: `${routePath}exams`,
    Component: ViewExams,
  },
  {
    path: `${routePath}exams/add`,
    Component: AddExam,
  },
  {
    path: `${routePath}exam/edit/:id`,
    Component: EditExam,
  },
  
  {
    path: `${routePath}offline-exams`,
    Component: ViewOfflineExams,
  },
  {
    path: `${routePath}offline-exams/add`,
    Component: AddOfflineExam,
  },
  {
    path: `${routePath}offline-exams/edit/:id`,
    Component: EditOfflineExam,
  },
  {
    path: `${routePath}offline-exams/view/:id`,
    Component: ViewOfflineExam,
  },
  {
    path: `${routePath}offline-exams/add-grade/:examId`,
    Component: AddGrade,
  },
  {
    path: `${routePath}exam-modules`,
    Component: ExamModule,
  },
  {
    path: `${routePath}exam-modules/add`,
    Component: AddExamModule,
  },
  {
    path: `${routePath}exam-modules/edit/:id`,
    Component: EditExamModule,
  },
  {
    path: `${routePath}events`,
    Component: ViewEvents,
  },
  {
    path: `${routePath}events/add`,
    Component: AddEvent,
  },
];

export default routes;
