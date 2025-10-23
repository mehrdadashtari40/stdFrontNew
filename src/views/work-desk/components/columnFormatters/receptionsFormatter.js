import React from "react";

export const receptionsFormatter = (cellContent, row) => {
  let resultText = "";
  if (!row?.receptions) {
    resultText = "همه";
  } else {
    const namesObj = JSON.parse(row?.receptions);
    //console.log("nameObj", namesObj);
    namesObj.map((el,idx) => {
      if(idx === namesObj.length - 1){
        resultText = resultText + `${el.username}`
      }else{
        resultText = resultText + `${el.username}, `
      }
    });
  }
  return resultText;
};
