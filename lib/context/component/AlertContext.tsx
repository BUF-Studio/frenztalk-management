import type React from "react";
import { createContext, useState, useContext, type ReactNode } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

interface AlertOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);

  const showAlert = (alertOptions: AlertOptions) => {
    setOptions(alertOptions);
    setOpen(true);
  };

  const hideAlert = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    options?.onConfirm?.();
    hideAlert();
  };

  const handleCancel = () => {
    options?.onCancel?.();
    hideAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{options?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {options?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined" color="primary">
            {options?.cancelLabel || "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            color="error"
            variant="contained"
          >
            {options?.confirmLabel || "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};
