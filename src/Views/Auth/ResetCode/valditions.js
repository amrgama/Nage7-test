import * as yup from "yup";

const Validation = yup.object().shape({
  code: yup
    .string()
    .required({ ar: "يجب ادخال كود التفعيل", en: "Must enter code" }),
});
export default Validation;
