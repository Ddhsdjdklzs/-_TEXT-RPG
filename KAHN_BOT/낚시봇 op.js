/*
 -낚시봇을 관리해주실 봇 관리자분들께-
 
 낚시봇 관리자 전용 명령어를 사용하시려면
 디버깅룸의 패키지명을 op room 으로 바꾸셔야합니다.
 봇 관리자께서는 해당 봇을 사용하실때, 부디 몇가지 규칙을 지켜주세요.
 
 1. 관리자 전용 명령어로 예상 밖의 값 설정을 자제해주세요. 치명적인 오류가 발생할수 있습니다.
 2. 봇 관리자라는 권력을 남용하지 말아주세요.(특정 유저의 일반적인 플레이 방해등)
 3. 도용은 하지 말아주세요. (공유는 가능합니다)
 4. 봇의 수정은 가능하십니다!
 5. 상수값을 변경하실때는 신중히 변경해주세요. 오류가 발생할수 있습니다.
 
 op 전용 명령어는 패키지명을 op room 으로 변경하시고 %낚시봇 op명령어 를 치시면 설명이 나옵니다.
 */
 const password = "&5o233";
 function delay(time){
  java.lang.Thread.sleep(time);
}
 function random(small, big){
 return Math.floor(Math.random()*(big-small))+small;
}
var islog_in = {};
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(packageName=="op room"||(islog_in[sender]==true&&isGroupChat==false)){
    if(msg=="%낚시봇 op명령어")
      replier.reply("%돈설정 \"(닉넴)\" (금액) 으로 대상의 돈을 설정할 수 있습니다.\n\n%렙설정 \"(닉넴)\" (설정하실 레벨 × 100) 으로 대상의 렙을 설정할 수 있습니다.");
  try{
      var joinbot = DataBase.getDataBase("낚시봇 가입리스트").split("\n");
      }catch(e){
        var joinbot = [""];
      }
  try{
    var blacklist = DataBase.getDataBase("낚시봇 블랙리스트").split("\n");
   }catch(e){
     DataBase.setDataBase("낚시봇 블랙리스트","\n");
     var blacklist = [""];
 }
 if(msg.split(" ")[0]=="%돈설정"){
   var message1 = msg.split("\"");
   if(!joinbot.includes(message1[1])){
     replier.reply("해당 유저는 없습니다.");
     return ;
   }
   var cutting = msg.replace("%돈설정 ", "");
   cutting = cutting.replace(message1[1], "");
   cutting = cutting.replace(" ","");
   cutting = cutting.replace("\"","");
   cutting = cutting.replace("\"","");
   if(isNaN(Number(cutting))){
     replier.reply("숫자를 입력해주세요");
     return;
   }
   if(Number(cutting)<0){
     replier.reply("음수로 설정하실수 없습니다");
     return ;
   }
   DataBase.setDataBase("낚시봇 "+message1[1]+ "님의 돈", Number(cutting));
       replier.reply("설정이 완료되었습니다.");
 }else if(msg.split(" ")[0]=="%렙설정"){
   var message1 = msg.split("\"");
   if(!joinbot.includes(message1[1])){
     replier.reply("해당 유저는 없습니다.");
     return ;
   }
   var cutting = msg.replace("%렙설정 ", "");
   cutting = cutting.replace(message1[1], "");
   cutting = cutting.replace(" ","");
   cutting = cutting.replace("\"","");
   cutting = cutting.replace("\"","");
   if(isNaN(Number(cutting))){
     replier.reply("숫자를 입력해주세요");
     return;
   }
   if(Number(cutting)<0){
     replier.reply("음수로 설정하실수 없습니다");
     return ;
   }
   DataBase.setDataBase("낚시봇 "+message1[1]+ "님의 레벨", Number(cutting));
       replier.reply("설정이 완료되었습니다.");
 }else if(msg.split(" ")[0]=="%칭호지급"){
   var message2 = msg.split("\"");
   if(!joinbot.includes(message2[1])){
     replier.reply("해당 유저는 없습니다.");
     return ;
   }
   var cutting1 = msg.replace("%칭호지급 ", "");
   cutting1 = cutting1.replace(message2[1], "");
   cutting1 = cutting1.replace(" ","");
   cutting1 = cutting1.replace("\"","");
   cutting1 = cutting1.replace("\"","");
   if(cutting1.length>15){
     replier.reply("칭호가 너무 깁니다.");
     return;
   }
   DataBase.setDataBase("낚시봇 "+message2[1]+ "님의 소유한 칭호", DataBase.getDataBase("낚시봇 "+message2[1]+"님의 소유한 칭호")+cutting1+"\n");
   replier.reply(message2+"님에게 칭호 지급이 완료되었습니다.");
 }else if(msg.split(" ")[0]=="%돈전체지급"){
   var how = msg.split(" ");
   if(isNaN(Number(how[1]))){
     replier.reply("숫자를 입력해주세요");
     return;
   }
   if(Number(how[1])<0){
     replier.reply("음수로 설정하실수 없습니다");
     return ;
   }
   for(let i = 0; i < joinbot.length;i++){
     replier.reply(joinbot[i]+"님에게 돈을 지급합니다.");
     DataBase.setDataBase("낚시봇 "+joinbot[i]+ "님의 돈", Number(DataBase.getDataBase("낚시봇 "+joinbot[i]+ "님의 돈"))+Number(how[1]));
   }
   replier.reply("전체 지급완료");
 }else if(msg.split(" ")[0]=="%블랙리스트"){
   if(msg.split(" ")[1]=="추가"){
     if(!joinbot.includes(msg.replace("%블랙리스트 추가 ",""))){
       replier.reply("해당 유저는 가입되지 않았습니다.");
       return;
     }
     if(blacklist.includes(msg.replace("%블랙리스트 추가 ",""))){
       replier.reply("이미 블랙리스트에 올라갔습니다.");
       return ;
     }
     DataBase.setDataBase("낚시봇 블랙리스트", DataBase.getDataBase("낚시봇 블랙리스트")+msg.replace("%블랙리스트 추가 ","")+"\n");
     replier.reply("블랙리스트에 추가 완료");
   }else if(msg.split(" ")[1]=="삭제"){
     if(!joinbot.includes(msg.replace("%블랙리스트 삭제 ",""))){
       replier.reply("해당 유저는 가입되지 않았습니다.");
       return;
     }
     if(!blacklist.includes(msg.replace("%블랙리스트 삭제 ",""))){
       replier.reply("블랙리스트에 없는 유저입니다.");
       return ;
     }
     DataBase.setDataBase("낚시봇 블랙리스트", DataBase.getDataBase("낚시봇 블랙리스트").replace(msg.replace("%블랙리스트 삭제 ","")+"\n",""));
     replier.reply("삭제 완료");
   }else if(msg.split(" ")[1]=="확인"){
     replier.reply("블랙리스트 현황입니다.");
     replier.reply(DataBase.getDataBase("낚시봇 블랙리스트").replace(null,""));
   }
 }else if(msg.split(" ")[0]=="%초기화"){
   var message3 = msg.replace("%초기화 ","");
   if(!joinbot.includes(message3)){
     replier.reply("해당 유저는 없습니다.");
     return ;
   }
   replier.reply("해당 유저의 데이터가 삭제됩니다.");
   DataBase.setDataBase("낚시봇 가입리스트",DataBase.getDataBase("낚시봇 가입리스트").replace(message3,""));
 }
 }else if(isGroupChat==false){
   if(msg==password){
     replier.reply("op권한을 획득하셨습니다. 봇 리로드시, 해당 권한은 없어지며 다시 로그인하셔야합니다.");
     islog_in[sender]=true;
   }
 }

}