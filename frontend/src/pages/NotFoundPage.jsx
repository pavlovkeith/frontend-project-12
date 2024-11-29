import { useTranslation } from 'react-i18next';
import notFoundImage from '../assets/images/404.svg';
import { ROUTES } from '../routes';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img alt={t('headers.notfound')} className="img-fluid h-50" src={notFoundImage} />
      <h1 className="h4 text-muted">{t('headers.notfound')}</h1>
      <p className="text-muted">
        {t('links.direction')}
        <span> </span>
        <a href={ROUTES.home}>{t('links.main')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
