import * as yup from "yup";

const Validation = yup.object().shape({
  grade: yup.string().required({
    ar: "يجب إدخال درجة الطالب ",
    en: "Student grade is required",
  }),
  student: yup.string().required({
    ar: "يجب اختيار الطالب ",
    en: "Must choose student ",
  }),
});

export default Validation;
