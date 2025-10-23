import React, {useState, useEffect, useContext} from "react";
import { connect, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import * as menu from "../_redux/menuRedux";
import { withTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal';
import { get_categories_details, post_categories_update } from "../_redux/menuCrud";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BeatLoader, GridLoader } from "react-spinners";
import {AppConfig} from "../../../appConfig";


const Edit = (props) => {
  const {apiServer} = useContext(AppConfig);
  let menuState = useSelector(state => state.menuReducer);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoriesDetails, setCategoriesDetails] = useState({
    catUid: "",
    catName: "",
    isActive: "",
    icon: "",
    sortOrder: "",
    labels: {}
  })

  const theme = createTheme({
    direction: 'rtl',
  });



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
    height: '265px',
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
      let receive = await get_categories_details(apiServer,menuState.currentCatUID);
      setCategoriesDetails(receive)
      setLoading(false)
    } catch (err) {
      toast.error(props.t("Error"))
      setLoading(false);
      props.handle_variables('openEdit', false)
    }

  }, [])

  //Change the style due to a problem when pressing the back button
  useEffect(() => {
    let buttonElement = document.querySelectorAll('.MuiButton-root');
    for(let i=0; i< buttonElement.length;i++){
      buttonElement[i].classList.remove("MuiButtonBase-root");
    }
  })

  const handleClose = () => {
    props.handle_variables("openEdit", false)
  }

  const handleInput = e => {
    if (e.target.name === "icon")
      setCategoriesDetails({ ...categoriesDetails, icon: e.target.value });
    else {
      let obj = Object.assign({}, categoriesDetails);
      obj.labels[e.target.name] = e.target.value;
      setCategoriesDetails(obj);
    }
  }


  const handleSubmit = e => {
    setDisabled(true)

    post_categories_update(apiServer,menuState.currentCatUID, categoriesDetails)
      .then(() => {
        //update data table
        let updateListItem = { ...categoriesDetails };
        updateListItem.label = updateListItem.labels.fa !== undefined ? updateListItem.labels.fa : "";
        delete updateListItem.labels;
        let temp = [...menuState.categoriesList];
        let changeItemIndex = temp.findIndex((element) => element.catUid == menuState.currentCatUID);
        temp.splice(changeItemIndex, 1, updateListItem);

        props.handle_variables("categoriesList", temp)
        props.handle_variables("openEdit", false)
        props.handle_refresh_menu();
      })
      .catch(res => toast.error(props.t("Error")))
      .finally(() => setDisabled(false))
  }
  return (

    <Modal
      open={menuState.openEdit}
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

                        value={categoriesDetails.catName}
                        InputLabelProps={{ shrink: true }}
                        onInput={(e) => handleInput(e)}
                        required={true}
                        id="catName"
                        name="catName"
                        label="دسته بندی"
                        fullWidth
                        disabled
                        InputLabelProps={{
                          classes: { root: classes.labelRoot, shrink: classes.shrink }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={categoriesDetails.icon}
                        required={false}
                        onInput={(e) => handleInput(e)}
                        id="icon"
                        name="icon"
                        label="آیکن"
                        fullWidth
                        InputLabelProps={{
                          classes: { root: classes.labelRoot, shrink: classes.shrink }
                        }}
                      />
                    </Grid>

                    {menuState.activeLanguages.map(mapItem =>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={categoriesDetails.labels[mapItem.name]}
                          InputLabelProps={{ shrink: true }}
                          onInput={(e) => handleInput(e)}
                          required={false}
                          id={mapItem.name}
                          name={mapItem.name}
                          label={props.t('Alias') + '-' + props.t(mapItem.name)}
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

export default connect(null, menu.actions)(withTranslation()(Edit));