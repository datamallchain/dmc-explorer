import { message } from 'antd'
import Dmc from 'dmc.js'

export const loginIronman = (sucCb, noIronman, config) => {
  if (!window.dmcironman) {
    if (!!noIronman) {
      noIronman()
    } else {
      message.info('未安装 DMC 插件,请先下载DMC插件')
    }
  } else {
    const ironman = window.dmcironman
    const hostname = new URL(config.client.hostname).hostname
    const blockchain = config.client.blockchain

    // 防止别的网页应用 调用window.dmcironman 对象
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

    // 给用户推荐网络， 第一次需要授权
    // ironman.suggestNetwork(dmcNetwork);
    // ironman.getIdentity 用户授权页面
    ironman
      .getIdentity({
        accounts: [RequiredmcNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        const dmcOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }

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
    message.info('未安装 DMC 插件,请先下载DMC插件')
    // window.open('https://wallet.fo/')
  } else {
    const hostname = new URL(config.client.hostname).hostname
    const ironman = window.dmcironman
    const blockchain = config.client.blockchain
    // 防止别的网页应用 调用window.dmcironman 对象
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

    // 给用户推荐网络， 第一次需要授权
    // ironman.suggestNetwork(dmcNetwork);
    // ironman.getIdentity 用户授权页面
    ironman
      .getIdentity({
        accounts: [RequiredmcNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        // dmc参数
        const dmcOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }

        // 获取dmc instance
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
