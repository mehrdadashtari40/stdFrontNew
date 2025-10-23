import React, {useState, useEffect, useContext} from "react";
import { connect, useSelector } from 'react-redux';
import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import * as menu from "../_redux/menuRedux";
import { withTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal';
import {
  get_processes_list,
  post_process_is_active,
  post_process_reorder
} from "../_redux/menuCrud";
import { makeStyles } from '@mui/styles';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GridLoader } from "react-spinners";
import SubMenuEdit from "./SubMenuEdit";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import {AppConfig} from "../../../appConfig";


const SubMenu = (props) => {
  const {apiServer} = useContext(AppConfig);
  let menuState = useSelector(state => state.menuReducer);
  const [loading, setLoading] = useState(true)

  const theme = createTheme({
    direction: 'rtl',
  });

  //Change the style due to a problem when pressing the back button
  useEffect(() => {
    let switchElement = document.querySelectorAll('.MuiSwitch-switchBase');
    for(let i=0; i< switchElement.length;i++){
      switchElement[i].classList.remove("MuiButtonBase-root");
    }
    let buttonElement = document.querySelectorAll('.MuiButton-root');
    for(let i=0; i< buttonElement.length;i++){
      buttonElement[i].classList.remove("MuiButtonBase-root");
    }
  })


  const useStyles = makeStyles((theme) => ({
    InputLabelProps: {
      shrink: true
    },
    labelRoot: {
      right: 0,
      fontSize: '16px',
      fontFamily: 'IRANSans'
    },
    shrink: {
      transformOrigin: "top right"
    },
    appBar: {
      position: 'relative',
    },
    layout: {
      width: 'auto',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      },
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-center',
      float: 'left',
      fontSize: '14px',
      padding: ' 6px 50px',
      margin: "0 20px"
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
    closeButton: {
      position: 'absolute',
      left: '0',
      top: '0',
      backgroundColor: 'lightgray',
      color: 'gray',
      borderRadius: '0',
      padding: '10px'
    }
  }));

  const loadStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
  const cardStyle = {
    position: 'absolute',
    top: '42%',
    left: '42%',
    transform: 'translate(-50%, -50%)',
    width: '78%',
    height: '70vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const buttonStyles = {
    display: 'flex',
    justifyContent: 'flex-center',
    float: 'left',
    fontSize: '12px',
    padding: ' 3px 40px',
    marginRight: "20px",
    fontFamily: 'IRANSans'
  }
  const classes = useStyles();


  useEffect(async () => {
    try{
      let receive = await get_processes_list(apiServer,menuState.currentCatUID);
      props.handle_variables('processList', receive);
      setLoading(false);
    }catch (err){
      toast.error(props.t("Error"));
      setLoading(false);
    }
    
  }, [])

  const handleClose = () => {
    props.handle_variables("openSubMenu", false)
  }

  let orderedList = menuState.categoriesList.map(item => item.catUid);



  // normally one would commit/save any order changes via an api call here...
  const handleDragEnd = (result, provided) => {

    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }
    orderedList.splice(result.source.index, 1);
    orderedList.splice(result.destination.index, 0, result.draggableId);

    const temp = menuState.processList;
    const draggableValue = temp[result.source.index]
    temp.splice(result.source.index, 1);
    temp.splice(result.destination.index, 0, draggableValue);
    let data = temp.map(item => ({
      proUid: item.proUID,
      tasUid: item.tasUid
    }))
    post_process_reorder(apiServer,menuState.currentCatUID, data)
      .then(() =>{ 
        props.handle_variables('processList', temp);
        props.handle_refresh_menu();
    })
    .catch(() => toast.error(props.t("Error")))

  };

  const handleSwitch = (evt, item) => {

    const temp = menuState.processList;
    let index = temp.indexOf(item);
    if (index !== -1) {
      temp[index].isActive = temp[index].isActive == '1' ? '0' : '1';
    }
    const data = {
      isActive: item.isActive,
      catUid: menuState.currentCatUID,
      proUid: item.proUID
    }
    post_process_is_active(apiServer,item.tasUid, data)
      .then(() => {
        props.handle_variables('processList', temp);
        props.handle_refresh_menu();
      })
      .catch(() => toast.error(props.t("Error")))
  }


  const handleEdit = (id) => {
    props.handle_variables('currentTasUid', id);
    props.handle_variables("openSubMenuEdit", true)
  }
  return (

    <Modal
      open={menuState.openSubMenu}
      onClose={handleClose}
    >

      <Card style={cardStyle}>
        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <main className={classes.layout}>
          <div style={{ fontSize: '16px', margin: '18px', color: '#4949a9' }}>
            نام دسته بندی : {menuState.currentCatName}
          </div>
          {loading ? <div style={loadStyle}><GridLoader color={"#45a5bf"} /></div> :
            <TableContainer>
              <Table stickyHeader>
                <colgroup>
                  <col style={{ width: "5%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">&nbsp;</TableCell>
                    <TableCell align="right">نام فرآیند</TableCell>
                    <TableCell align="right">نام معادل</TableCell>
                    <TableCell align="right">نام وظیفه</TableCell>
                    <TableCell align="right">نمایش</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="droppable" direction="vertical">
                    {(droppableProvided) => (
                      <TableBody
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                      >
                        {menuState.processList.map((item, index) =>
                          <Draggable
                            key={item.tasUid}
                            draggableId={item.tasUid}
                            index={index}
                          >
                            {(
                              draggableProvided,
                              snapshot
                            ) => {
                              return (
                                <TableRow
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  style={{
                                    ...draggableProvided.draggableProps.style,
                                    background: snapshot.isDragging
                                      ? "rgba(245,245,245, 0.75)"
                                      : "none"
                                  }}
                                >
                                  {/* note: `snapshot.isDragging` is useful to style or modify behaviour of dragged cells */}
                                  <TableCell align="right">
                                    <div {...draggableProvided.dragHandleProps}>
                                      <ReorderIcon />
                                    </div>
                                  </TableCell>
                                  <TableCell align="right">{item.proTitle}</TableCell>
                                  <TableCell align="right">{item.label}</TableCell>
                                  <TableCell align="right">{item.tasTitle}</TableCell>
                                  <TableCell align="right">
                                    <Switch
                                      checked={Boolean(+item.isActive)}
                                      onChange={(e) => handleSwitch(e, item)}
                                    /></TableCell>
                                  <TableCell align="center">
                                    <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                                      <Button sx={buttonStyles} variant="contained" color="success" onClick={() => handleEdit(item.tasUid)}>ویرایش</Button>
                                      {(menuState.openSubMenuEdit && item.tasUid == menuState.currentTasUid) ? <SubMenuEdit /> : ""}
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              );
                            }}
                          </Draggable>
                        )}
                        {droppableProvided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </DragDropContext>
              </Table>
            </TableContainer>
          }
        </main>
      </Card>
    </Modal>

  )
}

export default connect(null, menu.actions)(withTranslation()(SubMenu));