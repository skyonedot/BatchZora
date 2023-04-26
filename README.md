# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

执行execute的时候, 注意
    1. 参数分别是 计数合约的起始位置, 打多少个, 向哪个合约发起tx, tx的data, NFT的接收者
    2. execute的时候, 注意发送value, 值是 0.000777 * _count

V1和V2的区别

 - V1直接执行execute(里面会自动创建子合约)

 - V2需要先createProxies 传入你想要创建几个子合约
    然后执行execute


V1的优点在于只单纯发起一笔tx 即可, 但是缺点在于子合约复用不合适(因为每次执行execute的时候 都会create)
V2的优点在于可以复用(即利用同一批子合约, 省gas) 但是缺点在于需要两笔TX 一笔Create, 一笔Execute

选择哪种看个人


最开始用的是 `onERC721Received` 这个函数, 结果不对
后来改用的
```
    uint256 tokenID;
    assembly {
        tokenID := mload(add(bytesdata, 32))
    }
    tokenID = tokenID + 1;

    ITOKEN(target).safeTransferFrom(
        address(this),
        receiver,
        tokenID
    );
```

其实我的Gas利用的还是偏高, 但是知识有限 找不到特别好的办法