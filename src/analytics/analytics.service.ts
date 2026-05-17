import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { ethers } from 'ethers';
const ABI=[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "entityId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "riskScore",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "RiskFlagged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "eventId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fromEntity",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "toEntity",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TransactionRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "entityId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "riskScore",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "flagRisk",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "entityId",
				"type": "string"
			}
		],
		"name": "getRiskHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "entityId",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "riskScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "computedAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "reason",
						"type": "string"
					}
				],
				"internalType": "struct FlowTrace.RiskLog[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "eventId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fromEntity",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "toEntity",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "txType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "logTransaction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "riskHistory",
		"outputs": [
			{
				"internalType": "string",
				"name": "entityId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "riskScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "computedAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "transactions",
		"outputs": [
			{
				"internalType": "string",
				"name": "eventId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fromEntity",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "toEntity",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "txType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const RISK_THRESHOLD = 1_000_000;
@Injectable()
export class AnalyticsService {
      private contract: ethers.Contract;

  constructor(
    private readonly neo4j: Neo4jService,
    
) { const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!,
      ABI,
      wallet
    );
  }

  private async flagOnChain(entityId: string, riskScore: number, reason: string) {
    try {
      const tx = await this.contract.flagRisk(
        entityId,
        BigInt(Math.round(riskScore)),
        reason
      );
      await tx.wait();
      return {
        txHash: tx.hash,
        explorerUrl: `https://testnet.snowtrace.io/tx/${tx.hash}`
      };
    } catch (e: any) {
      console.error('Blockchain flag failed:', e.message);
      return null; // no rompe el endpoint si falla la blockchain
    }
  }


  async topEntities() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (a:Entity)-[r:TRANSACTED]->()
        RETURN a.id AS entity, count(r) AS transactions
        ORDER BY transactions DESC
        LIMIT 10
      `);

      return result.records.map(r => ({
        entity: r.get('entity'),
        transactions: r.get('transactions').toNumber(),
      }));
    } finally {
      await session.close();
    }
  }

  async topVolume() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (a:Entity)-[r:TRANSACTED]->()
        RETURN a.id AS entity, sum(r.amount) AS volume
        ORDER BY volume DESC
        LIMIT 10
      `);

      return result.records.map(r => ({
        entity: r.get('entity'),
volume: typeof r.get('volume')?.toNumber === 'function'
  ? r.get('volume').toNumber()
  : r.get('volume'),      }));
    } finally {
      await session.close();
    }
  }

  async highRiskTransactions() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (a:Entity)-[r:TRANSACTED]->(b:Entity)
        WHERE r.amount > 500000
        RETURN a.id AS from,
               b.id AS to,
               r.amount AS amount,
               r.timestamp AS timestamp
        ORDER BY r.amount DESC
        LIMIT 20
      `);

      return result.records.map(r => ({
        from: r.get('from'),
        to: r.get('to'),
        amount: this.safeNumber(r.get('amount')),
        timestamp: r.get('timestamp'),
      }));
    } finally {
      await session.close();
    }
  }

  async hubs() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (e:Entity)-[r:TRANSACTED]-()
        RETURN e.id AS entity, count(r) AS connections
        ORDER BY connections DESC
        LIMIT 10
      `);

      return result.records.map(r => ({
        entity: r.get('entity'),
        connections: r.get('connections').toNumber(),
      }));
    } finally {
      await session.close();
    }
  }

  async amlScore() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH (e:Entity)-[r:TRANSACTED]-()
      WITH e,
           count(r) AS txs,
           sum(r.amount) AS volume,
           max(r.amount) AS max_tx

      RETURN e.id AS entity,
             txs,
             volume,
             max_tx,
             (txs * 0.3 + volume * 0.7) AS risk_score
      ORDER BY risk_score DESC
      LIMIT 20
    `);

    return result.records.map(r => ({
      entity: r.get('entity'),
      txs: r.get('txs').toNumber?.() ?? r.get('txs'),
      volume: r.get('volume'),
      max_tx: r.get('max_tx'),
      risk_score: r.get('risk_score'),
    }));
  } finally {
    await session.close();
  }
}

async circularFlow() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH p=(a:Entity)-[:TRANSACTED*2..4]->(a)
      RETURN p
      LIMIT 10
    `);

    return result.records.map(r => ({
      path: r.get('p'),
    }));
  } finally {
    await session.close();
  }
}

async layering() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH p=(a:Entity)-[:TRANSACTED*3..6]->(b)
      RETURN p
      LIMIT 10
    `);

    return result.records.map(r => ({
      path: r.get('p'),
    }));
  } finally {
    await session.close();
  }
}

async bigMoney() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH (a:Entity)-[r:TRANSACTED]->(b:Entity)
      WHERE r.amount > 1000000
      RETURN a.id AS from,
             b.id AS to,
             r.amount AS amount,
             r.timestamp AS timestamp
      ORDER BY r.amount DESC
      LIMIT 20
    `);

    return result.records.map(r => ({
      from: r.get('from'),
      to: r.get('to'),
      amount: r.get('amount'),
      timestamp: r.get('timestamp'),
    }));
  } finally {
    await session.close();
  }
}

async whales() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH (a:Entity)-[r:TRANSACTED]->()
      RETURN a.id AS entity,
             sum(r.amount) AS total
      ORDER BY total DESC
      LIMIT 10
    `);

    return result.records.map(r => ({
      entity: r.get('entity'),
      total: r.get('total'),
    }));
  } finally {
    await session.close();
  }
}

  private safeNumber(value: any): number {
    return typeof value?.toNumber === 'function'
      ? value.toNumber()
      : Number(value);
  }

}