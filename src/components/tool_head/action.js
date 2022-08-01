import axios from 'axios'
import intl from 'react-intl-universal'

import { message } from 'antd'

export const getAccount = (data, sucCb) =>{
    axios.post('/v1/chain/get_account', data)
    .then(res => {
      if(!!res){
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {
      message.error(intl.get('noaccount'));
    })
}


/* 获取持有代币 */
export const getPermissions = (data,sucCb) => {
    axios.post('/v1/chain/get_table_rows', data )
    .then(res => {
      if(!!res){
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {
      message.error(intl.get('getcoinerror'));
    })
}