//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.24;

contract Token{
    string public name = "shinchan";
    string public symbol = "SHN";
    string public standard = "shinchan v.0.1";
    uint256 public totalSupply;
    address public ownerOfContract;
    uint256 public _userId;

    uint256 constant initialSupply = 1000000 * (10**18);

    address[] public tokenHolder;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _sender, uint256 _value);

    mapping(address => TokenHolderInfo) public tokenHolderInfos;

    struct TokenHolderInfo {
        uint256 _tokenId;
        address _from;
        address _to;
        uint256 _totalToken;
        bool _tokenHolder;
    }

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping(address => uint256)) public allowance;

    constructor() {
        ownerOfContract = msg.sender;
        balanceOf[msg.sender] = initialSupply;
        totalSupply = initialSupply;
    }

    function  inc() internal {
        _userId++;
    }

    function transfer(address _to, uint256 _value) public returns(bool)
    {
        require(balanceOf[msg.sender] >= _value, "Insuffient balance!");
        inc();

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        TokenHolderInfo storage tokenHolderInfo = tokenHolderInfos[_to];

        tokenHolderInfo._to = _to;
        tokenHolderInfo._from = msg.sender;
        tokenHolderInfo._totalToken = _value;
        tokenHolderInfo._tokenHolder = true;
        tokenHolderInfo._tokenId = _userId;

        tokenHolder.push(_to);

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _sender, uint256 _value) public returns(bool) {
        allowance[msg.sender][_sender] = _value;

        emit Approval(msg.sender, _sender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;

    } 

    function getTokenHolderData(address _address) public view returns(
        uint256,
        address,
        address,
        uint256,
        bool
    ){
        return(
            tokenHolderInfos[_address]._tokenId,
            tokenHolderInfos[_address]._to,
            tokenHolderInfos[_address]._from,
            tokenHolderInfos[_address]._totalToken,
            tokenHolderInfos[_address]._tokenHolder
        );
    } 

    function getTokenHolder() public view returns(address[] memory){
        return tokenHolder;
    }

}
