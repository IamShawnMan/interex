import { Modal as AntModal } from "antd";
import style from "../../pages/Users/UserMutation.module.css";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
const Modal = ({ children, onClose }) => {
  const setting = {
    visible: true,
    centered: true,
    closable: false,
    footer: null,
    mask: true,
    
  };
  return (
    <section>
      <AntModal  onCancel={()=>onClose(false)} {...setting}>
        <section className={style.container}>
          <Close className={style.close} onClick={() => onClose()} />
          {children}
        </section>
      </AntModal>
    </section>
  );
};

export default Modal;
