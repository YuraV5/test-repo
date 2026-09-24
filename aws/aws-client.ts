import { SESClient } from "@aws-sdk/client-ses";

const REGION = "eu-north-1"; // e.g., "us-east-1"

const sesClient = new SESClient({ region: REGION, credentials: {
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey'
} });
export { sesClient };