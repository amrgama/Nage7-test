import * as yup from "yup";

const Validation = yup.object().shape({
  password: yup
    .string()
    .required({
      ar: "يجب ادخال كلمة المرور",
      en: "Password is required !",
    })
    .min(8, {
      ar: "كلمة المرور لا يجب ان تقل عن 8 حروف",
      en: "Password must contain At Least 8 Characters",
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], {
      ar: "كلمتا المرور لا تتطابق",
      en: "Passwords must match",
    })
    .required({
      ar: "يجب ادخال كلمة المرور",
      en: "Confirm password is required",
    }),
});
export default Validation;
