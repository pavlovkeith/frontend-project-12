import * as yup from 'yup';

export const getChannelValidationShema = (channelsNames) => yup.object({
  name: yup.string().required('Обязательное поле').trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .notOneOf(channelsNames, 'Должно быть уникальным'),
});

export const getSignupValidationShema = () => yup.object({
  username: yup.string().required('Обязательное поле').trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: yup.string().required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmPassword: yup.string().required('Пароли должны совпадать')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
});