// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FlowTrace {
    
    struct TransactionLog {
        string eventId;
        string fromEntity;
        string toEntity;
        uint256 amount;      // en centavos para evitar decimales
        string txType;       // "invoice" | "transfer"
        uint256 timestamp;
    }
    
    struct RiskLog {
        string entityId;
        uint256 riskScore;
        uint256 computedAt;
        string reason;       // "layering" | "circular" | "whale" | "aml"
    }

    event TransactionRegistered(string indexed eventId, string fromEntity, string toEntity, uint256 amount);
    event RiskFlagged(string indexed entityId, uint256 riskScore, string reason); 

    mapping(string => TransactionLog) public transactions;  // eventId => log
    mapping(string => RiskLog[]) public riskHistory;        // entityId => historial

    function logTransaction(
        string memory eventId,
        string memory fromEntity,
        string memory toEntity,
        uint256 amount,
        string memory txType,
        uint256 timestamp
    ) external {
        transactions[eventId] = TransactionLog(eventId, fromEntity, toEntity, amount, txType, timestamp);
        emit TransactionRegistered(eventId, fromEntity, toEntity, amount);
    }

    function flagRisk(
        string memory entityId,
        uint256 riskScore,
        string memory reason
    ) external {
        riskHistory[entityId].push(RiskLog(entityId, riskScore, block.timestamp, reason));
        emit RiskFlagged(entityId, riskScore, reason);
    }

    function getRiskHistory(string memory entityId) external view returns (RiskLog[] memory) {
        return riskHistory[entityId];
    }
}