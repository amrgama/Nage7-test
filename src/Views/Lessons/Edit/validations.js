import * as yup from "yup";

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  // number: yup.string().required({
  //   ar: "يجب ادخال الرقم",
  //   en: "Must enter number",
  // }).matches(/[0-9]+/, {
  //   message: {
  //     ar: "رقم غير صحيح",
  //     en: "Invalid number"
  //   }
  // }),
});

export default Validation;