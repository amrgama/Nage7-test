import validationServices from "Services/validation";
import * as yup from "yup";

const phoneRegExp =
  /^(01)[0-9]{9}/

const Validation = yup.object().shape({
  groups: yup.array().of(yup.object().shape({
    group: yup.string().required({
      ar: "يجب ادخال المجموعة",
      en: "Must enter Group",
    }),
    price: yup.string().required({
      ar: "يجب ادخال سعر المجموعة",
      en: "Must enter Group Price",
    }).matches(/[0-9]+/, {
      message: {
        ar: "رقم غير صحيح",
        en: "Invalid number"
      }
    }),
  })),

  // password: yup
  //   .string()
  //   .required({ ar: "يجب ادخال كلمة المرور", en: "Must enter password" })
  //   .min(8, {
  //     ar: "يجب ان تكون كلمة المرور اكثر من 8 احرف",
  //     en: "Password must be more than 8 characters",
  //   }),
  // confirmPassword: yup.string().oneOf([yup.ref("password"), null], {
  //   ar: "كلمة المرور غير متطابقة",
  //   en: "Password does not match",
  // }),
});

export default Validation;
