import axios from 'axios';
import {config} from "../../config/config";

export const GET_ALL_LOGS = "GET_ALL_LOGS";


export function loadAllLogs(params, start, end,type) {
    return (dispatch) => {
        let url = config.logsUrls + '?query=' + params.join(' ') + '&start=' + start + '&end=' + end;
        axios.get(url, {crossdomain: true})
            .then(res => {
                let items = [];
                res.data.data.result.map(x => {
                    x.values.map(y => {
                        let workspace = y[1].match(/"workspace":"(\w+)"/g);
                        if (workspace !== null && workspace.length > 0) workspace = workspace[0].substr(1, workspace[0].length - 2).split('"').pop();

                        // let status_code = y[1].match(/<(\d+)>/g)
                        // if(status_code!==null && status_code.length > 0) status_code = parseInt(status_code[0].substr(1,status_code[0].length-2));

                        let time = y[1].match(/"timeZone":"(\d{4}-[01]\d-[0-3]\d [0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?)"/g)
                        if (time !== null && time.length > 0) {
                            time = time[0].substr(1, time[0].length - 2).split('"').pop();
                            time = new Date(time);
                        }

                        let type = y[1].match(/\:([^\:]+)\: ([^\{:}]+){/g)
                        let type_value = null;
                        if (type !== null && type.length > 0) {
                            type = type[0].substr(4, type[0].length - 6).split(':');
                            type_value = type[1];
                            type = type[0];
                        }
                        let raw_data = y[1].match(/{(.*?)}/g);
                        if (raw_data !== null) raw_data = JSON.parse(raw_data[0])

                        if(type === null){
                            let dd = y[1].match(/([^\=]+)\=(\w+)/g);
                            if(dd !== null && dd.length > 1){
                                type = dd[0].split('=')[1];
                                type_value = dd[1].split('=')[1];
                            }
                        }

                        if(time === null){
                            time = new Date();
                        }

                        let data = {};
                        data._id = y[0];
                        data.type = type;
                        data.workspace = workspace;
                        data.timeZone = time;
                        data.value = type_value;
                        data.data = raw_data;
                        data.raw = y[1];
                        items.push(data);
                    })
                })
                dispatch(setAllLogsData(items,type));
            }).catch(function (error) {
            if (error.response) {
            }
        });
    }
}

export function setAllLogsData(data,type) {
    return {
        type: GET_ALL_LOGS,
        allLogData: data,
        log_type: type
    }
}



