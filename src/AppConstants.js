// export const API_ENDPOINT = "https://nage7-rds.com/nage7-backend"
// export const API_ENDPOINT = "https://nage7-rds.com/production-nage7-backend";
export const API_ENDPOINT = process.env.NODE_ENV !== "production" ? "https://nage7-rds.com/nage7-backend" : "https://nage7-rds.com/production-nage7-backend";
export const routePath = "/nage7-teacher/";
export const LangName = "nageh-Lang";
export const TokenName = "nageh-Teacher-Token";
export const UserName = "nageh-Teacher-User";
export const PathName = "nageh-Teacher-Path";
export const RESET_DATA = "nageh-ResetData";
export const APPName = "nage7-teacher";
export const EXAM_DETAILS = "nageh-ExamDetails";
export const QUESTION_BANK = "nageh-QuestionBank";
export const ACTIVE_STEP = "nagah-step";
