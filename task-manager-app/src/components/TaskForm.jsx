
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from "dayjs";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const AddTask = ({ open,handleClose,cardTitle,isEdit,isCreate,title,description,titleError,descriptionError,createdAt,buttonName,setTitle,setDescription,status,handleStatusChange,submitData}) => {
   const convertDate = (isoDateString) => {
      return dayjs(isoDateString).format("DD/MM/YYYY hh:mm A");
   };

   return (
      <Dialog
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle id="alert-dialog-title">
            {cardTitle}
         </DialogTitle>
         <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {(isEdit || isCreate) ? (<TextField
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               style={{ marginTop: '10px' }}
               label='Title'
               error={titleError}
               placeholder='enter task title'
            />) : (
               <div><b>{title}</b></div>
            )}
            {(isEdit || isCreate) ? (
               <TextField
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label='Description'
                  error={descriptionError}
                  placeholder='enter task description'
               />) : (
               <div>{description}</div>
            )}
            {isEdit && (
               <Select
                  // style={{ width: '110px' }}
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={status}
                  label="status"
                  onChange={handleStatusChange}
                  size='small'
               >
                  <MenuItem value='todo'>Todo</MenuItem>
                  <MenuItem value='in-progress'>In progress</MenuItem>
                  <MenuItem value='done'>Done</MenuItem>
               </Select>
            )}
            {(!isEdit && !isCreate) && (
               <div>Created at: {convertDate(new Date(createdAt))}</div>
            )}
         </DialogContent>
         {(isEdit || isCreate) && (
            <DialogActions>
               <Button variant='outlined' onClick={handleClose}>Cancel</Button>
               <Button variant='contained' onClick={submitData} autoFocus>
                  {buttonName}
               </Button>

            </DialogActions>
         )}
         {(!isEdit && !isCreate) && (
            <DialogActions>
               <Button variant='contained' onClick={handleClose} autoFocus>
                  Close
               </Button>
            </DialogActions>
         )}
      </Dialog>
   )
}

export default AddTask