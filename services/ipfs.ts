import { create } from 'ipfs-http-client';

const projectId = import.meta.env.VITE_INFURA_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_PROJECT_SECRET;

if (!projectId || !projectSecret) {
  throw new Error('Missing IPFS configuration. Please check your environment variables.');
}

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export async function uploadToIPFS(data: any) {
  try {
    const added = await client.add(JSON.stringify(data));
    return added.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload data to IPFS. Please try again later.');
  }
}

export async function getFromIPFS(hash: string) {
  try {
    const stream = client.cat(hash);
    let data = '';
    for await (const chunk of stream) {
      data += chunk.toString();
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    throw new Error('Failed to retrieve data from IPFS. Please try again later.');
  }
}