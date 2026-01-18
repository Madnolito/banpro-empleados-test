import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm, confirmText = "Confirmar", busy }) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={busy}>Cancelar</Button>
        <Button variant="contained" onClick={onConfirm} disabled={busy}>
          {busy ? "Procesando..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.node,
  description: PropTypes.node,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  busy: PropTypes.bool,
};

ConfirmDialog.defaultProps = {
  confirmText: "Confirmar",
  busy: false,
};