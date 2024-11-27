import * as yup from 'yup';

export const getChannelValidationShema = (channelNames) => yup.object({
  name: yup.string().required('Обязательное поле').trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .notOneOf(channelNames, 'Должно быть уникальным'),
});

export const getSignupValidationShema = () => {
  console.log('sdfsdfsfse');
};