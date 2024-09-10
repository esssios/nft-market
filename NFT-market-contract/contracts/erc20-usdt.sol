// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract fUSTD is ERC20 {
    constructor() ERC20("fake USTD", "fUSTD") {
        _mint(msg.sender, 1 * 10 ** 8 * 10 ** 18); // 发行代币数量为1亿， 18是精度
    }
}
