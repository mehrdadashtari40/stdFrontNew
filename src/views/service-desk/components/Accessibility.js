import * as React from 'react';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect, useSelector} from "react-redux";
import * as service from "../_redux/serviceDeskRedux";
import { Backdrop } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
// import './styles.css';
import "./user-way.css"
import wheelSvg from "./wheel_left_wh.svg";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

};


function Accessibility(props) {
    const {accessibilityFontSize} = useSelector(state => state.ServiceDesk);
    const [open, setOpen] = React.useState(false);

    const handleOpen = ()=>{
        setOpen(true);
    }
    const handleClose = () =>{
        setOpen(false);
    }
    const handleIncrease=()=>{
        accessibilityFontSize == 4 ?
            props.handle_variables({accessibilityFontSize: 0}) :
            props.handle_variables({accessibilityFontSize: accessibilityFontSize + 1})
    }

    return(
        <div>
            <img onClick={handleOpen} src={wheelSvg} className="btnAccessibility"/>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{fontFamily:'IRANSans,Tahoma', fontsize:"16px"}}>
                            منو دستیابی
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            <div className={`btnUserWay ${accessibilityFontSize >= 1 ? "selectedModal" : null}`} id="increaseFont" onClick={handleIncrease}>
                                <div className="iconUserWay">
                                    <div className="svg-sprite icon-btext_5 icon-btext_5-dims" />
                                </div>
                                <span className="text"> متن بزرگتر</span>
                                <div className={`steps ${accessibilityFontSize >= 1 ? "stepsVisible" : null}`}>
                                    <div className={`step-1 ${accessibilityFontSize >= 1? "fillStep":null}`} />
                                    <div className={`step-2 ${accessibilityFontSize >= 2? "fillStep":null}`} />
                                    <div className={`step-3 ${accessibilityFontSize >= 3? "fillStep":null}`} />
                                    <div className={`step-4 ${accessibilityFontSize >= 4? "fillStep":null}`} />
                                </div>
                            </div>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default compose(withTranslation(), connect(null, service.actions))(Accessibility);