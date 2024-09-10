import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import bodyParser from 'body-parser';
import fileUpload, { UploadedFile } from "express-fileupload";
import ipfsHooks from "./ipfs-uploader";
import { mint } from './nft-minter';

const { uploadFileToIPFS, uploadJSONToIPFS } = ipfsHooks();

const app = express();

// 中间件配置
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(cors());

const PORT = process.env.PORT;
const FILE_SAVE_PATH = "files"

app.get('/', (req, res) => {
  res.send('Hello, TypeScript and Express!');
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const { title, description, to } = req.body;

  const file = req.files.file as UploadedFile;
  const fileName = file.name;
  const SAVE_PATH = `${FILE_SAVE_PATH}/${file.name}`;

  file.mv(SAVE_PATH, async (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const uploadedFileRes = await uploadFileToIPFS(SAVE_PATH);
      console.log('File uploaded to IPFS:', uploadedFileRes.cid.toString());

      const metadata = {
        title,
        description,
        image: `${process.env.IPFS_PREVIEW_PATH}/${uploadedFileRes.cid.toString()}/${fileName}`
      }

      const uploadedJsonRes = await uploadJSONToIPFS(metadata);
      console.log('Metadata uploaded to IPFS:', uploadedJsonRes.cid.toString());
      
      await mint(to, uploadedJsonRes.cid.toString());

      res.json({
        message: "file uploaded successfully",
        metadata
      })
    }

  });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});