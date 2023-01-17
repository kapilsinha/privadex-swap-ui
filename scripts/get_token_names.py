import json
from web3 import Web3


web3 = Web3(Web3.HTTPProvider('https://astar.public.blastapi.io')) 
web3 = Web3(Web3.HTTPProvider('https://moonbeam.public.blastapi.io')) 

with open("./erc20_abi.json") as f:
    erc20_abi = json.load(f)

contract_address = Web3.toChecksumAddress("0xffffffff5ac1f9a51a93f5c527385edf7fe98a52")
erc20 = web3.eth.contract(address=contract_address, abi=erc20_abi)

name = erc20.functions.name().call()
print(name)

