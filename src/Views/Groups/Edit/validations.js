import * as yup from "yup";

const phoneRegExp =
  /^(01)[0-9]{9}/

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  subject: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  level: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  subLevel: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  daysPerWeek: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }).min(1, {
    ar: "أقل عدد أيام هو يوم واحد",
    en: "Minimum number of days is 1 day"
  }).matches(/[0-9]+/, {
    message: {
      ar: "الرقم غير صحيح",
      en: "Invalid number",
    },
  }),
  selectedDays: yup.array().min(1, {
    ar: "يجب إختيار يوم واحد على الأقل",
    en: "Must choose one day at least",
  }).max(yup.ref("daysPerWeek", { map: (value) => +value }), {
    ar: "الحد الأقصى من الأيام المختارة يجب ألا يتعدى عدد الأيام بالأسبوع",
    en: "Maximum number of days chosen must not exceed number of days per week",
  })
});

export default Validation;