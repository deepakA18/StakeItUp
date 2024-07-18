//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.24;

import {Ownable} from "./Ownable.sol";
import {ReentrancyGuard} from "./ReentrancyGuard.sol";
import {Initializable} from "./Initializable.sol";
import {IERC20} from "./IERC20.sol";

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