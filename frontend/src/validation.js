import * as yup from 'yup';

export const getChannelValidationShema = (t, channelsNames) => yup.object({
  name: yup.string().required(t('validationErrors.requiredField')).trim()
    .min(3, t('validationErrors.incorrectLength'))
    .max(20, t('validationErrors.incorrectLength'))
    .notOneOf(channelsNames, t('validationErrors.notUniqueNameChannel')),
});

export const getSignupValidationShema = (t) => yup.object({
  username: yup.string().required(t('validationErrors.requiredField')).trim()
    .min(3, t('validationErrors.incorrectLength'))
    .max(20, t('validationErrors.incorrectLength')),
  password: yup.string().required(t('validationErrors.requiredField'))
    .min(6, t('validationErrors.minPasswordLength')),
  confirmPassword: yup.string().required(t('validationErrors.notConfirmPassword'))
    .oneOf([yup.ref('password')], t('validationErrors.notConfirmPassword')),
});
