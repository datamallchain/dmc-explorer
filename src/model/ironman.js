import { message } from 'antd'
import Dmc from 'dmc.js'
import Fibos from 'fibos.js'
import intl from "react-intl-universal";

export const loginIronman = (sucCb, noIronman, config) => {
  if (!window.dmcironman) {
    if (!!noIronman) {
      noIronman()
    } else {
      message.info(intl.get("checkplugintip1"))
      // window.open('https://wallet.fo/')
    }
  } else {
    const ironman = window.dmcironman
    const hostname = new URL(config.client.hostname).hostname
    const blockchain = config.client.blockchain

    // 
    // window.dmcironman = null;
    // If you want to require a specific version of Scatter
    const foNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
      host: hostname,
      port: config.client.port,
      protocol: config.client.protocol,
    }

    const RequirefoNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
    }
    ironman
      .getIdentity({
        accounts: [RequirefoNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        // FO
        const foOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }
        // FO instance
        // const fo = ironman.fibos(() =>{
        //     return foNetwork, Fibos, foOptions, "http"
        // })

        const fo = ironman[blockchain](foNetwork, Dmc, foOptions, config.client.protocol)
        const requiredFields = {
          accounts: [foNetwork],
        }

        if (sucCb) {
          sucCb(ironman, fo, requiredFields, account, foNetwork, identity)
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
    // window.open('https://wallet.fo/')
  } else {
    const hostname = new URL(config.client.hostname).hostname
    const ironman = window.dmcironman
    const blockchain = config.client.blockchain
    // 
    // window.dmcironman = null;
    // If you want to require a specific version of Scatter
    const foNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
      host: hostname,
      port: config.client.port,
      protocol: config.client.protocol,
    }

    const RequirefoNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
    }

    ironman
      .getIdentity({
        accounts: [RequirefoNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        // 
        const foOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }

        // FO instance
        const fo = ironman[blockchain](foNetwork, Fibos, foOptions, config.client.protocol)
        const requiredFields = {
          accounts: [foNetwork],
        }

        if (sucCb) {
          sucCb(ironman, fo, requiredFields, account, foNetwork, identity)
        }
      })
      .catch(e => {
        // TODO
      })
  }
}
