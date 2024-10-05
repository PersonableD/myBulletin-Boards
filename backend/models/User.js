import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; //비밀번호 해싱에 사용되는 라이브러리

//사용자 스키마(DB 구조)정의 (닉네임,이메일,비밀번호)
const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required :true, unique:true},
    password:{type:String,required:true}
});

//비밀번호 암호화
//pre : save 작업이 수행되기 전 실행될 함수 정의
userSchema.pre('save',async function(next) {
    //스키마의 password 항목이 수정되었을 때만 해싱작업을 한다.
    if(!this.isModified('password')) return next();
    //bcrypt.genSalt 함수로 해시값을 생성한다.
    const salt =await bcrypt.genSalt(10);
    //생성한 해시값을 가지고 비밀번호를 해시화한다.
    //이 작업으로 해시화된 비밀번호가 DB에 들어간다.->개발자가 유저의 개인 보안 정보를 알면 안되기때문
    this.password = await bcrypt.hash(this.password,salt);
    //작업이 끝났으니 다음단계로 넘어가도록 next()호출
    //미들웨어의 작업이 끝났으니, 문서를 저장하는 작업을 계속 진행해도 된다"는 신호를 보내는 역할
    next();
})
//model():MongoDB 컬렉션과 상호작용하기 위한 도구
/*model() 함수로 정의된 모델은 데이터 베이스 내에서
데이터를 생성, 읽기, 업데이트, 삭제하는 데 사용*/
//User 로 첫번째 인자를 보내면 DB에서 users라는 컬렉션 자동 생성.
const User = mongoose.model('User',userSchema);
//생성한 유저모델 다른 파일에서 쓸 수 있도록 export
export default User;