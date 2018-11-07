import { WavesKeeperAdapter } from '../src/adapters/WavesKeeperAdapter';
import { Asset, Money, BigNumber } from '@waves/data-entities';
import { TRANSACTION_TYPE_NUMBER } from '../src/prepareTx'

const testAsset = new Asset({
    precision: 5,
    id: 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU',
    quantity: new BigNumber(10000),
    description: 'Some text',
    height: 100,
    name: 'Test',
    reissuable: false,
    sender: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
    timestamp: new Date(),
    ticker: null
});

const keeperMock = {
        auth: async (data) => ({"data":"test","prefix":"WavesWalletAuthentication","host":"www.yandex.ru","name":"test","address":"3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj","publicKey":"2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr","signature":"3xvbSznhRTgDP5vMSoPpqwVf29hSdDQLFpdbtVaMHCyzuFFEgSodB7MXZTescxcYiVtR9wCgTGmZPWTApMVMg6qP"}),
        signTransaction: async data => {
            switch (data.type) {
                case TRANSACTION_TYPE_NUMBER.SPONSORSHIP:
                case TRANSACTION_TYPE_NUMBER.BURN:
                case TRANSACTION_TYPE_NUMBER.CANCEL_LEASING:
                case TRANSACTION_TYPE_NUMBER.CREATE_ALIAS:
                case TRANSACTION_TYPE_NUMBER.DATA:
                case TRANSACTION_TYPE_NUMBER.EXCHANGE:
                case TRANSACTION_TYPE_NUMBER.ISSUE:
                case TRANSACTION_TYPE_NUMBER.LEASE:
                case TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
                case TRANSACTION_TYPE_NUMBER.TRANSFER:
                case TRANSACTION_TYPE_NUMBER.REISSUE:
                case TRANSACTION_TYPE_NUMBER.SET_SCRIPT:
                    break;
                default:
                    throw new Error('invalid transaction');
            }
    
            return {proofs: ['test', 'realProof']};
        },
        signOrder: async data => {},
        signCancelOrder: async data => {},
        signRequest: async data => {},
    };
                                                                                

describe('WavesKeeper adapter test', () => {
    
    it('Test connect to extension', async () => {
        try {
            const adapter = await WavesKeeperAdapter.connect({ data: 'test', name: 'test' }, keeperMock);
            expect(adapter).toBeInstanceOf(WavesKeeperAdapter);
        } catch (e) {
            expect('Fail sign verify').toBe('Done')
        }
    });
    
    it('Test sign transfer', async () => {
        
        const data = {
            type: 4,
            data: {
                fee: new Money(0.1, testAsset),
                amount: new Money(1, testAsset),
                recipient: 'test',
                attachment: ''
            }
        };
        
        try {
            const adapter = await WavesKeeperAdapter.connect({ data: 'test', name: 'test' }, keeperMock);
            const signable = adapter.makeSignable(data as any);
            const result = await signable.getDataForApi() as any;
            expect(result.proofs[0]).toBe('realProof')
        } catch (e) {
            expect('Fail sign verify').toBe('Done')
        }
    });
});
