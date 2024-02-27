import * as yup from "yup";

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),
  type: yup.string().required({
    ar: "يجب ادخال النوع",
    en: "Must enter type",
  }),
  date: yup.date().required({
    ar: "يجب ادخال تاريخ الفعالية",
    en: "Must enter Event Date",
  }),
  location: yup.string().required({
    ar: "يجب ادخال عنوان الفعالية",
    en: "Must enter Event Location",
  }),
  details: yup.string().required({
    ar: "يجب ادخال تفاصيل الفعالية",
    en: "Must enter Event Details",
  }),
  regisiterPrice: yup.number().required({
    ar: "يجب ادخال سعر الحجز",
    en: "Must enter register price",
  }),
  eventPrice: yup.number().required({
    ar: "يجب ادخال سعر الفعالية",
    en: "Must enter event price",
  }),
});

export default Validation;
