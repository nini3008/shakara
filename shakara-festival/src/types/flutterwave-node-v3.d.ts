declare module 'flutterwave-node-v3' {
  export default class Flutterwave {
    constructor(publicKey: string, secretKey: string);
    
    Transaction: {
      verify: (params: { id: number | string }) => Promise<{
        data: {
          status: string;
          amount: number;
          currency: string;
          [key: string]: unknown;
        };
      }>;
    };
  }
}
