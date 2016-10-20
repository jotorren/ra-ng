import * as CryptoJS from 'crypto-js';

export class CryptoService {
    private static _: string = 'rt&=Ka38+>>!-9(9G6Bkac55??).<<#@0l';

    static encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, CryptoService._).toString();
    }

    static decrypt(value: string): string {
        let bytes = CryptoJS.AES.decrypt(value, CryptoService._);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}
