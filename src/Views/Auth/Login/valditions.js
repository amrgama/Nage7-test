import * as yup from "yup";

const Validation = yup.object().shape({
  email: yup
    .string()
    .required({ ar: "يجب ادخال البريد الالكتروني", en: "Must enter email" })
    .email({
      ar: "يجب ادخال البريد الالكتروني بشكل صحيح",
      en: "Must enter email correctly",
    }),
  password: yup
    .string()
    .required({ ar: "يجب ادخال كلمة المرور", en: "Must enter Password" }),
});
export default Validation;
