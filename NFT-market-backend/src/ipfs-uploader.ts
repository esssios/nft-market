import { create } from "kubo-rpc-client";
import "dotenv/config";
import fs from "fs";

function ipfsHooks() {
  const ipfs = create({ url: process.env.IPFS_UPLOAD_PATH });
  async function uploadFileToIPFS(filePath: string) {
    console.log(ipfs);
    const file = fs.readFileSync(filePath);
    const res = await ipfs.add({ path: filePath, content: file });
    return res;
  }

  async function uploadJSONToIPFS(json: { title: string, description: string, image: string }) {
    const res = await ipfs.add(JSON.stringify(json));
    return res;
  }

  return { uploadFileToIPFS, uploadJSONToIPFS };
}

export default ipfsHooks;