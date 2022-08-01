import axios from "axios";
import { message } from "antd";
import intl from 'react-intl-universal'

/* 随机秘钥 */

export const onCreateKey = (data, sucCb) => {
  axios
    .post("/1.0/app/token/createkey", {})
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {

    });
};

/* 账号创建 */
export const creatAccount = (data, sucCb) => {
  axios
    .post("/1.0/app/token/create", data)
    .then(res => {
      if (res.data.error) {
        message.error(intl.get('createfailwithreason') + res.data.error);
      } else {
        message.success(intl.get('createsuccess'));
        if (!!res) {
          if (!!sucCb) {
            sucCb(res);
          }
        }
      }
    })
    .catch(err => {
      message.error(intl.get('createfail'));
    });
};
