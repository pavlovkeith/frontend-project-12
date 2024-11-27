import notFoundImage from '../assets/images/404.svg';

const NotFoundPage = () => (
  <div className="text-center">
    <img alt="Страница не найдена" className="img-fluid h-50" src={notFoundImage} />
    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      Но вы можете перейти
      <a href="/">на главную страницу</a>
    </p>
  </div>
);

export default NotFoundPage;