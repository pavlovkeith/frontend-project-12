import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { removeChannel } from '../../store/slices/channelsSlice';

const Remove = ({ closeModal }) => {
  const rollbar = useRollbar();
  const dispatch = useDispatch();
  const { authHeader } = useSelector((state) => state.auth);
  const { loadingStatus } = useSelector((state) => state.channels);
  const { show, channel } = useSelector((state) => state.modal);
  const { t } = useTranslation();

  const handleDelete = () => dispatch(removeChannel({ id: channel.id, authHeader }))
    .then((data) => {
      closeModal();
      if (!data.error) {
        toast.success(t('toasts.channelDeleted'));
      } else {
        toast.error(t('toasts.connectionError'));
        rollbar.error(data.error);
      }
    });

  return (
    <Modal show={show} style={{ top: '20%' }} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('headers.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('questions.confirm')}</p>
        <div className="d-flex justify-content-end">
          <Button
            disabled={loadingStatus === 'loading'}
            variant="secondary"
            onClick={closeModal}
            className="me-2"
          >
            {t('buttons.cancel')}
          </Button>
          <Button
            disabled={loadingStatus === 'loading'}
            variant="danger"
            type="button"
            onClick={() => handleDelete()}
          >
            {t('buttons.delete')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
