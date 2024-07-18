//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.24;

library Address{

    error Address__TransactionFailed();

    function isContract(address account) internal view returns(bool){
        return account.code.length > 0;
    }

    function sendValue(address payable receipent, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = receipent.call{value: amount}("");
        if(!success)
        {
            revert Address__TransactionFailed();
        }
    } 

    function functionCall(address target, bytes memory data) internal returns(bytes memory){
        return functionCall(target, data, "Address: low-level call failed!");
    }
    
    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns(bytes memory){
        return functionCallWithValue(target,data,0,errorMessage);
    }

    function functionCallWithValue(address target,bytes memory data, uint256 value) internal returns(bytes memory){
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed!");
    }

    function functionCallWithValue(address target,bytes memory data,uint256 value, string memory errorMessage)internal returns(bytes memory){
        require(address(this).balance >= value, "Address: Insufficient balance");
        require(isContract(target), "Address: Call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);

    }

    function functionStaticCall(address target, bytes memory data) internal view returns(bytes memory){
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }
    
    function functionStaticCall(address target,bytes memory data, string memory errorMessage) internal view returns(bytes memory)
    {
        require(isContract(target), "Address: static call to non-contract");

        (bool success,bytes memory returndata ) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage); 
    }

    function functionDelegateCall(address target, bytes memory data) internal returns(bytes memory){
        return functionDelegateCall(target, data, "Address: low-level delegate call failed!");
    }

    function functionDelegateCall(address target,bytes memory data, string memory errorMessage) internal returns(bytes memory)
    {
        require( isContract(target), "Address: delegate call to non-contract");

        (bool success,bytes memory returndata ) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage); 
    }

    function verifyCallResult(bool success, bytes memory returndata,string memory errorMessage)  internal pure returns (bytes memory){
        if(success){
            return returndata;
        }
        else{
            if(returndata.length > 0)
            {
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

pragma solidity 0.8.24;

abstract contract Context{
    function _msgSender() internal view virtual returns(address){
        return msg.sender;
    }

    function _msgData() internal view virtual returns(bytes calldata){
        return msg.data;
    }
}


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


pragma solidity 0.8.24;

abstract contract Initializable {

    uint8 private _initialized;

    bool private _initializing;

    event Initialized(uint8 version);

    modifier initializer() {
        bool isTopLevelCall = !_initializing;

        require((isTopLevelCall &&  _initialized < 1) || (!Address.isContract(address(this)) && _initialized == 1), "Contract is already initialized!");
        
        _initialized = 1;

        if(isTopLevelCall)
        {
            _initializing = true;
        }
        _;
        if(isTopLevelCall)
        {
            _initializing = false;
            emit Initialized(1);
        }

    }

    modifier reinitializer(uint8 version){
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing!");
        _;
    }

    function _disableInitializers() internal virtual {
        require(!_initializing,"Initializable: contract is initializing");
        if(_initialized < type(uint8).max)
        {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }
}



pragma solidity 0.8.24;

abstract contract Ownable is Context{

    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(_msgSender());
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns(address) {
            return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Caller is not the owner!");
    }

    function renounceOwnership() public virtual onlyOwner{
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual{
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

}


pragma solidity 0.8.24;

abstract contract ReentrancyGuard{

    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "Reentrant call!");
        _status = _ENTERED;
        _;

        _status = _NOT_ENTERED;
    }
}

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


pragma solidity 0.8.24;

contract TokenStaking is Ownable, ReentrancyGuard, Initializable{

    struct User {
        uint256 stakeAmount;
        uint256 rewardAmount;
        uint256 lastStakeTime;
        uint256 lastRewardCalculationTime;
        uint256 rewardsClaimedSoFar;
    }

    uint256 _minimumStakingAmount;

    uint256 _maxStakeTokenLimit;

    uint256 _stakeEndDate;

    uint256 _stakeStartDate;

    uint256 _totalStakedTokens;

    uint256 _totalUsers;

    uint256 _stakeDays;

    uint256 _earlyUnstakeFeePercentage;

    bool _isStakingPaused;

    address private _tokenAddress;

    //APY
    uint256 _apyRate;

    uint256 public constant PERCENTAGE_DENOMINATION = 10000;
    uint256 public constant APY_RATE_CHANGE_THRESHOLD = 10;

    //User address => User
    mapping(address => User) private _users;

    event Stake(address indexed user, uint256 amount);
    event UnStake(address indexed user, uint256 amount);
    event EarlyUnstakeFee(address indexed user, uint256 amount);
    event ClaimReward(address indexed user, uint256 amount);

    modifier whenTreasuryHasBalance(uint256 amount) {
        require(IERC20(_tokenAddress).balanceOf(address(this)) >= amount, "Insufficient funds in the treasury!");
        _;
    }

    function initialize(
        address owner_, 
        address tokenAddress_, 
        uint256 apyRate_, 
        uint256 minimumStakingAmount_,
        uint256 maxStakingTokenLimit_,
        uint256 stakeStartDate_,
        uint256 stakeEndDate_,
        uint256 stakeDays_,
        uint256 earlyUnstakeFeePercentage_
        ) public virtual initializer {
            __TokenStaking_init_unchanged(
                owner_,
                tokenAddress_,
                apyRate_,
                minimumStakingAmount_,
                maxStakingTokenLimit_,
                stakeStartDate_,
                stakeEndDate_,
                stakeDays_,
                earlyUnstakeFeePercentage_
            );
        }

        function __TokenStaking_init_unchanged(
        address owner_, 
        address tokenAddress_, 
        uint256 apyRate_, 
        uint256 minimumStakingAmount_,
        uint256 maxStakingTokenLimit_,
        uint256 stakeStartDate_,
        uint256 stakeEndDate_,
        uint256 stakeDays_,
        uint256 earlyUnstakeFeePercentage_
        ) internal onlyInitializing {
            require(_apyRate <= 10000, "APY rate should be less than 10000!");
            require(stakeDays_ > 0, "No Stake Days!");
            require(tokenAddress_ != address(0), "Token address is Invalid!");
            require(stakeStartDate_ < stakeEndDate_, "Start date must me prior to end date!");

            _transferOwnership(owner_);
            _tokenAddress = tokenAddress_;
            _apyRate = apyRate_;
            _minimumStakingAmount = minimumStakingAmount_;
            _maxStakeTokenLimit = maxStakingTokenLimit_;
            _stakeStartDate = stakeStartDate_;
            _stakeEndDate = stakeEndDate_;
            _stakeDays = stakeDays_ * 1 days;
            _earlyUnstakeFeePercentage = earlyUnstakeFeePercentage_;
        }

        //To get the minimum staking amount

        function getMinimumStakingAmount() external view returns (uint256) {
            return _minimumStakingAmount;
        } 


        function getMaxStakingTokenLimit() external view returns (uint256) {
            return _maxStakeTokenLimit;
        } 

        
        function getStakeStartDate() external view returns (uint256) {
            return _stakeStartDate;
        } 

        function getStakeEndDate() external view returns (uint256) {
            return _stakeEndDate;
        } 

         function getTotalStakeTokens() external view returns (uint256) {
            return _totalStakedTokens;
        } 

         function getTotalUsers() external view returns (uint256) {
            return _totalUsers;
        } 

         function getStakeDays() external view returns (uint256) {
            return _stakeDays;
        } 

         function getEarlyUnstakeFeePercentage() external view returns (uint256) {
            return _earlyUnstakeFeePercentage;
        } 

         function getStakingStatus() external view returns (bool) {
            return _isStakingPaused;
        } 

         function getAPY() external view returns (uint256) {
            return _apyRate;
        } 


        // Function to get estimated reward of user

        function getUserEstimatedRewards() external view returns(uint256)
        {
            (uint256 amount, ) = _getUserEstimatedRewards(msg.sender);
            return _users[msg.sender].rewardAmount + amount;
        }

        function getWithdrawableAmount() external view returns(uint256){
            return IERC20(_tokenAddress).balanceOf(address(this)) - _totalStakedTokens;
        }

        //function to get user details

        function getUser(address userAddress) external view returns(User memory)
        {
            return _users[userAddress];
        }

        //function to check if a user is a stakeholder 

        function isStakeHolder(address _user) external view returns(bool)
        {
            return _users[_user].stakeAmount != 0;
        }


        //this function is used to update minimum staking amount

        function updateMinimumStakingAmount(uint256 newAmount) external onlyOwner{
            _minimumStakingAmount = newAmount;
        }

        //this function is used to update the maximum staking amount

        function updateMaximumStakingAmount(uint256 newAmount) external onlyOwner{
            _maxStakeTokenLimit = newAmount;
        }


        //This function is used to update staking end date

        function updateStakingEndDate(uint256 newDate) external onlyOwner {
            _stakeEndDate = newDate;
        } 

        function updateEarlyUnstakeFeePercentage(uint256 newPercentage) external onlyOwner {
            _earlyUnstakeFeePercentage = newPercentage;
        }

        //this function is used to stake token for specific user

        function stakeForUser(uint256 amount, address user) external onlyOwner nonReentrant {
            _stakeTokens(amount, user);
        }

        //this function can be used to toggle staking status

        function toggleStakingStatus() external view onlyOwner {
            _isStakingPaused != _isStakingPaused;
        }

        //this function can be used to withdraw the available tokens

        function withdraw(uint256 amount) external onlyOwner nonReentrant{
            require(this.getWithdrawableAmount() >= amount, "Not enough tokens to withdraw!");
            IERC20(_tokenAddress).transfer(msg.sender, amount);
        }

        //User methods

        //This function is used to stake tokens

        function stake(uint256 amount) external nonReentrant{
            _stakeTokens(amount,msg.sender);
        }

        function _stakeTokens(uint256 _amount, address user_) private {
            require(!_isStakingPaused, "Staking is Paused!");

            uint256 currentTime = getCurrentTime();
            require(currentTime > _stakeStartDate, "Staking not started yet!");
            require(currentTime < _stakeEndDate, "Staking ended!");
            require(_totalStakedTokens + _amount <= _maxStakeTokenLimit, "max staking token limit reached!");
            require(_amount > 0, "stake amount must be non-zero!");
            require(_amount >= _minimumStakingAmount, "Stake amount must greater than minimum amount allowed!");

            if(_users[user_].stakeAmount != 0)
            {
                _calculateRewards(user_);
            }
            else{
                _users[user_].lastRewardCalculationTime = currentTime;
                _totalUsers += 1;
            }

            _users[user_].stakeAmount += _amount;
            _users[user_].lastStakeTime = currentTime;

            _totalStakedTokens += _amount;

            require(IERC20(_tokenAddress).transferFrom(msg.sender,address(this), _amount), "Failed to transfer Tokens!");
            emit Stake(user_, _amount);
        }

        //this function is used to unstake tokens

        function unstake(uint256 _amount) external nonReentrant whenTreasuryHasBalance(_amount){
            address user = msg.sender;

            require(_amount != 0, "Insufficient balance!");
            require(this.isStakeHolder(user), "Not a StakeHolder!");
            require(_users[user].stakeAmount >= _amount, "Not enough stake to unstake!");

            //calculate user reward

            _calculateRewards(user);

            uint256 feeEarlyUnstake;

            if(getCurrentTime() <= _users[user].lastStakeTime + _stakeDays){
                feeEarlyUnstake = ((_amount * _earlyUnstakeFeePercentage) / PERCENTAGE_DENOMINATION);
                emit EarlyUnstakeFee(user, feeEarlyUnstake);
            }

            uint256 amountToUnstake = _amount - feeEarlyUnstake;

            _users[user].stakeAmount -= _amount;

            if(_users[user].stakeAmount == 0)
            {
                _totalUsers -= 1;
            }

            require(IERC20(_tokenAddress).transfer(user, amountToUnstake), "Failed to transfer!");
            emit UnStake(user, _amount);
        }

    // This function is used to claim users reward

    function claimRewards() external nonReentrant whenTreasuryHasBalance(_users[msg.sender].rewardAmount)
    {
        _calculateRewards(msg.sender);
        uint256 rewardAmount = _users[msg.sender].rewardAmount;

        require(rewardAmount > 0, "No reward to claim!");

        require(IERC20(_tokenAddress).transfer(msg.sender, rewardAmount), "Failed to transfer!");

        _users[msg.sender].rewardAmount = 0;
        _users[msg.sender].rewardsClaimedSoFar += rewardAmount;

        emit ClaimReward(msg.sender, rewardAmount);
    }


    //Internal functions

    function _calculateRewards(address _user) private {
        (uint256 userReward, uint256 currentTime) = _getUserEstimatedRewards(_user);

        _users[_user].rewardAmount += userReward;
        _users[_user].lastRewardCalculationTime = currentTime;

    }

    function _getUserEstimatedRewards(address _user) private view returns(uint256, uint256){
        uint256 userReward;
        uint256 userTimeStamp = _users[_user].lastRewardCalculationTime;

        uint256 currentTime = getCurrentTime();

        if(currentTime > _users[_user].lastStakeTime + _stakeDays)
        {
            currentTime = _users[_user].lastStakeTime + _stakeDays;
        }

        uint256 totalStakedtime = currentTime - userTimeStamp;

        userReward += ((totalStakedtime * _users[_user].stakeAmount * _apyRate) / 365 days) / PERCENTAGE_DENOMINATION;

        return (userReward, currentTime);
    }

    function getCurrentTime() internal view virtual returns(uint256) {
        return block.timestamp;
    }





}



