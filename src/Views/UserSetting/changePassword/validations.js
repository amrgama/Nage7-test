import validationServices from "Services/validation";
import * as yup from "yup";

const phoneRegExp = /^(01)[0-9]{9}/;

const Validation = yup.object().shape({
  currentPassword: yup
  .string()
  .required({ ar: "يجب ادخال كلمة المرور الحالية", en: "Must enter Current password" }),
 
  newPassword: yup
    .string()
    .required({ ar: "يجب ادخال كلمة المرور", en: "Must enter password" })
    .min(8, {
      ar: "يجب ان تكون كلمة المرور اكثر من 8 احرف",
      en: "Password must be more than 8 characters",
    })
    .matches(/[a-z]/, {
      message: {
        ar: "يجب أن تحتوي كلمة المرور على حرف صغير",
        en: "Password must contain a small character",
      },
    })
    .matches(/[A-Z]/, {
      message: {
        ar: "يجب أن تحتوي كلمة المرور على حرف كبير",
        en: "Password must contain a capital character",
      },
    })
    .matches(/[0-9]/, {
      message: {
        ar: "يجب أن تحتوي كلمة المرور على رقم",
        en: "Password must contain a digit",
      },
    })
    .matches(/[^a-zA-Z0-9]/, {
      message: {
        ar: "يجب أن تحتوي كلمة المرور على رمز (!@#$%^&)",
        en: "Password must contain a symbol (!@#$%^&)",
      },
    }),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword"), null], {
    ar: "كلمة المرور غير متطابقة",
    en: "Password does not match",
  }),
});

export default Validation;
