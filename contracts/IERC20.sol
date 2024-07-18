//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.24;

interface IERC20{
     event Transfer(address indexed from, address indexed to, uint256 indexed value);
     
     event Approval(address indexed owner, address indexed spender, uint256 indexed value);

     function balanceOf(address account) external view returns(uint256);

     function transfer(address to, uint256 amount) external returns(bool);

     function allowance(address owner,address spender) external view returns(bool);

     function approve(address spender, uint256 amount) external returns (bool);

     function transferFrom(
        address from,
        address to,
        uint256 amount
     ) external returns(bool);
}