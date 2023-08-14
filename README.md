explorer

## Branch description
Clear the duplicate capital files in the master branch
## entry specification

This project is based on the front-end project developed by react + act-router + odd. Please ensure that ` npm ` and ` node ` are installed before use.

Part of the functionality of this project depends on the browser plug-in, please make sure that the correct plug-in is installed.

## configure

This project is a blockchain project, and the relevant configuration information is stored in the `public/config/config.json` file. The following configuration items are described one by one:

| Field name | Function |
| --- | --- |
| client.chainId | Chain Id |
| client.hostname | chain rpc service address |
| client.port | chain rpc service port |
| client.protocol | chain rpc service network protocol, generally http or https |
| client.blockchain | Chain name, important! Need to be consistent with the chain name of the chain in the plug-in |
| client.searchApi | Query interface address used instead of the history service |
| openAccount | whether open ` account ` menu items, create account and receive drop reward two functions |
| contractAccount | Foundation account, the default is `datamall` |

special explanation:
1. The rpc node service requires a full node turning on the history

## Environmental remarks (2022-03-11)
| Channel | Production environment | Test environment |
| --- | --- | --- |
| Chain address | http: / / 154.22.122.40 | http: / / 154.22.123.188 |
|chainId|03803e416d091426198bfc490b6122b684ffecd4894d98fb8e2631758c716f47| 03803e416d091426198bfc490b6122b684ffecd4894d98fb8e2631758c716f47|
| Deployment address | http://explorer.dmctech.io | http: / / 154.39.239.234 |


## install

`npm install`

## develop

`npm start`

### agent

Proxy configuration In the `package.json` file, modify the ` proxy ` configuration content.

## bale

`npm run build`

The packaged files are deposited in the ` build ` folder

Environmental modification:
Modify the config.json configuration according to the config_env.js (plug-in configuration)
src/model/config.js Need a modification