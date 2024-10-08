import AWS from "aws-sdk";
import dotenv from "dotenv";
//dotenv : .env 파일에 저장된 환경 변수를 사용할 수 있게 해주는 라이브러리
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export default s3;
