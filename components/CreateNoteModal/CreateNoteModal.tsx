import css from "./CreateNoteModal.module.css";
import { useRouter } from "next/navigation";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

const CreateNoteModal = ({ onClose, children }: Props) => {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.back();
  };

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        {children}
        <button onClick={handleClose} className={css.closeButton}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default CreateNoteModal;