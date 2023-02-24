import axios from 'axios'
import { message } from 'antd'
import intl from 'react-intl-universal'

/* */
export const getreward = (data, sucCb) => {
  axios
    .post('/1.0/app/user/getreward', data)
    .then(res => {
      if (res.data.code === 0) {
        message.success(intl.get('getsuccess') + '100')
      } else {
        message.error(intl.get('geterror'))
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb()
        }
      }
    })
    .catch(err => {
      message.error(intl.get('goterror'))
    })
}

/* */
export const getrewardFod = (data, sucCb) => {
  axios
    .post('/1.0/app/user/getfod', data)
    .then(res => {
      if (res.data.code === 0) {
        message.success(intl.get('getsuccess') + '10000')
      } else {
        message.error(intl.get('geterror'))
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb()
        }
      }
    })
    .catch(err => {
      message.error(intl.get('goterror'))
    })
}

export const getrewardCny = (data, sucCb) => {
  axios
    .post('/1.0/app/user/getcny', data)
    .then(res => {
      if (res.data.code === 0) {
        message.success(intl.get('getsuccess') + '10000')
      } else {
        message.error(intl.get('geterror'))
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb()
        }
      }
    })
    .catch(err => {
      message.error(intl.get('goterror'))
    })
}

export const getrewardfoeth = (data, sucCb) => {
  axios
    .post('/1.0/app/user/getfoeth', data)
    .then(res => {
      if (res.data.code === 0) {
        message.success(intl.get('getsuccess') + '10000')
      } else {
        message.error(intl.get('geterror'))
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb()
        }
      }
    })
    .catch(err => {
      message.error(intl.get('goterror'))
    })
}

export const getrewardfousdk = (data, sucCb) => {
  axios
    .post('/1.0/app/user/getfousdk', data)
    .then(res => {
      if (res.data.code === 0) {
        message.success(intl.get('getsuccess') + '10000')
      } else {
        message.error(intl.get('geterror'))
      }
      if (!!res) {
        if (!!sucCb) {
          sucCb()
        }
      }
    })
    .catch(err => {
      message.error(intl.get('goterror'))
    })
}
