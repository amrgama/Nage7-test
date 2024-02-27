import * as yup from "yup";

const phoneRegExp =
  /^(01)[0-9]{9}/

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
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
  phone: yup.string().matches(phoneRegExp, {
    message: {
      ar: "يجب ادخال رقم الهاتف الصحيح",
      en: "Invalid Phone number",
    },
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

  nickName: yup.string().required({
    ar: "يجب ادخال الاسم المستعار",
    en: "Must enter nick name",
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
