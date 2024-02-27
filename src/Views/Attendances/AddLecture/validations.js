import * as yup from "yup";

const phoneRegExp = /^(01)[0-9]{9}/;

const Validation = yup.object().shape({
  lesson: yup.string().required({
    ar: "يجب إدخال الحصة ",
    en: "Lecture is required",
  }),
  group: yup.string().required({
    ar: "يجب اختيار المجموعة ",
    en: "Must choose Group ",
  }),
});

export default Validation;
