import ConfirmDialog from "../components/common/ConfirmDialog";
import { useAppContext } from "../context/AppContext";

export const useConfirm = () => {

  const { openPopOverModal, closeTopPopOverModal } = useAppContext();

  return ({ title = "Confirm", message }) => {

    return new Promise((resolve) => {

      openPopOverModal({
        title,
        size: "sm",
        content: (
          <ConfirmDialog
            message={message}
            onConfirm={() => {
              resolve(true);
              closeTopPopOverModal();
            }}
            onCancel={() => {
              resolve(false);
              closeTopPopOverModal();
            }}
          />
        )
        
      });

    });

  };

};
