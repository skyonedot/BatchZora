## Batch Mint Zora NFT

- 用于批量Mint Zora发行的NFT, 尤其是针对每个钱包最多Mint 1个的情况

- 代码主要来于 [@0xKISS][https://twitter.com/0xKISS] Batch Mint XEN的代码: https://github.com/neal-zhu/batcher 

- contracts 文件夹里有V1和V2版本

  - V1直接执行execute(里面会自动创建子合约)

  - V2需要先createProxies 传入你想要创建几个子合约 然后执行execute

  - > - V1的优点在于只单纯发起一笔tx 即可, 但是缺点在于子合约复用不合适(因为每次执行execute的时候 都同样会create一批多余的)
    > - V2的优点在于可以复用(即利用同一批子合约, 省gas) 但是缺点在于需要两笔TX 一笔Create, 一笔Execute
    > - 选择哪种看个人

- test 文件夹下写好了V1和V2的测试版本, 注意将 .env.example 修改为.env 

- 执行execute的时候, 注意
  - 传入五个参数, 分别是 计数合约的起始位置(start), 打多少个(count), 向哪个合约发起tx(target_address), tx的data(data), NFT的接收者(receiver)
  - execute的时候, 注意发送value, 值是 0.000777 * count

- 踩坑

  - 最开始用的是 `onERC721Received` 这个函数, 结果不对, 收到NFT之后转不出来. 🥲

  - 后来改用的

    - ```
      uint256 tokenID;
      assembly {
        tokenID := mload(add(bytesdata, 32))
      }
      tokenID = tokenID;
      
      ITOKEN(target).safeTransferFrom(
        address(this),
        receiver,
        tokenID
      );
      ```

  - 发现也不对, 问题出在第五行 需要TokenID+1, 更正后为

    - ```
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

---

- 其实我的Gas的还是不低, Mint100个NFT的Gas大概是 130万, 限于知识有限 找不到特别好的办法 🫡