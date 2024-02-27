import validationServices from "Services/validation";
import * as yup from "yup";

const phoneRegExp = /^(01)[0-9]{9}/;

const Validation = yup.object().shape({
  name: yup.string().required({
    ar: "يجب ادخال الاسم ",
    en: "Must enter name ",
  }),

  saleType: yup.string().required({
    ar: "يجب اختيار النوع",
    en: "Must select sale type",
  }),
  term: yup.string().required({
    ar: "يجب اختيار التيرم",
    en: "Must select term",
  }),
  type: yup.string().required({
    ar: "يجب اختيار نوع المنتج",
    en: "Must select product type",
  }),
  details: yup.string().required({
    ar: "يجب ادخال الوصف",
    en: "Must Enter details",
  }),
  
  subLevel: yup.string().required({
    ar: "يجب ادخال المرحلة ",
    en: "Must enter sub-Level ",
  }),
  // ...imageValidation
  // image: yup.object().shape({
  //   imgUrl: yup.string().required({
  //     ar: "يجب إضافة صورة",
  //     en: "Must add an image",
  //   }),
  // }),

  });

export default Validation;
