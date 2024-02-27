import * as yup from "yup";

const phoneRegExp = /^(01)[0-9]{9}/;

const Validation = yup.object().shape({
  paid: yup.string().required({
    ar: "يجب إدخال قيمة الدفع ",
    en: "Pay amount is required",
  }),
  student: yup.string().required({
    ar: "يجب اختيار الطالب ",
    en: "Must choose student ",
  }),
});

export default Validation;
