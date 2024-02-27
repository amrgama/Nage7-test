import * as yup from "yup";

const phoneRegExp = /^(01)[0-9]{9}/;

const Validation = yup.object().shape({
  amount: yup.string().required({
    ar: "يجب إدخال المبلغ ",
    en: "amount is required",
  }),
  count: yup.string().required({
    ar: "يجب إدخال العدد ",
    en: "count is required",
  }),
});

export default Validation;
