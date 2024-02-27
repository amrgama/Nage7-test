import * as yup from "yup";

const phoneRegExp = /^(01)[0-9]{9}/;

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  userName: yup.string().required({
    ar: "يجب ادخال اسم المستخدم",
    en: "Must enter user name",
  }),
  email: yup
    .string()
    .required({
      ar: "  يجب ادخال البريد الالكتروني",
      en: "Must enter Email",
    })
    .email({
      ar: "يجب ادخال بريد الكتروني صحيح",
      en: "Must enter valid Email",
    }),
  phone: yup
    .string()
    .required({
      ar: "يجب إدخال رقم الهاتف",
      en: "Must enter phone number",
    })
    .matches(phoneRegExp, {
      message: {
        ar: "يجب ادخال رقم الهاتف الصحيح",
        en: "Invalid Phone number",
      },
    }).max(11,{
      ar:'يجب ان يتكون الرقم من 11 رقم',
      en:'Phone must be 11 number'
    }),

  birthDate: yup
    .date()
    .max(new Date(Date.now() - 11 * 31557600000), {
      ar: "يجب ان يكون عمرك اكبر من 10 سنوات",
      en: "You must be older than 10 years",
    })
    .required({
      ar: "يجب ادخال تاريخ الميلاد",
      en: "Must enter birth date",
    }),

  gender: yup.string().required({
    ar: "يجب ادخال النوع",
    en: "Must enter gender",
  }),
  assistantLevel: yup.string().required({
    ar: "يجب ادخال صلاحية المساعد",
    en: "Must enter Assistant Role",
  }),

  // ...imageValidation
  image: yup.object().shape({
    imgUrl: yup.string().required({
      ar: "يجب إضافة صورة",
      en: "Must add an image",
    }),
  }),
});

export default Validation;
