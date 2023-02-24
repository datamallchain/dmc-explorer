import axios from "axios";

/*  */

export const getAccount = (data, sucCb, failCb) => {
  axios
    .post("/v1/chain/get_account", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {
      if (!!failCb) {
        failCb();
      }
    });
};

export const getCoin = (data, sucCb) => {
  axios
    .post("/v1/chain/get_table_rows", data)
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
