
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Actions from '../trelloActions';
import { updateFiles} from "../trelloCrud";
import { AppConfig} from "../../../appConfig";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";




const img = {
  display: 'block',
  width:'95%'
};

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: "20px"
  },

}));

function Attachments(props) {
  const { apiServer,baseUrl } = React.useContext(AppConfig);
  const classes = useStyles();


  const handleInsert = () => {

  }

  const handleremove = (index) => {
    let oldFiles = [...props.files];
    let newFiles = props.files.filter((item, ind) => ind != index);
    props.change_variable('files',newFiles);
    let data = {
      "task_code" : props.current_task_code,
      "files" : newFiles
    }
    updateFiles(apiServer,data)
        .then(() => {
        })
        .catch(err => {
          props.change_variable('files',oldFiles);
        })
  }


  return (
      <Card sx={{boxShadow:"0px 0px 9px 5px rgb(126 126 153 / 20%)", margin:"10px 0"}}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{fontFamily:"IRANSans"}}>
            پیوست ها
          </Typography>
          <List sx={{width: '100%', bgcolor: 'background.paper', fontSize: "14px"}}>
            {props.files && props.files.map((file, index) => {
              const labelId = `files-label-${index}`;

              return (
                  <ListItem
                      key={index}
                      disablePadding
                      divider
                  >
                    {

                        <img
                            src={baseUrl +"bpmsback/" + file}
                            style={img}
                        />

                    }
                    <IconButton
                        name={index}
                        sx={{fontSize: '24px'}}
                        onClick={() => handleremove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
              );
            })}

            {/*<Button*/}
            {/*    variant="contained"*/}
            {/*    sx={{fontFamily: "IRANSans", marginRight: "20px", float: 'left',margin: '10px 0'}}*/}
            {/*    onClick={handleInsert}*/}
            {/*>*/}
            {/*  افزودن فایل*/}
            {/*</Button>*/}
          </List>
        </CardContent>
      </Card>
  );
}

export default compose(
  withTranslation(),
  connect(state => state.trello, Actions)
)(Attachments);