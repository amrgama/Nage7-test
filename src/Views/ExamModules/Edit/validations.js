import * as yup from "yup";

export const detailsValidation = yup.object().shape({
  name: yup.string().required({
    ar: " يجب ادخال اسم الامتحان ",
    en: "Exam name is required",
  }),
  subject: yup.string().required({
    ar: " يجب اختيار المادة",
    en: "Subject is required",
  }),
  type: yup.string().required({
    ar: "يجب اختيار نوع الاختبار ",
    en: "Type is required",
  }),
  firstGrade: yup.number()
  .typeError({ar: "يجب ادخال رقم ",en: "Number is required"})
  .positive({ar: "يجب ادخال رقم موجب ",en: "positive Number is required"})
  .min(1, {ar: "يجب ادخال اكبر من الصفر ",en: "positive Number greater than zero is required"})
  .required({
    ar: "يجب ادخال درجة المستوى الاول ",
    en: "First question grade is required",
  }),
  secondGrade: yup.number()
  .typeError({ar: "يجب ادخال رقم ",en: "Number is required"})
  .positive({ar: "يجب ادخال رقم موجب ",en: "positive Number is required"})
  .min(1, {ar: "يجب ادخال اكبر من الصفر ",en: "positive Number greater than zero is required"})
  .required({
    ar: " يجب ادخال درجة المستوى الثاني ",
    en: "Second question grade is required",
  }),
  thirdGrade: yup.number()
  .typeError({ar: "يجب ادخال رقم ",en: "Number is required"})
  .positive({ar: "يجب ادخال رقم موجب ",en: "positive Number is required"})
  .min(1, {ar: "يجب ادخال اكبر من الصفر ",en: "positive Number greater than zero is required"})
  .required({
    ar: " يجب ادخال درجة المستوى الثالث ",
    en: "Third question grade is required",
  }),
  fourthGrade: yup.number()
  .typeError({ar: "يجب ادخال رقم ",en: "Number is required"})
  .positive({ar: "يجب ادخال رقم موجب ",en: "positive Number is required"})
  .min(1, {ar: "يجب ادخال اكبر من الصفر ",en: "positive Number greater than zero is required"})
  .required({
    ar: " يجب ادخال درجة المستوى الرابع ",
    en: "Fourth question grade is required",
  }),
});

export const questionsValidation = yup.object().shape({
  questions: yup.array().of(
    yup.object().shape({
      question: yup.string().required({
        ar: "يجب ادخال السؤال",
        en: "Question is required",
      }),
      answer: yup.string().required({
        ar: "يجب ادخال الاجابة",
        en: "Answer is required",
      }),
    })
  ),
});
