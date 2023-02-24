import axios from "axios";
import intl from "react-intl-universal";
import { gpost } from "../../model/axios";

import { message } from "antd";

/*  */
export const getPermissions = (data, sucCb) => {
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
      message.error(intl.get("getcoinerror"));
    });
};

/* action */
export const getActions = (data, sucCb) => {
  axios
    .post("/v1/history/get_actions", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {
      message.error(intl.get("getactionerror"));
    });
};

export const getTokenActions = (
  data,
  page = 1,
  pagesize = 5,
  sucCb,
  countSucCb,
  config
) => {
  const reqMessage = { ...data };
  const params = `{
    find_tokens_action(
      order: "-id"
            skip: ${(page - 1) * pagesize},
            limit: ${pagesize},
            where: {
                and:[
                    {
                      or:[
                        {
                          account_from_id: "${reqMessage.account}"
                        },
                        {
                          account_to_id: "${reqMessage.account}"
                        }
                      ]
                    }
                ]
            },
    ){
      account_from{
        id
      }
      account_to{
        id
      }
      contract_action
      action{
        rawData
      }
      token_from{
        token_name
        token_type
        token_status
      }
      token_to{
        token_name
        token_type
        token_status
      }
      id
    }
  }`;
  const count_params = `{
    count_tokens_action(
      where: {
        and:[
            {
              or:[
                {
                  account_from_id: "${reqMessage.account}"
                },
                {
                  account_to_id: "${reqMessage.account}"
                }
              ]
            }
        ]
      },
    )
  }`;
  gpost(config.client.searchApi, params)
    .then(res => {
      if (res && res.find_tokens_action) {
        if (!!sucCb) {
          sucCb(res.find_tokens_action);
        }
      }
    })
    .catch(err => { });

  gpost(config.client.searchApi, count_params)
    .then(res => {
      if (res && res.count_tokens_action) {
        if (!!countSucCb) {
          countSucCb(res.count_tokens_action);
        }
      }
    })
    .catch(err => { });
};

export const getAccount = (data, sucCb) => {
  axios
    .post("/v1/chain/get_account", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => { });
};
