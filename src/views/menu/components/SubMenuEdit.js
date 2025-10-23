import React, {useState, useEffect, useContext} from "react";
import { connect, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import * as menu from "../_redux/menuRedux";
import { withTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal';
import { get_task_details, post_task_update } from "../_redux/menuCrud";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { GridLoader } from "react-spinners";
import {AppConfig} from "../../../appConfig";


const SubMenuEdit = (props) => {
  const {apiServer} = useContext(AppConfig);
  let menuState = useSelector(state => state.menuReducer);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskDetails, setTaskDetails] = useState({})

  const theme = createTheme({
    direction: 'rtl',
  });

  //Change the style due to a problem when pressing the back button
  useEffect(() => {
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
        width: '80%',
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
    width: '65%',
    height: '335px',
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
    fontSize: '14px',
    padding: ' 4px 45px',
    marginRight: "20px",
    fontSize: '16px',
    fontFamily: 'IRANSans'
  }
  const classes = useStyles();


  useEffect(async () => {
    try {
      let receive = await get_task_details(apiServer,menuState.currentTasUid);
      setTaskDetails(receive);
      setLoading(false)
    } catch (err) {
      toast.error(props.t("Error"))
      setLoading(false)
    }
  }, [])

  const handleClose = () => {
    props.handle_variables("openSubMenuEdit", false)
  }

  const handleInput = e => {

    let temp = { ...taskDetails };
    if(e.target.id.includes("label"))
      temp.labels[e.target.name] = e.target.value;
    if(e.target.id.includes("description"))
      temp.descriptions[e.target.name] = e.target.value;
    setTaskDetails(temp);
  }

  const handleSubmit = e => {
    setDisabled(true)
    post_task_update(apiServer,menuState.currentTasUid, { ...taskDetails, 'catUid': menuState.currentCatUID })
      .then(() => {
        let updateListItem = { ...taskDetails };
        updateListItem.label = updateListItem.labels.fa !== undefined ? updateListItem.labels.fa : "";
        updateListItem.proUID = updateListItem.proUid;
        delete updateListItem.labels;
        delete updateListItem.proUid;
        let temp = [...menuState.processList];
        let changeItemIndex = temp.findIndex((element) => element.tasUid == menuState.currentTasUid);
       
        temp.splice(changeItemIndex, 1, updateListItem);
        props.handle_variables("processList", temp)
        props.handle_variables("openSubMenuEdit", false);
        props.handle_refresh_menu();
      })
      .catch(() =>toast.error(props.t("Error")))
      .finally(() => setDisabled(false))
  }
  return (

    <Modal
      open={menuState.openSubMenuEdit}
      onClose={handleClose}
    >
      <Card style={cardStyle}>
        <main className={classes.layout}>
          <ThemeProvider theme={theme} >
            <React.Fragment>

              <Typography variant="h4" gutterBottom style={{ 'margin-top': '3%' }}>
                ویرایش
              </Typography>
              {loading ? <div style={loadStyle}><GridLoader color={"#45a5bf"} /></div> :
                <CardContent>
                  <Grid container spacing={3}>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={taskDetails.proTitle}
                        InputLabelProps={{ shrink: true }}
                        onInput={(e) => handleInput(e)}
                        required={true}
                        id="proTitle"
                        name="proTitle"
                        label="نام فرآیند"
                        fullWidth
                        disabled
                        InputLabelProps={{
                          classes: { root: classes.labelRoot, shrink: classes.shrink }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={taskDetails.tasTitle}
                        InputLabelProps={{ shrink: true }}
                        onInput={(e) => handleInput(e)}
                        required={true}
                        id="tasTitle"
                        name="tasTitle"
                        label="نام وظیفه"
                        fullWidth
                        disabled
                        InputLabelProps={{
                          classes: { root: classes.labelRoot, shrink: classes.shrink }
                        }}
                      />
                    </Grid>
                    {menuState.activeLanguages.map(mapItem =>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={taskDetails.labels[mapItem.name]}
                          InputLabelProps={{ shrink: true }}
                          onInput={(e) => handleInput(e)}
                          required={false}
                          id={'label' + mapItem.name}
                          name={mapItem.name}
                          label={props.t('Alias') + '-' + props.t(mapItem.name)}
                          fullWidth
                          InputLabelProps={{
                            classes: { root: classes.labelRoot, shrink: classes.shrink }
                          }}
                        />
                      </Grid>
                    )}
                    
                    {menuState.activeLanguages.map(mapItem =>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={taskDetails.descriptions[mapItem.name]}
                          InputLabelProps={{ shrink: true }}
                          onInput={(e) => handleInput(e)}
                          required={false}
                          id= {'description' + mapItem.name}
                          name= {mapItem.name}
                          label={props.t('Description') + '-' + props.t(mapItem.name)}
                          fullWidth
                          InputLabelProps={{
                            classes: { root: classes.labelRoot, shrink: classes.shrink }
                          }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>

                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={buttonStyles}
                        onClick={() => handleClose()}
                      >
                        انصراف
                      </Button>
                      <Button
                        onClick={() => handleSubmit()}
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={buttonStyles}
                        disabled={disabled}
                      >
                        ثبت
                      </Button>

                    </Grid>

                  </Grid>
                </CardContent>}
            </React.Fragment>
          </ThemeProvider>
        </main>
      </Card>

    </Modal>
  )
}

export default connect(null, menu.actions)(withTranslation()(SubMenuEdit));