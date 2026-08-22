import {DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

export interface StoredObject { key:string; contentType:string; sizeBytes:number; checksum?:string }
export interface StorageProvider { put(key:string, body:Buffer, contentType:string, checksum?:string):Promise<StoredObject>; get(key:string):Promise<{body:NodeJS.ReadableStream; contentType?:string; contentLength?:number}>; delete(key:string):Promise<void>; signedDownloadUrl(key:string, expiresIn?:number):Promise<string> }

export class S3StorageProvider implements StorageProvider {
 private readonly client:S3Client; private readonly bucket:string;
 constructor(){
  this.bucket=process.env.S3_BUCKET || 'sahlbiz';
  this.client=new S3Client({region:process.env.S3_REGION || 'us-east-1',endpoint:process.env.S3_ENDPOINT || undefined,forcePathStyle:process.env.S3_FORCE_PATH_STYLE==='true',credentials:process.env.S3_ACCESS_KEY_ID?{accessKeyId:process.env.S3_ACCESS_KEY_ID,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY||''}:undefined});
 }
 async put(key:string,body:Buffer,contentType:string,checksum?:string){await this.client.send(new PutObjectCommand({Bucket:this.bucket,Key:key,Body:body,ContentType:contentType,Metadata:checksum?{sha256:checksum}:undefined}));return {key,contentType,sizeBytes:body.byteLength,checksum};}
 async get(key:string){const r=await this.client.send(new GetObjectCommand({Bucket:this.bucket,Key:key}));if(!r.Body)throw new Error('Object body unavailable');return {body:r.Body as NodeJS.ReadableStream,contentType:r.ContentType,contentLength:r.ContentLength};}
 async delete(key:string){await this.client.send(new DeleteObjectCommand({Bucket:this.bucket,Key:key}));}
 async signedDownloadUrl(key:string,expiresIn=300){return getSignedUrl(this.client,new GetObjectCommand({Bucket:this.bucket,Key:key}),{expiresIn});}
}

export function storageProvider(){return new S3StorageProvider();}
