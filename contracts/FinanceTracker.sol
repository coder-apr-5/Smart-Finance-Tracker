




// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FinanceToken is ERC20, Ownable {
    constructor() ERC20("Finance Tracker", "FTK") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract FinanceTracker {
    struct Transaction {
        address user;
        uint256 amount;
        string category;
        bool isIncome;
        string description;
        uint256 timestamp;
    }

    FinanceToken public token;
    mapping(address => Transaction[]) public transactions;
    mapping(address => uint256) public rewards;

    event TransactionRecorded(
        address indexed user,
        uint256 amount,
        string category,
        bool isIncome,
        uint256 timestamp
    );

    constructor(address _token) {
        token = FinanceToken(_token);
    }

    function recordTransaction(
        uint256 _amount,
        string memory _category,
        bool _isIncome,
        string memory _description
    ) public {
        Transaction memory newTx = Transaction({
            user: msg.sender,
            amount: _amount,
            category: _category,
            isIncome: _isIncome,
            description: _description,
            timestamp: block.timestamp
        });

        transactions[msg.sender].push(newTx);
        
        // Reward users for recording transactions
        if (rewards[msg.sender] < 1000 * 10**18) {
            rewards[msg.sender] += 1 * 10**18;
            token.mint(msg.sender, 1 * 10**18);
        }

        emit TransactionRecorded(
            msg.sender,
            _amount,
            _category,
            _isIncome,
            block.timestamp
        );
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions[msg.sender];
    }
}
