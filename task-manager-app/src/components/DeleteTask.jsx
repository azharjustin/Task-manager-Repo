import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteTask = ({deletePanelOpen,handleClose,deleteConfirm,title}) => {
   return (
      <Dialog
         open={deletePanelOpen}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle id="alert-dialog-title">
            Delete Task
         </DialogTitle>
         <DialogContent>
            <DialogContentText>
               Are you sure you want to delet this Taks <b>{title}</b> ?
            </DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button variant='outlined' onClick={handleClose}>No</Button>
            <Button variant='contained' style={{ backgroundColor: 'red' }} onClick={deleteConfirm} autoFocus>
               Yes
            </Button>
         </DialogActions>
      </Dialog>
   )
}
export default DeleteTask