import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Actions from '../trelloActions';
import { postCheckListAndComments } from "../trelloCrud";
import { AppConfig } from "../../../appConfig";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";


const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: "20px"
  },

}));

function CheckList(props) {
  const { apiServer } = React.useContext(AppConfig);
  const classes = useStyles();
  const [checkLists, setCheckLists] = React.useState([]);
  const textareaEl = React.useRef(null);


  React.useEffect(() => {
     if (props.current_task.checklists !== undefined && props.current_task.checklists !== null && props.current_task.checklists.length > 0){
      setCheckLists(props.current_task.checklists[0]);
    } 
  },[props.current_task.checklists])

  const handleToggle = (index) => () => {
    const oldCheckList = [...checkLists];
    const newCheckList = [...checkLists];
    let item = newCheckList[index];
    newCheckList[index].checked = !newCheckList[index].checked;
    setCheckLists(newCheckList);
    postCheckListAndComments(apiServer, props.current_task_code, "checklist", [[...newCheckList]])
        .then(() => {
        })
        .catch(err => {
          setCheckLists(oldCheckList);
        })
  }


  //text-decoration: line-through;
  const handleInsert = () => {
    let newItemText = textareaEl.current.value;
    if (newItemText) {
      let oldCheckList = [...checkLists];
      let newCheckList = [...checkLists, { content: newItemText, checked: false }];
      setCheckLists(newCheckList);
      textareaEl.current.value = "";
      postCheckListAndComments(apiServer, props.current_task_code, "checklist", [[...newCheckList]])
        .then(() => {
        })
        .catch(err => {
          setCheckLists(oldCheckList);
          textareaEl.current.value = newItemText;
        })
    }
  }

  const handleremove = (index) => {
    let oldCheckList = [...checkLists];
    let newCheckList = checkLists.filter((item, ind) => ind != index);
    setCheckLists(newCheckList);
    postCheckListAndComments(apiServer, props.current_task_code, "checklist", [[...newCheckList]])
    .then(() => {
    })
    .catch(err => {
      setCheckLists(oldCheckList);
    })
  }

  return (
      <Card sx={{boxShadow:"0px 0px 9px 5px rgb(126 126 153 / 20%)", margin:"10px 0"}}>
          <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{fontFamily:"IRANSans"}}>
                  لیست آیتم ها
              </Typography>
              <List sx={{width: '100%', bgcolor: 'background.paper', fontSize: "14px"}}>
                  {checkLists && checkLists.map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;

                    return (
                      <ListItem
                        key={index}
                        disablePadding
                        divider
                      >
                        <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={value.checked}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={labelId}
                            sx={{ textAlign: "right", fontSize: "12px" }}
                            primary={`${value.content}`}
                          />
                        </ListItemButton>
                        <IconButton
                          name={index}
                          sx={{ fontSize: '24px' }}
                          onClick={() => handleremove(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    );
                  })}
                  <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="آیتم جدید ..."
                      style={{width: '100%',marginTop:"10px"}}
                      ref={textareaEl}
                  />
                  <Button
                      variant="contained"
                      sx={{fontFamily: "IRANSans", marginRight: "20px", float: 'left',margin: '10px 0'}}
                      onClick={handleInsert}
                  >
                      افزودن آیتم جدید
                  </Button>
              </List>
          </CardContent>
      </Card>

  );
}

export default compose(
  withTranslation(),
  connect(state => state.trello, Actions)
)(CheckList);