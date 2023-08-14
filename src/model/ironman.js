import { message } from 'antd'
import Dmc from 'dmc.js'
import intl from "react-intl-universal";

export const loginIronman = (sucCb, noIronman, config) => {
  if (!window.dmcironman) {
    if (!!noIronman) {
      noIronman()
    } else {
      message.info(intl.get("checkplugintip1"))
      // window.open('https://wallet.dmc/')
    }
  } else {
    const ironman = window.dmcironman
    const hostname = new URL(config.client.hostname).hostname
    const blockchain = config.client.blockchain

    // 
    // window.dmcironman = null;
    // If you want to require a specific version of Scatter
    const dmcNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
      host: hostname,
      port: config.client.port,
      protocol: config.client.protocol,
    }

    const RequiredmcNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
    }
    ironman
      .getIdentity({
        accounts: [RequiredmcNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        // DMC
        const dmcOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }
        // DMC instance
        // const dmc = ironman.dmc(() =>{
        //     return dmcNetwork, Dmc, dmcOptions, "http"
        // })

        const dmc = ironman[blockchain](dmcNetwork, Dmc, dmcOptions, config.client.protocol)
        const requiredFields = {
          accounts: [dmcNetwork],
        }

        if (sucCb) {
          sucCb(ironman, dmc, requiredFields, account, dmcNetwork, identity)
        }
      })
      .catch(e => {
        // TODO
      })
  }
}

export function logoutIronman(sucCb) {
  const ironman = window.dmcironman
  if (sucCb) {
    sucCb()
  }
  if (ironman) {
    try {
      ironman
        .forgetIdentity()
        .then(value => {
          window.location.reload()
        })
        .catch(e => {
          window.location.reload()
        })
    } catch {
      window.location.reload()
    }
  } else {
    window.location.reload()
  }
}

export function loadIronman(sucCb, config) {
  if (!window.dmcironman) {
    message.info(intl.get("checkplugintip1"))
    // window.open('https://wallet.dmc/')
  } else {
    const hostname = new URL(config.client.hostname).hostname
    const ironman = window.dmcironman
    const blockchain = config.client.blockchain
    // 
    // window.dmcironman = null;
    // If you want to require a specific version of Scatter
    const dmcNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
      host: hostname,
      port: config.client.port,
      protocol: config.client.protocol,
    }

    const RequiredmcNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
    }

    ironman
      .getIdentity({
        accounts: [RequiredmcNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        // 
        const dmcOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }

        // DMC instance
        const dmc = ironman[blockchain](dmcNetwork, Dmc, dmcOptions, config.client.protocol)
        const requiredFields = {
          accounts: [dmcNetwork],
        }

        if (sucCb) {
          sucCb(ironman, dmc, requiredFields, account, dmcNetwork, identity)
        }
      })
      .catch(e => {
        // TODO
      })
  }
}
