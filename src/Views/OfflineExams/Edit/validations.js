import * as yup from "yup";

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  maxGrade: yup.number().required({
    ar: "يجب ادخال إجمالي الدرجات",
    en: "Must enter Total Grades",
  }),
  attendanceLecture: yup.number().required({
    ar: "يجب ادخال الدرس",
    en: "Must enter lesson",
  }),
  subject: yup.string().required({
    ar: "يجب ادخال المادة",
    en: "Must enter subject",
  }),
});

export default Validation;
