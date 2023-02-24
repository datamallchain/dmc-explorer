import axios from 'axios'

import { message } from 'antd'
import intl from 'react-intl-universal'

export const getProducers = (data, sucCb) => { 
    axios.post('/v1/chain/get_table_rows',data)
    .then(res => {
      if(!!res){
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {
      message.error(intl.get('fail'));
    })
}

export const getVoteWeight = (data, sucCb) => { 
  axios.post('/v1/chain/get_table_rows',data)
  .then(res => {
    if(!!res){
      if (!!sucCb) {
        sucCb(res.data);
      }
    }
  })
  .catch(err => {
    message.error(intl.get('fail'));
  })
}