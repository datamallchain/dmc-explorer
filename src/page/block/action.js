import axios from "axios";
import { gpost } from "../../model/axios";

export const getInfo = sucCb => {
  axios
    .get("/v1/chain/get_info")
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {});
};

export const getBlock = (data, sucCb) => {
  axios
    .post("/v1/chain/get_block", data)
    .then(res => {
      if (!!res) {
        if (!!sucCb) {
          sucCb(res.data);
        }
      }
    })
    .catch(err => {});
};

export const getBlockTransaction = (
  data,
  page = 1,
  pagesize = 5,
  sucCb,
  countSucCb,
  config
) => {
  const reqMessage = { ...data };
  const params = `{
    find_dmc_transactions(
      order: "-createdAt"
            skip: ${(page - 1) * pagesize},
            limit: ${pagesize},
            where: {
                and:[
                    {
                      producer_block_id: "${reqMessage.id}"
                    },
                    {
                      and: [
                        {
                          contract_action: {
                            ne: "dmc/onblock",
                          }
                        }
                      ]
                    }
                ]
            },
    ){
      id
      producer_block_id
      trx_id
      rawData
      contract_action
      createdAt
      updatedAt
    }
  }`

  const count_params = `{
    count_dmc_transactions(
      where: {
        and:[
            {
              producer_block_id: "${reqMessage.id}"
            },
            {
              and: [
                {
                  contract_action: {
                    ne: "dmc/onblock",
                  }
                }
              ]
            }
        ]
      },
    )
  }`
  gpost(config.client.searchApi, params)
    .then(res => {
      if (res && res.find_dmc_transactions) {
        if (!!sucCb) {
          sucCb(res.find_dmc_transactions);
        }
      }
    })
    .catch(err => {});

  gpost(config.client.searchApi, count_params)
    .then(res => {
      if (res && res.count_dmc_transactions) {
        if (!!countSucCb) {
          countSucCb(res.count_dmc_transactions);
        }
      }
    })
    .catch(err => {});
};
