import * as yup from "yup";

const phoneRegExp = /^(01)[0-9]{9}/;

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  subject: yup.string().required({
    ar: "يجب ادخال المادة",
    en: "Must enter subject",
  }),
  type: yup.string().required({
    ar: "يجب ادخال النوع",
    en: "Must enter type",
  }),
  from: yup.date().required({
    ar: "يجب ادخال تاريخ بداية الإمتحان",
    en: "Must enter Exam Start Date",
  }),
  to: yup.date().required({
    ar: "يجب ادخال تاريخ نهاية الإمتحان",
    en: "Must enter Exam End Date",
  }).min(yup.ref("from"),
  {
    ar: " يجب ادخال تاريخ النهاية اكبر من تاريخ البداية",
    en: "Must enter End Date greater than start date",
  }),
  examModels: yup.array().min(1, {
    ar: "يجب ادخال نموذج امتحان واحد على الأقل",
    en: "Must enter at least one exam model",
  }),
  duration: yup.number().required({
    ar: "يجب ادخال مدة الامتحان",
    en: "Must enter exam duration",
  }),
  // lesson: yup.number().required({
  //   ar: "يجب ادخال الدرس",
  //   en: "Must enter lesson",
  // }),
});

export default Validation;
