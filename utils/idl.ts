import { PublicKey } from "@solana/web3.js"

export type BurnBoardIdl = {
  "version": "0.1.0",
  "name": "burn_board",
  "instructions": [
    {
      "name": "initFungibleUser",
      "accounts": [
        { "name": "newBurnScore", "isMut": true, "isSigner": false },
        { "name": "signer", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "mint", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "userName", "type": "string" }]
    },
    {
      "name": "burnFungible",
      "accounts": [
        { "name": "mint", "isMut": true, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "from", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true },
        { "name": "burnScore", "isMut": true, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    }
  ],
  "accounts": [
    {
      "name": "burnScore",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "burnedTokens", "type": "u64" },
          { "name": "pyroKey", "type": "publicKey" },
          { "name": "numBurns", "type": "u64" },
          { "name": "userName", "type": "string" },
          { "name": "mint", "type": "publicKey" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BurnError",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "InvalidAmount" },
          { "name": "InvalidAccount" },
          { "name": "InvalidToken" }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ShortName",
      "msg": "Name must have at least 3 characters"
    },
    { "code": 6001, "name": "LongName", "msg": "Max Name legth (8) exceeded." }
  ]
}

export const IDL: BurnBoardIdl = {
  "version": "0.1.0",
  "name": "burn_board",
  "instructions": [
    {
      "name": "initFungibleUser",
      "accounts": [
        { "name": "newBurnScore", "isMut": true, "isSigner": false },
        { "name": "signer", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "mint", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "userName", "type": "string" }]
    },
    {
      "name": "burnFungible",
      "accounts": [
        { "name": "mint", "isMut": true, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "from", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true },
        { "name": "burnScore", "isMut": true, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    }
  ],
  "accounts": [
    {
      "name": "burnScore",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "burnedTokens", "type": "u64" },
          { "name": "pyroKey", "type": "publicKey" },
          { "name": "numBurns", "type": "u64" },
          { "name": "userName", "type": "string" },
          { "name": "mint", "type": "publicKey" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BurnError",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "InvalidAmount" },
          { "name": "InvalidAccount" },
          { "name": "InvalidToken" }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ShortName",
      "msg": "Name must have at least 3 characters"
    },
    { "code": 6001, "name": "LongName", "msg": "Max Name legth (8) exceeded." }
  ]
}

export type BurnScore = {
  burnedTokens: number,
  pyroKey: PublicKey,
  numBurns: number,
  userName: string,
  mint: PublicKey
}

export type BurnScoreWithPda = {
  publicKey: PublicKey,
  account: BurnScore
}