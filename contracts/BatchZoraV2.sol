// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract BatchZoraV2 {
    uint256 n;
    bytes32 byteCode;

    constructor() payable {
    }

    function callback(address target, bytes memory data, address receiver) external {
        (bool success, bytes memory bytesdata) = target.call{
            value: 0.000777 ether
        }(data);
        require(success, "Transaction failed.");
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
    }

    function proxyFor(address sender, uint256 i)
        public
        view
        returns (address proxy)
    {
        bytes32 salt = keccak256(abi.encodePacked(sender, i));
        proxy = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(hex"ff", address(this), salt, byteCode)
                    )
                )
            )
        );
    }

    function execute(
        uint256 _start,
        uint256 _count,
        address target,
        bytes memory data,
        address receiver
    ) external payable {
        for (uint256 i = _start; i < _start + _count; i++) {
            address proxy = proxyFor(msg.sender, i);
            payable(proxy).transfer(0.000777 ether);
            BatchZoraV2(payable(proxy)).callback(target, data, receiver);
        }
    }

    function createProxies(uint256 _n) external {
        bytes memory miniProxy = bytes.concat(
            bytes20(0x3D602d80600A3D3981F3363d3d373d3D3D363d73),
            bytes20(address(this)),
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );
        byteCode = keccak256(abi.encodePacked(miniProxy));
        address proxy;
        uint256 oldN = n;
        for (uint256 i = 0; i < _n; i++) {
            bytes32 salt = keccak256(abi.encodePacked(msg.sender, i + oldN));
            assembly {
                proxy := create2(0, add(miniProxy, 32), mload(miniProxy), salt)
            }
        }
        n = oldN + _n;
    }

    receive() external payable {}
}

interface ITOKEN {
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
