import * as yup from "yup";

const phoneRegExp =
  /^(01)[0-9]{9}/

const Validation = yup.object().shape({
  parentNumber: yup.string().required({
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
  groups: yup.array().of(yup.object().shape({
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
});

export default Validation;