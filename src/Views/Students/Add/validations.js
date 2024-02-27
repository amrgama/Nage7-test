import validationServices from "Services/validation";
import * as yup from "yup";

const phoneRegExp =
  /^(01)[0-9]{9}/

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  // email: yup
  //   .string()
  //   .required({
  //     ar: "  يجب ادخال البريد الالكتروني",
  //     en: "Must enter Email",
  //   })
  //   .email({
  //     ar: "يجب ادخال بريد الكتروني صحيح",
  //     en: "Must enter valid Email",
  //   }),
  phone: yup.string().required({
    ar: "يجب إدخال رقم الهاتف",
    en: "Must enter phone number"
  }).matches(phoneRegExp, {
    message: {
      ar: "يجب ادخال رقم الهاتف الصحيح",
      en: "Invalid Phone number",
    },
  }).max(11,{
    ar:'يجب ان يتكون الرقم من 11 رقم',
    en:'Phone must be 11 number'
  }),
  parentNumber: yup.string().required({
    ar: "يجب إدخال رقم الهاتف " ,
    en: "Must enter phone number"
  }).matches(phoneRegExp, {
    message: {
      ar: "يجب ادخال رقم الهاتف الصحيح",
      en: "Invalid Phone number",
    },
  }).max(11,{
    ar:'يجب ان يتكون الرقم من 11 رقم',
    en:'Phone must be 11 number'
  }),
  // birthDate: yup
  //   .date()
  //   .max(new Date(Date.now() - 11 * 31557600000), {
  //     ar: "يجب ان يكون عمرك اكبر من 10 سنوات",
  //     en: "You must be older than 10 years",
  //   })
  //   .required({
  //     ar: "يجب ادخال تاريخ الميلاد",
  //     en: "Must enter birth date",
  //   }),

  gender: yup.string().required({
    ar: "يجب ادخال النوع",
    en: "Must enter gender",
  }),
  level: yup.string().required({
    ar: "يجب ادخال مستوى الطالب",
    en: "Must enter Student level",
  }),
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
