import React, {useState, useEffect, useContext} from 'react';
import { connect } from 'react-redux';
import MaterialTable from "./MaterialTable";
import { Container, Paper, Typography } from "@mui/material";
import { get_categories, get_actives_languages } from "../_redux/menuCrud"
import * as menu from "../_redux/menuRedux";
import { withTranslation } from 'react-i18next';
import { GridLoader } from "react-spinners";
import { toast } from 'react-toastify';
import {AppConfig} from "../../../appConfig";

function Menu(props) {
  const {apiServer} = useContext(AppConfig);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    try{
      let receiveData = await get_categories(apiServer);
      receiveData = receiveData.sort((a, b) => a.sortOrder - b.sortOrder);
      props.handle_variables('categoriesList', receiveData)
      setLoading(false)
      const data = await get_actives_languages(apiServer);
      props.handle_variables('activeLanguages', data);
    }catch(error){
        toast.error(props.t("Error"));
    }
    
  }, []);


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }

  return (
    <div style={{ height: "100vh" }}>
      <Container >
        {loading ?
          <div style={style} >
            <GridLoader color={"#45a5bf"} />
          </div> :
          <Paper style={{ padding: 10 }}>
            <Typography variant="h4" align="center">
              تنظیمات منو <br /><br />
            </Typography>
            <MaterialTable />
          </Paper>
        }

      </Container>
    </div>
  );
}
export default connect(null, menu.actions)(withTranslation()(Menu));