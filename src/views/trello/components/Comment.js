import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import {makeStyles} from '@mui/styles';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import {compose} from 'redux';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import * as Actions from '../trelloActions';
import {postCheckListAndComments} from "../trelloCrud";
import {AppConfig} from "../../../appConfig";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';




const useStyles = makeStyles((theme) => ({
    root: {
        fontSize: "20px"
    },

}));

function Comment(props) {
    const {apiServer} = React.useContext(AppConfig);
    const classes = useStyles();
    const [comments, setComments] = React.useState([]);
    const [editIndex, setEditIndex] = React.useState(-1);
    const textareaEl = React.useRef(null);


    React.useEffect(() => {
        if (props.current_task.comments !== undefined && props.current_task.comments !== null && props.current_task.comments.length > 0) {
            setComments(props.current_task.comments);
        }
    }, [props.current_task.comments])


    //text-decoration: line-through;
    const handleInsert = () => {
        let newItemText = textareaEl.current.value;
        let oldComment = [...comments];
        let newComment = [];
        if (newItemText) {
            if (editIndex === -1)
                newComment = [...comments, newItemText];
            else {
                newComment = [...comments];
                newComment[editIndex] = newItemText;
            }
            setComments(newComment);
            textareaEl.current.value = "";
            postCheckListAndComments(apiServer, props.current_task_code, "comment", [...newComment])
                .then(() => {
                    setEditIndex(-1);
                })
                .catch(err => {
                    setComments(oldComment);
                    textareaEl.current.value = newItemText;
                })
        }
    }

    const handleremove = (index) => {
        let oldComment = [...comments];
        let newComment = comments.filter((item, ind) => ind != index);
        setComments(newComment);
        postCheckListAndComments(apiServer, props.current_task_code, "comment", [...newComment])
            .then(() => {
            })
            .catch(err => {
                setComments(oldComment);
            })
    }

    const handleEdit = index => {
        setEditIndex(index);
        textareaEl.current.value = comments[index];
    }

    return (
        <Card sx={{boxShadow:"0px 0px 9px 5px rgb(126 126 153 / 20%)", margin:"10px 0"}}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{fontFamily:"IRANSans"}}>
                    یادداشت ها
                </Typography>
                    <List sx={{width: '100%', bgcolor: 'background.paper', fontSize: "14px"}}>
                        {comments && comments.map((value, index) => {
                            const labelId = `checkbox-list-label-${index}`;

                            return (
                                <ListItem
                                    key={index}
                                    disablePadding
                                    divider
                                >
                                    <ListItemButton role={undefined} dense>
                                        <ListItemIcon>
                                            <i className="far fa-comment-alt"></i>
                                        </ListItemIcon>
                                        <ListItemText
                                            id={labelId}
                                            sx={{textAlign: "right", fontSize: "12px"}}
                                            primary={`${value}`}
                                        />
                                    </ListItemButton>
                                    <IconButton
                                        name={index}
                                        onClick={() => handleEdit(index)}
                                    >
                                        <i className="fas fa-edit" style={{fontSize:'12px'}}></i>
                                    </IconButton>
                                    <IconButton
                                        name={index}
                                        sx={{fontSize: '24px'}}
                                        onClick={() => handleremove(index)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItem>
                            );
                        })}
                        <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder="یادداشت جدید..."
                            style={{width: '100%',marginTop:"10px"}}
                            ref={textareaEl}
                        />
                        <Button
                            variant="contained"
                            sx={{fontFamily: "IRANSans", marginRight: "20px", float: 'left',margin: '10px 0'}}
                            onClick={handleInsert}
                        >
                            ثبت یادداشت
                        </Button>
                    </List>
            </CardContent>
        </Card>

    );
}

export default compose(
    withTranslation(),
    connect(state => state.trello, Actions)
)(Comment);