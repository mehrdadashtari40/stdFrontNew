import React, {useState, useEffect, useContext, Fragment} from 'react';
import {connect, shallowEqual, useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { post_custom_settings } from './../_redux/customSettingsCrud';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { withTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import * as customsettings from "../_redux/customSettingsRedux";
import { createTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useDropzone} from 'react-dropzone';
import {AppConfig} from '../../../appConfig';
import AccordionLinks from "./AccordionLinks";



const requireField = {
  loginPageAppTitle: false,
  loginPageOrgName: false
}

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
      width: '90%',
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
    padding:' 6px 50px',
    margin: "0 10px"
  },

  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  input: {
    display: "none !important",
  },
  fileUpload: {
    color: theme.palette.primary.light,
  },

}));



function CustomSettings(props) {
  const history = useHistory();
  const {apiServer,baseUrl,workspace} = useContext(AppConfig);
  const config = useContext(AppConfig);
  const bgURL = config.backgroundImage? (config.baseUrl +config.backgroundImage) : "../assets/img/login-bg.png";
  const logoURL = config.logoImage? (config.baseUrl + config.logoImage) : "../../../../assets/img/Asset%202.png";

  let customSettingsState = useSelector(state => state.customSettingsReducer);
  const dispatch = useDispatch();

 
  const disabledButton = false;
  let [disabled, setDisabled] = useState(false);
  let [usrUid, setUsrUid] = useState(null)
  const [selectedFiles,setSelectedFiles] = useState({
    backgroundImage:"",
    backgroundImageFile:"",
    backgroundImageURL:"",
    logoImage:"",
    logoImageURL:""
  });

  const [value, setValue] = React.useState('1');

  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let {loginPageAppTitle,loginPageOrgName,backgroundImage,logoImage, firstLink, secondLink}= useContext(AppConfig);
  let fetchData = {
    loginPageAppTitle: loginPageAppTitle,
    loginPageOrgName: loginPageOrgName,
    backgroundImage:backgroundImage,
    logoImage:logoImage,
    firstLink: firstLink,
    secondLink: secondLink
  }

  useEffect(async () => {
    try {
        props.handle_variables(fetchData);
    } catch (error) {
      toast.error(error.message);
    }

  }, []);
  // const updateState = data => {

  //   const allFieldsId = ['usr_username', 'usr_email', 'usr_firstname', 'usr_lastname', 'usr_fax', 'usr_phone', 'usr_cellular', 'usr_zip_code', 'usr_address'];
  //   allFieldsId.map(item => customSettingsState[item] = data[item]);
  //   dispatch((actions.handle_variables(customSettingsState)))
  // }

  const classes = useStyles();

  const handleCapture = ({ target }) => {
    setSelectedFiles({
      ...selectedFiles,
      [target.name]: target.files[0],
      [target.name+'URL']:URL.createObjectURL(target.files[0])
    });
  };
  
  const handleSubmit = async () => {
    if (allRequirePass()) {
      try {
        setDisabled(true);

        //login links
        let loginLinks = [];
        loginLinks.push({
          name: "firstLink",
          value: customSettingsState.firstLink,
        });
        loginLinks.push({
          name: "secondLink",
          value: customSettingsState.secondLink
        });

        //file data
        let fileData = new FormData();
        fileData.append('backgroundImage',selectedFiles.backgroundImage);
        fileData.append('logoImage',selectedFiles.logoImage);
        fileData.append('loginPageAppTitle',customSettingsState.loginPageAppTitle);
        fileData.append('loginPageOrgName',customSettingsState.loginPageOrgName);
        fileData.append('links', JSON.stringify(loginLinks));
        const resFile  =await post_custom_settings(apiServer,fileData);
        toast.success(props.t(resFile.data));
        setDisabled(false);
      } catch (error) {
        toast.error(error.message);
        setDisabled(false);
      }
    }
    else {
      toast.error(props.t('Please fill all required fields'));
    }
  }


  const allRequirePass = () => {
    for (let key in requireField) {
      if (requireField[key] && !customSettingsState[key]) {
        return false;
      }
    }
    return true
  }

  const handleOptions = () => {
    if (!showOptions){
      setShowOptions(true);
    }
  }


  return (
	  <>
    <Card>
		{/* <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <SettingsIcon />
          </Avatar>
        }
		
    	 title="تنظیمات سایت"
        // subheader="September 14, 2016"
      /> */}
      <main className={classes.layout}>
        <ThemeProvider theme={theme} >
          <React.Fragment>
	  <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop:'4%'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="تنظیمات صفحه ورود" value="1" sx={{ fontSize: '12px',fontFamily: 'IRANSans' }}/>
            {/* <Tab label="تنظیمات صفحات داخلی" value="2" sx={{ fontSize: '12px',fontFamily: 'IRANSans' }}/>
            <Tab label="طرح و رنگ" value="3" sx={{ fontSize: '12px',fontFamily: 'IRANSans' }}/> */}
          </TabList>
        </Box>
        <TabPanel value="1">
		<CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    value={customSettingsState.loginPageAppTitle}
                    error={!customSettingsState.loginPageAppTitle && requireField.loginPageAppTitle}
                    InputLabelProps={{ shrink: true }}
                    onInput={(e) => props.handle_variables({ loginPageAppTitle: e.target.value })}
                    required={requireField.loginPageAppTitle}
                    id="loginPageAppTitle"
                    name="loginPageAppTitle"
                    label="عنوان برنامه"
                    fullWidth
                    InputLabelProps={{
                      classes: { root: classes.labelRoot, shrink: classes.shrink }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    value={customSettingsState.loginPageOrgName}
                    onInput={(e) => props.handle_variables({ loginPageOrgName: e.target.value })}
                    required={requireField.loginPageOrgName}
                    id="loginPageOrgName"
                    name="loginPageOrgName"
                    label="نام سازمان"
                    fullWidth
                    InputLabelProps={{
                      classes: { root: classes.labelRoot, shrink: classes.shrink }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <p>تصویر پس زمینه صفحه ورود : </p>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="backgroundImage"
                    name="backgroundImage"
                    type="file"
                    onChange={handleCapture}
                  />
                  <Tooltip title="Select Image">
                  
                      <label htmlFor="backgroundImage">
                        <IconButton
                          className={classes.fileUpload}
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <CloudUploadIcon fontSize="large" sx={{marginLeft:'10px'}}/>
                          <span style={{fontSize:'12px',color:'black'}}>{selectedFiles.backgroundImage ? selectedFiles.backgroundImage.name : "انتخاب فایل"}. . .</span>
                        </IconButton>
                      </label>
                  
                  
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <img src={selectedFiles.backgroundImageURL || bgURL } width="120px"/>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <p>تصویر لوگوی صفحه ورود: </p>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="logoImage"
                    name="logoImage"
                    type="file"
                    onChange={handleCapture}
                  />
                  <Tooltip title="Select Image">
                      <label htmlFor="logoImage">
                        <IconButton
                          className={classes.fileUpload}
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <CloudUploadIcon fontSize="large" sx={{marginLeft:'10px'}}/>
                          <span style={{fontSize:'12px',color:'black'}}>{selectedFiles.logoImage ? selectedFiles.logoImage.name : "انتخاب فایل"}. . .</span>
                        </IconButton>
                      </label>
                  
                  
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <img src={selectedFiles.logoImageURL || logoURL} width="80px"/>
                </Grid>

                <Grid item xs={12}>

                  <AccordionLinks linksOrder="first"/>
                  <br/>
                  <AccordionLinks linksOrder="second"/>
                  <br/>

                  <Button
                    onClick={() => handleSubmit()}
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.buttons}
                    disabled={disabled}
                  >
                    {props.t('Submit')}
                  </Button>

                </Grid>

              </Grid>
            </CardContent>
         
		</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>


             </React.Fragment>
        </ThemeProvider>
      </main>
    </Card>
      </>
  );
}

export default connect(null, customsettings.actions)(withTranslation()(CustomSettings));
