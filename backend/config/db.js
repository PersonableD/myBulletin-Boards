import mongoose from 'mongoose';
import dotenv from 'dotenv';
//dotenv : .env 파일에 저장된 환경 변수를 사용할 수 있게 해주는 라이브러리
dotenv.config();
//process.env 를 통해 .env안에 있는 환경 변수에 접근 가능
const connectDB= async()=>{
    try{//mongoose.connect() :MongoDB와 Node.js 애플리케이션을 연결하는 코드
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Atlas connected');//DB연결 성공 시 출력
    }catch(err){
        console.error('MongoDB connection error', err);
        process.exit(1);
    }
};

export default connectDB; // 다른 파일에서 connectDB를 사용할 수 있도록 내보내는 것