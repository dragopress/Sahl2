import {randomBytes,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(scryptCallback);
const KEYLEN=64;
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');const key=(await scrypt(password,salt,KEYLEN)) as Buffer;return `scrypt$${salt}$${key.toString('hex')}`}
export async function verifyPassword(password:string,encoded:string){const [scheme,salt,hex]=encoded.split('$');if(scheme!=='scrypt'||!salt||!hex)return false;const key=(await scrypt(password,salt,KEYLEN)) as Buffer;const expected=Buffer.from(hex,'hex');return expected.length===key.length&&timingSafeEqual(expected,key)}
export function hashToken(token:string){return createHash('sha256').update(token).digest('hex')}
export function createToken(){return randomBytes(32).toString('base64url')}
