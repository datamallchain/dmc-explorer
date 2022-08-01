## Project Instruction

This project is based on the front-end project developed by react + react-router + antd. Please make sure that npm and node are installed before using.

Some functions of this project depend on browser plug-ins, please make sure to install the correct plug-ins.

## Configuration

This project is a blockchain project, and the relevant configuration information is stored in the public/config/config.json file. The following describes the configuration items one by one:

| param            | Effect                                                                                                    |
| --- | --- |
| client.chainId    | ChainId Id                                                                                                   |
| client.hostname   | Chain rpc service address                                                                                         |
| client.port       | Chain rpc service port                                                                                         |
| client.protocol   | Chain rpc service network protocol, generally http or https                                                             |
| client.blockchain | The chain name is important! Need to be consistent with the chain name of the chain in the plugin                                                              |
| client.searchApi  | Used to replace the query interface address of the history service                                                                     |
| openAccount       | Whether to open the Account menu item, provide two functions of creating an account and receiving airdrop rewards                                            |
| checkAccount      | The account number used to determine the cpu mortgage price and the network mortgage price. Please make sure that the account has been created in the chain, and special accounts such as eosio are not allowed. |
| contractAccount      | Foundation account, the current default setting is `datamall` |

## Install

`npm install`

## Usage

`npm start`

### Proxy

The proxy configuration is in the package.json file, just modify the proxy configuration content.

## Build

`npm run build`

The packaged files are stored in the `build` folder
