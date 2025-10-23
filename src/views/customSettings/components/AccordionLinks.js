import React, {useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import {StylesProvider} from '@mui/material'
import {AppConfig} from "../../../appConfig";
import {useContext} from "react";
import {connect, useSelector} from "react-redux";
import * as customsettings from "../_redux/customSettingsRedux";
import {withTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import Grid from '@mui/material/Grid';
import {GithubPicker} from "react-color";


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

function AccordionLinks(props) {
    const {linksOrder} = props;
    const classes = useStyles();
    const [displayBackPicker, setDisplayBackPicker] = useState(false);
    const [displayFontPicker, setDisplayFontPicker] = useState(false);

    let customSettingsState = useSelector(state => state.customSettingsReducer);
    let linkFlag = 1;
    if (linksOrder == "first"){
        customSettingsState = customSettingsState.firstLink;
        linkFlag = 1;
    }
    else if (linksOrder == "second") {
        customSettingsState = customSettingsState.secondLink;
        linkFlag = 2;
    }

    const handleClickBack = () => {
        setDisplayBackPicker(!displayBackPicker);
    }
    const handleClickFont = () => {
        setDisplayFontPicker(!displayFontPicker);
    }

    const handleClose = () => {
        setDisplayBackPicker(false);
        setDisplayFontPicker(false);
    }

    const popover = {
        position: 'absolute',
        zIndex: '2',
    }

    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }


    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography
                        fontFamily='IRANSans'
                        fontSize='13px'
                    >تعیین ورودی های لینک: {customSettingsState.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="standard"
                                value={customSettingsState.title}
                                onInput={(e) => props.handle_variables(linkFlag == 1 ? ({ firstLink: { ...customSettingsState, title: e.target.value }}) : ({ secondLink: { ...customSettingsState, title: e.target.value }}))}
                                label="عنوان لینک"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    classes: { root: classes.labelRoot, shrink: classes.shrink }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="standard"
                                value={customSettingsState.url}
                                onInput={(e) => props.handle_variables(linkFlag == 1 ? ({ firstLink: { ...customSettingsState, url: e.target.value }}) : ({ secondLink: { ...customSettingsState, url: e.target.value }}))}
                                label="آدرس لینک"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    classes: { root: classes.labelRoot, shrink: classes.shrink }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div>
                                <TextField
                                    variant="standard"
                                    onClick={handleClickBack}
                                    autoComplete='off'
                                    value={customSettingsState.backColor}
                                    onInput={(e) => props.handle_variables(linkFlag == 1 ? ({ firstLink: { ...customSettingsState, backColor: e.target.value }}) : ({ ...customSettingsState, backColor: e.target.value }))}
                                    label="رنگ پس زمینه لینک"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: { root: classes.labelRoot, shrink: classes.shrink }
                                    }}
                                />
                                { displayBackPicker ? <div style={ popover }>
                                    <div style={ cover } onClick={ handleClose }/>
                                    <GithubPicker
                                        color={ customSettingsState.backColor }
                                        onChangeComplete={ (color) => props.handle_variables(linkFlag == 1 ? ({ firstLink: { ...customSettingsState, backColor: color.hex }}) : ({ secondLink: { ...customSettingsState, backColor: color.hex }})) }
                                    />
                                </div> : null }
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <div>
                                <TextField
                                    variant="standard"
                                    onClick={handleClickFont}
                                    autoComplete='off'
                                    value={customSettingsState.fontColor}
                                    onInput={(e) => props.handle_variables(linkFlag == 1 ? ({ firstLink: { ...customSettingsState, fontColor: e.target.value }}) : ({ secondLink: { ...customSettingsState, fontColor: e.target.value }}))}
                                    label="رنگ متن لینک"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: { root: classes.labelRoot, shrink: classes.shrink }
                                    }}
                                />
                                { displayFontPicker ? <div style={ popover }>
                                    <div style={ cover } onClick={ handleClose }/>
                                    <GithubPicker
                                        color={ customSettingsState.fontColor }
                                        onChangeComplete={ (color) => props.handle_variables(linkFlag == 1 ? ({ firstLink: { ...customSettingsState, fontColor: color.hex }}) : ({ secondLink: { ...customSettingsState, fontColor: color.hex }})) }
                                    />
                                </div> : null }
                            </div>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default connect(null, customsettings.actions)(withTranslation()(AccordionLinks));