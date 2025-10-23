import React, {useContext, useEffect, useState} from "react";
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
import { toast } from 'react-toastify';
import * as menu from "../_redux/menuRedux";
import { withTranslation } from 'react-i18next';
import Edit from "./Edit";
import SubMenu from "./SubMenu";
import { post_category_is_active, post_category_reorder } from "../_redux/menuCrud"
import {AppConfig} from "../../../appConfig";

const MaterialTable = (props) => {
  const {apiServer} = useContext(AppConfig);
  let menuState = useSelector(state => state.menuReducer);
  let orderedList = menuState.categoriesList.map(item => item.catUid);


  const buttonStyles = {
    display: 'flex',
    justifyContent: 'flex-center',
    float: 'left',
    fontSize: '12px' ,
    padding: '3px 40px' ,
    marginRight: "20px",
    fontFamily: 'IRANSans',
    justifyContent: 'center',
  }

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

//
  const handleDragEnd = (result, provided) => {

    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }
    orderedList.splice(result.source.index, 1);
    orderedList.splice(result.destination.index, 0, result.draggableId);

    const temp = menuState.categoriesList;
    const draggableValue = temp[result.source.index]
    temp.splice(result.source.index, 1);
    temp.splice(result.destination.index, 0, draggableValue);
    let data = temp.map((item) => item.catUid)
    post_category_reorder(apiServer,data)
      .then(() => {
        props.handle_variables('categoriesList', temp);
        props.handle_refresh_menu();
      })
      .catch(()=>{
        toast.error(props.t("Error"));
      })

  };

  const handleSwitch = (evt, item) => {
    let temp = [...menuState.categoriesList];
    let index = temp.indexOf(item);
    if (index !== -1) {
      temp[index].isActive = temp[index].isActive == '1' ? '0' : '1';
    }

    post_category_is_active(apiServer,item.catUid, item.isActive)
      .then(() => {
        props.handle_variables('categoriesList', temp);
        props.handle_refresh_menu();
      })
      .catch(()=>{
      toast.error(props.t("Error"));
       })
      
    
    
     


  }

  const handleSubmenu = (id, catName) => {
    props.handle_variables('currentCatUID', id);
    props.handle_variables('currentCatName', catName);
    props.handle_variables("openSubMenu", true);
  }

  const handleEdit = (id, catName) => {
    props.handle_variables('currentCatUID', id);
    props.handle_variables('currentCatName', catName);
    props.handle_variables("openEdit", true)
    //TODO editOpen -> false
  }
  return (
    <>
      <TableContainer>
        <Table stickyHeader>
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell align="left">&nbsp;</TableCell>
              <TableCell align="right">آیکن</TableCell>
              <TableCell align="right">دسته‌بندی</TableCell>
              <TableCell align="right">نام معادل</TableCell>
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
                  {menuState.categoriesList.map((item, index) =>
                    <Draggable
                      key={item.catUid}
                      draggableId={item.catUid}
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
                            <TableCell align="right"><i style={{ fontSize: '16px' }} className={item.icon}></i></TableCell>
                            <TableCell align="right">{item.catName}</TableCell>
                            <TableCell align="right">{item.label}</TableCell>
                            <TableCell align="right">
                              <Switch
                                checked={Boolean(+item.isActive)}
                                onChange={(e) => handleSwitch(e, item)}
                              /></TableCell>
                            <TableCell align="center">
                              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                                <Button sx={buttonStyles} variant="contained" onClick={() => handleSubmenu(item.catUid, item.catName)}>زیرمنو</Button>
                                {(menuState.openSubMenu && item.catUid == menuState.currentCatUID) ? <SubMenu /> : ""}
                                <Button sx={buttonStyles} variant="contained" color="success" onClick={() => handleEdit(item.catUid, item.catName)}>ویرایش</Button>
                                {(menuState.openEdit && item.catUid == menuState.currentCatUID) ? <Edit /> : ""}
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
    </>
  );
};

export default connect(null, menu.actions)(withTranslation()(MaterialTable));