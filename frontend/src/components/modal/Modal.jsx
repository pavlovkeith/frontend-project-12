import { useSelector, useDispatch } from 'react-redux';
import Add from './Add.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';
import { actions as modalActions } from '../../store/slices/modalSlice';

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const Modal = () => {
  const dispatch = useDispatch();
  const { type } = useSelector((state) => state.modal);

  const closeModal = () => {
    dispatch(modalActions.hideModal());
    setTimeout(() => {
      dispatch(modalActions.resetModal());
    }, 100); // 300ms waiting for modal-closing animation
  };

  if (!type) {
    return null;
  }
  const ModalComponent = modals[type];
  return <ModalComponent closeModal={closeModal} />;
};

export default Modal;
