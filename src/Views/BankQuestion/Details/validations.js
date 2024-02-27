import validationServices from "Services/validation";
import * as yup from "yup";

const phoneRegExp =
  /^(01)[0-9]{9}/

const Validation = yup.object().shape({
  groups: yup.array().of(yup.object({
  //   name: yup.string().required({
  //     ar: "يجب ادخال الاسم ",
  //     en: "Must enter name ",
  //   }),
  //   subject: yup.string().required({
  //     ar: "يجب اختيار المادة  ",
  //     en: "Must select subject ",
  //   }),
  //  level: yup.string().required({
  //     ar: "يجب ادخال مستوى الطالب",
  //     en: "Must enter Student level",
  //   }),
  }))
});

export default Validation;
