import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Card, Link, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddTask from '../components/TaskForm';
import dayjs from "dayjs";
import DeleteTask from '../components/DeleteTask';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useNavigate } from "react-router-dom";


const Dashboard = () => {
   const navigate = useNavigate();
   const [cardTitle, setCardTitle] = useState('Create new task')
   const [buttonName, setButtonName] = useState('Create')
   const [isCreate, setIsCreate] = useState(true)
   const [isEdit, setIsEdit] = useState(false)
   const [title, setTitle]=useState('')
   const [description, setDescription] = useState('')
   const [createdAt, setCreatedAt] = useState(null)
   const [taskId, setTaskId]=useState(null)
   const [todoList, setTodoList] = useState([])
   const [inprogressList, setInprogressList] = useState([])
   const [doneList, setDoneList] = useState([])
   const [status, setStatus] = useState('')

   const handleStatusChange = (e) => {
      setStatus(e.target.value)
   }

   useEffect(() => {
      getAllTask()
   }, [])

   const handleLogout = () => {
      navigate("/login");
      localStorage.removeItem("token")
   };


   const [open, setOpen] = useState(false);
   const [deletePanelOpen, setDeletePanelOpen] = useState(false);
   const [option, setOption] = useState('recent');
   const [titleError, setTitleError] = useState(false)
   const [searchQuery, setSearchQuery] = useState('');
   const [descriptionError, setDescriptionError] = useState(false)

   const handleOptionChange = (event) => {
      setOption(event.target.value);
   };

   const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
   };

   useEffect(() => {
      getAllTask();
   }, [searchQuery, option]);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleDelete = (data) => {
      setDeletePanelOpen(true);
      setTitle(data.title)
      setTaskId(data._id)
   };

   const handleEdit = (data) => {
      setOpen(true);
      setTitle(data.title)
      setDescription(data.description)
      setStatus(data.status)
      setIsEdit(true)
      setIsCreate(false)
      setTaskId(data._id)
      setCardTitle("Update Task")
      setButtonName("Update")
   }

   const handleViewDetails = (data) => {
      setOpen(true);
      setTitle(data.title)
      setDescription(data.description)
      setCreatedAt(data.createdAt)
      setIsEdit(false)
      setIsCreate(false)
      setCardTitle("Task Details")
   }

   const handleClose = () => {
      setOpen(false);
      setDeletePanelOpen(false)
      setTitle(null)
      setDescription(null)
      setTitleError(false)
      setDescriptionError(false)
      setIsEdit(false)
      setCardTitle("Create new task")
      setButtonName("Create")
      setIsCreate(true)
      setTaskId(null)
      setStatus(null)
   };

   const submitData = async () => {
      !title ? setTitleError(true) : setTitleError(false)
      !description ? setDescriptionError(true) : setDescriptionError(false)
      if (titleError || descriptionError) return
      try {

         if (isCreate) {
            const createTask = await axios.post(`http://localhost:8000/api/task/create`, {
               title,
               description
            })
            toast.success(createTask.data.message)
         } else {
            const createTask = await axios.put(`http://localhost:8000/api/task/update/${taskId}`, {
               title,
               description,
               status
            })
            toast.success(createTask.data.message)
         }
      } catch (err) {
         toast.error(err.response.data.message)
      } finally {
         handleClose()
         getAllTask()
      }
   }

   const convertDate = (isoDateString) => {
      return dayjs(isoDateString).format("DD/MM/YYYY hh:mm A");
   };

   const getAllTask = async () => {
      try {
         const taskData = await axios.get(`http://localhost:8000/api/task/getall`,{
            params: {
            search: searchQuery, 
            sort: option,  
         },
         })
         console.log("taskData----------", taskData)
         if (taskData.status === 200) {
            // toast.success("Tasks are listed")
            const todoData = taskData.data.data.filter(item => item.status === 'todo')
            const inprogressData = taskData.data.data.filter(item => item.status === 'in-progress' )
            const doneData = taskData.data.data.filter(item => item.status === 'done' )
            setTodoList(todoData)
            setInprogressList(inprogressData)
            setDoneList(doneData)
         }
      } catch (err) {
         toast.error(err.response.data.message)
         console.log("err----------",err)
      }
   }
   
   const deleteConfirm = async() => {
      try {
         const deleteData = await axios.delete(`http://localhost:8000/api/task/delete/${taskId}`)
         console.log("taskId----------", taskId, deleteData)
         if (deleteData.data) {
            toast.success(deleteData.data.message)
         }
      } catch (err) {
         toast.error(err.response.data.message)
      } finally {
         handleClose()
         getAllTask()
      }
   }


   // Handle the drag end event
   const handleDragEnd = (result) => {
      const { source, destination } = result;
console.log("result----------------",result)
      // If the item is dropped outside a droppable
      if (!destination) return;

      const sourceList = getList(source.droppableId);
      const destinationList = getList(destination.droppableId);

      // Remove item from source list
      const [removed] = sourceList.splice(source.index, 1);

      // Add item to destination list
      destinationList.splice(destination.index, 0, removed);

      // Update the lists with the modified state
      if (source.droppableId === 'todoList') setTodoList([...sourceList]);
      if (source.droppableId === 'inprogressList') setInprogressList([...sourceList]);
      if (source.droppableId === 'doneList') setDoneList([...sourceList]);

      if (destination.droppableId === 'todoList') setTodoList([...destinationList]);
      if (destination.droppableId === 'inprogressList') setInprogressList([...destinationList]);
      if (destination.droppableId === 'doneList') setDoneList([...destinationList]);
   };

   // Helper function to get the correct list based on the droppable ID
   const getList = (listId) => {
      switch (listId) {
         case 'todoList':
            return todoList;
         case 'inprogressList':
            return inprogressList;
         case 'doneList':
            return doneList;
         default:
            return [];
      }
   };

   return (
      <div>
         <AppBar position="static">
         <Toolbar>
            <IconButton
               size="large"
               edge="start"
               color="inherit"
               aria-label="menu"
               sx={{ mr: 2 }}
            >
               <AssignmentIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
               Task Manager
            </Typography>
               <Button style={{ backgroundColor: 'red' }} onClick={handleLogout} color='inherit'>LogOut</Button>
         </Toolbar>
         </AppBar>
         <div style={{margin:'30px'}}>
            <Button size='small' variant='contained' onClick={handleClickOpen}>Add Task</Button>
            <Card style={{ marginTop: '10px', display:'flex', justifyContent:'space-between'}}>
               <div style={{display:'flex', margin:'15px',alignItems:'center' , gap:'10px', width:'50%'}}>
                  <div>search:</div>
                  <TextField
                     size="small"
                     style={{ width: '30%' }}
                     placeholder="Search"
                     value={searchQuery}
                     onChange={handleSearchChange} // Handle search input
                  />
               </div>
               <div style={{ display: 'flex', margin: '15px', alignItems: 'center', gap: '10px', width: '50%', justifyContent:'end' }}>
                  <div>Sort By:</div>
                  <Select
                     style={{width:'110px'}} 
                     labelId="demo-select-small-label"
                     id="demo-select-small"
                     value={option}
                     onChange={handleOptionChange}
                     size='small'
                  >
                     <MenuItem  value='recent'>Recent</MenuItem>
                     <MenuItem  value='old'>old</MenuItem>
                  </Select>
               </div>
            </Card>
            <DragDropContext onDragEnd={handleDragEnd}>
               <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  {['todoList', 'inprogressList', 'doneList'].map((listId) => (
                     <Card key={listId} style={{ width: '30%' }}>
                        <div style={{ padding: '5px' }}>
                           <div style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '5px' }}>
                              <p style={{ padding: '5px' }}><b>{listId.replace('List', '').toUpperCase()}</b></p>
                           </div>
                           <Droppable droppableId={listId}>
                              {(provided) => (
                                 <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ height: '400px', overflowY: 'auto', padding: '5px', backgroundColor: '#f0f0f0' }}
                                 >
                                    {getList(listId).length > 0 ? (
                                    getList(listId).map((item, index) => (
                                       <Draggable key={item._id} draggableId={item._id} index={index}>
                                          {(provided) => (
                                             <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                   ...provided.draggableProps.style,
                                                   backgroundColor: 'rgb(144, 200, 255)',
                                                   borderRadius: '5px',
                                                   marginTop: '10px',
                                                   padding: '10px',
                                                }}
                                             >
                                                <div><b>{item.title}</b></div>
                                                <div>{item.description}</div>
                                                <p style={{ marginTop: '20px' }}>Created at: {convertDate(new Date(item.createdAt))}</p>
                                                <div style={{ display: 'flex', justifyContent: 'end', gap: '5px', marginTop: '10px' }}>
                                                   <Button variant='contained' size='small' style={{ backgroundColor: 'red' }} onClick={() => handleDelete(item)}>Delete</Button>
                                                   <Button variant='contained' size='small' onClick={() => handleEdit(item)} >Edit</Button>
                                                   <Button variant='contained' size='small' onClick={() => handleViewDetails(item)} >View Details</Button>
                                                </div>
                                             </div>
                                          )}
                                       </Draggable>
                                    ))
                                       
                                    ) : (
                                       <p>No tasks available</p>
                                    )}
                                    {provided.placeholder}
                                 </div>
                              )}
                           </Droppable>
                        </div>
                     </Card>
                  ))}
               </div>
            </DragDropContext>
               {open && (
                  <AddTask
                     open={open}
                     handleClose={handleClose}
                     title={title}
                     description={description}
                     titleError={titleError}
                     descriptionError={descriptionError}
                     cardTitle={cardTitle}
                     buttonName={buttonName}
                     setTitle={setTitle}
                     setDescription={setDescription}
                     isCreate={isCreate}
                     isEdit={isEdit}
                     status={status}
                     handleStatusChange={handleStatusChange}
                     createdAt={createdAt}
                     submitData={submitData}
                  />
               )}
               {deletePanelOpen && (
                  <DeleteTask deletePanelOpen={deletePanelOpen} handleClose={handleClose} deleteConfirm={deleteConfirm} title={title} />
               )}
            <ToastContainer/>
         </div>
      </div>
   )
}

export default Dashboard