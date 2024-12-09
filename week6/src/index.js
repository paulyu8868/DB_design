import express from "express";
import logger from "morgan";
import path from "path";

import homeRouter from "../routes/home"

const PORT = 3000;
const app = express(); // 익스프레스 객체 생성

// "/src" 디렉토리에서 정적파일 전달
app.use(express.static(path.join(__dirname,"/src")));
// Url 인코딩
app.use(express.urlencoded({extended: false}));
// json에 담기
app.use(express.json());

// 템플릿 렌더링을 위해 "views" 디렉토리 사용
app.set("views",path.join(__dirname,"../views"));
// hbs 뷰엔진 사용
app.set("view engine","hbs");
// HTTP 요청을 로깅하기 위해 dev 로거 사용
app.use(logger("dev"));
// 라우트 핸들링을 위해 홈라우터 사용
app.use("/",homeRouter);

// 해당 포트로 서버를 실행하고 로그를 남김
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})
