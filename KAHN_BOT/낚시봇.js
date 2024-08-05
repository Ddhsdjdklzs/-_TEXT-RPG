/**
This work is licensed under the Creative Commons 저작자표시-비영리-동일조건변경허락 4.0 국제 License. To view a copy of this license, visit
http://creativecommons.org/licenses/by-nc-sa/4.0/.
*/

function random(small, big) {
  return Math.floor(Math.random() * (big - small)) + small;
}
function delay(time) {
  java.lang.Thread.sleep(time);
}
const titlename = ["🗝KEY🗝", "❄WINTER❄", "☢DANGER☢"];//상점 칭호 배열입니다. 갯수는 바꾸지 마시고 칭호 이름만 바꿔주세요!
const titlecost = [500, 1200, 1000000];//상점 칭호 가격 배열입니다. 갯수는 바꾸지 마시고 가격만 바꿔주세요!
const fishname = ["멸치", "붕어", "잉어", "게", "조개", "미역", "진주를 포함한 조개", "송어", "연어", "날치", "고등어", "복어", "방어", "오징어", "문어", "가오리", "장어", "편지가 든 병", "의문의 지도", "뼈", "난파선 잔해", "수류탄(?)", "빨대", "(안에 무엇이 들었는지 알수 없는 캐리어)", "의도적인 게임 디자인", "상어", "식인상어", "큰상어", "쪼끄만 상어", "유물", "심해어", "돈가방", "석양이 비치는 물방울"];//낚시로 잡을수 있는 것들의 이름입니다. 변경 가능하십니다.
const fishcost = [8, 12, 13, 9, 7, 6, 21, 18, 20, 23, 20, 17, 19, 14, 16, 24, 23, 4, 4, 5, 6, 28, 4, 6, 33, 30, 40, 50, 20, 100, 40, 200, 0];//가격 조정을 원하시면 여기서 하시면 됩니다!
const fishmin = [0, 0, 3, 6, 7, 10, 14, 17];
const fishmax = [3, 7, 11, 15, 19, 24, 28, 30];
const wait = [30, 26, 24, 22, 20, 18, 15, 10];//낚싯대 레벨에 따른 대기시간 조정은 여기서 하시면 됩니다!
const needmoney = [120, 270, 480, 700, 1000, 1400, 2000, 3000];//낚싯대 강화 가격 조정은 여기서 하시면 됩니다!
const percent = [99, 90, 80, 70, 55, 40, 20, 10];//낚싯대 강화 성공 확률은 여기서 하시면 됩니다!
const experience = [1, 3, 3, 2, 2, 1, 5, 4, 4, 3, 4, 4, 4, 5, 5, 6, 7, 11, 15, 12, 10, 13, 1, 20, 21, 15, 15, 15, 15, 30, 26, 10, 1];//경험치 조정을 원하시면 여기서 하시면됩니다!
const ROOM = ["반응할 방을 추가해주세요."];//반응할 방 조정은 여기서 하시면 됩니다!
/*
반응할 방 추가는 [ ] 사이에 ["방1", "방2", "방3"] 식으로 해주세요!
(※ 뒤에 ; 는 지우시면 안됩니다!)
*/

var isplay = {};
var play = {};
var fisher = {};
var N = {};
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if (!ROOM.includes(room)) 
    return;
  try {
    var joinbot;
    joinbot = DataBase.getDataBase("낚시봇 가입리스트").split("\n");
  }  catch (e) {
  joinbot = [""];
}
  if (msg == "%가입") {
    if (joinbot.includes(sender)) {
      replier.reply("이미 가입하셨습니다. 가입을 하지 않으셨는데 해당 메시지가 뜨면 다른 닉네임의 유저가 사용하고 있을수 있습니다.");
      return;
    }
    if (sender.includes("\n") || sender.includes( "‮")) {
      replier.reply("일부 특수문자가 포함된 닉네임은 가입이 불가능합니다.");
      return;
    }
    DataBase.setDataBase("낚시봇 가입리스트", DataBase.getDataBase("낚시봇 가입리스트") + "\n" + sender);
    setting(joinbot.length);
    replier.reply("축하합니다! 낚시봇에 가입되셨습니다! 아래 규칙을 읽어주시고 따라주세요.\n《 규칙 》\n1. 봇으로 도배를 하지 않는다.\n2. 봇을 악용하지 않는다.\n3. 봇 소유자의 잘못되지 않은 조치에 반발하지 않는다.\n\n위 규칙을 지키지 않을시, 봇 사용이 제제되거나 불이익을 받을 수 있습니다.\n낚시봇에 가입하신건 해당 규칙을 지키는 것에 동의하는것이라고 간주합니다. 부디 해당 규칙들을 지키며 즐거운 마음으로 봇을 사용해주시길 부탁드립니다. 설명은 %낚시봇 설명 입니다. 즐거운 봇 사용 되세요!");
    return;
  }
  if (!joinbot.includes(sender)) 
    return;
  try {
    var blacklist;
    blacklist = DataBase.getDataBase("낚시봇 블랙리스트").split("\n");
  }  catch (e) {
  blacklist = [""];
}
  if (blacklist.includes(sender)) 
    return;
  let user_index = joinbot.indexOf(sender);
  var message = msg.split(" ");
  if (message[0] == "%낚시봇") {
    if(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 돈") == undefined){
      DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 돈", DataBase.getDataBase("낚시봇 "+sender+"님의 돈"));
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨", DataBase.getDataBase("낚시봇 "+sender+"님의 낚싯대 레벨"));
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 레벨", DataBase.getDataBase("낚시봇 "+sender+"님의 레벨"));
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호", DataBase.getDataBase("낚시봇 "+sender+ "님의 소유한 칭호"));
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 장착한 칭호", DataBase.getDataBase("낚시봇 "+sender+ "님의 장착한 칭호"));
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 랭크점수", "0");
    }
    var money = Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 돈"));
    switch (message[1]) {
      case "내정보":
        if (message[2] == undefined) 
          show_important(user_index, replier, sender);
        break;
      case "정보":
        let username = msg.replace("%낚시봇 정보 ", "");
        if (username.charAt(0) == "@") 
          username = username.replace("@", "");
        if (!joinbot.includes(username)) {
          replier.reply("해당 유저의 정보를 찾지 못했습니다..");
          return;
        }
        
        if(DataBase.getDataBase("낚시봇 " + joinbot.indexOf(username) + "번 유저의 돈") == undefined){
          replier.reply("해당 유저의 갱신이 진행되지 않았습니다. 해당 유저가 낚시봇 명령어를 쳐야합니다!");
          return;
        }
        
        show_important(joinbot.indexOf(username), replier, username);
        break;
      case "유저번호":
        let username2 = msg.replace("%낚시봇 유저번호 ", "");
        if (username2.charAt(0) == "@") 
          username2 = username2.replace("@", "");
        if (!joinbot.includes(username2)) {
          replier.reply("해당 유저의 정보를 찾지 못했습니다..");
          return;
        }
      replier.reply(joinbot.indexOf(username2));
      break;
      case "낚시":
        if (isplay[sender] != undefined) 
          return;
        isplay[sender] = 0;
        replier.reply("낚시를 시작합니다..\n대기 시간 : " + wait[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1] + "초\n기다림 끝엔 무엇이 있을까요?");
        let fish = random(fishmin[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1], fishmax[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1]);
        let bonus = Math.floor(Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 레벨")) / 100);
        if(fishname[fish] == undefined||fishcost[fish] == undefined){
          replier.reply("[ ERR#1 ] 스크립트 로그에 기록된 로그를 복사하여 전체코드와 함께 카페에 올려주세요.\n\nhttps://cafe.naver.com/botkakao");
          Log.e("fish : " + fish+ "\nlevel : " + Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) + "\nfishmax : [ " + fishmax.join(", ") + " ]");
          return;
        }
        delay(wait[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1] * 1000);
        money = Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 돈"));
        replier.reply("{ " + sender + " }\n" + fishname[fish] + "를 낚았습니다!\n" + money + "원 => " + (money + bonus + fishcost[fish]) + "원(+" + fishcost[fish] + ")" + "(+" + bonus + ")");
        DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 돈", money + fishcost[fish] + bonus);
        DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 레벨", (Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 레벨"))) + experience[fish]);
        isplay[sender] = undefined;
        break;
      case "칭호장착":
        let titlenam = DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호").split("\n");
        if (isNaN(Number(msg.replace("%낚시봇 칭호장착 ", "")))) {
          replier.reply("정확한 숫자값을 입력해주세요.");
          return;
        }
        if (titlenam[Number(msg.replace("%낚시봇 칭호장착 ", "")) - 1] == undefined || Number(msg.replace("%낚시봇 칭호장착 ", "")) < 1) {
          replier.reply("해당 번호의 칭호가 없습니다.");
          return;
        }
        DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 장착한 칭호", titlenam[Number(msg.replace("%낚시봇 칭호장착 ", "")) - 1]);
        replier.reply(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 장착한 칭호") + "으로 변경되었습니다!");
        break;
      case "강화":
        if (message[2] == undefined) {
          if (Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) > 7) {
            replier.reply("최대로 강화하셨습니다!");
            return;
          }
          if (money >= needmoney[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1]) {
            var n = random(0, 100);
            if (n < percent[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1]) {
              replier.reply("♧ 강화 성공! ♧\n\n낚싯대 레벨 : " + (1 + Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨"))) + "렙 달성!");
              money = money - needmoney[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1];
              DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 돈", money);
              DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨", 1 + Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")));
              return;
            } else 
              replier.reply("\xa4 강화 실패 \xa4\n\n낚싯대 레벨 : " + Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) + "렙");
          } else {
            replier.reply("돈이 부족합니다.\n필요 금액 : " + needmoney[DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨") - 1] + "원");
            return;
          }
          DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 돈", money - needmoney[Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨")) - 1]);
        }
        break;
      case "설명":
        replier.reply("\xa4 낚시봇 설명 \xa4​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n\n\n%낚시봇 내정보 명령어로 자신의 정보를 확인하실수 있습니다!\n%낚시봇 정보 (닉넴) 혹은 %낚시봇 정보 @(닉넴) 으로 (닉넴) 분의 정보를 볼수도 있어요!\n\n%낚시봇 낚시 로 낚시를 하실수 있어요!(낚싯대 레벨에 따라 잡을수 있는'것'이 늘어날 수 있고 낚시 속도도 빨라진답니다 소곤소곤)\n%낚시봇 강화 으로 낚싯대의 레벨을 올리세요! 하지만 가격은 만만하기만 하진 않으실겁니다..\n%낚시봇 칭호장착 (번호) 명령어로 칭호를 장착하세요! 소유한 칭호는 %낚시봇 칭호확인 으로 보실수 있고 칭호는 %낚시봇 칭호상점 에서 칭호를 확인하고 원하는 칭호는 %낚시봇 칭호구매 (번호) 로 구매하실 수 있어요!\n송금은 2레벨 부터 이용가능하며, 사용법은 %낚시봇 송금 (닉네임) (금액) 입니다!");
        break;
      case "칭호상점":
        replier.reply("현재 상점에 올라와있는 칭호입니다!\n\n" + titlename[0] + "  " + titlecost[0] + "원\n" + titlename[1] + "  " + titlecost[1] + "원\n" + titlename[2] + "  " + titlecost[2] + "원\n\n구매는 %낚시봇 칭호구매 (번호) 입니다!");
        break;
      case "칭호구매":
        if (isNaN(Number(msg.replace("%낚시봇 칭호구매 ", "")))) {
          replier.reply("정확한 값을 입력해주세요");
          return;
        }
        let whatnum = Number(msg.replace("%낚시봇 칭호구매 ", ""));
        var titles = DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호").split("\n");
        if (titles.includes(titlename[whatnum - 1])) {
          replier.reply("이미 소유한 칭호입니다.");
          return;
        }
        if (titlename[whatnum - 1] == undefined) {
          replier.reply("1 2 3중 하나를 선택하셔야 해요!");
          return;
        }
        if (titlecost[whatnum - 1] > money) {
          replier.reply("돈이 부족합니다.");
          return;
        }
        replier.reply("축하드립니다! " + titlename[whatnum - 1] + " 칭호를 획득하셨습니다!");
        DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 돈", money - titlecost[whatnum - 1]);
        DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호", DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호") + titlename[whatnum - 1] + "\n");
        break;
      case "칭호확인":
        var title = DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호").split("\n");
        var text = sender + "님이 소유한 칭호 목록입니다.\n\n";
        for (var i = 1; i < title.length; i++) 
          text = text + i + ". " + title[i - 1] + "\n";
        replier.reply(text);
        break;
      case "송금":
        if (Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 레벨")) < 100) {
          replier.reply("송금은 2레벨 부터 이용가능합니다!");
          return;
        }
        let moneyy = msg.split(" ")[msg.split(" ").length - 1];
        let reciever = msg.replace("%낚시봇 송금 ", "");
        if (reciever.startsWith("@")) 
          reciever = reciever.replace("@", "");
        reciever = reciever.replace(" " + moneyy, "");
        if (joinbot.indexOf(reciever) == -1) {
          replier.reply("존재하지 않는 유저입니다. 닉네임을 다시 한번 확인해주세요!");
          return;
        }
        if(DataBase.getDataBase("낚시봇 " + joinbot.indexOf(reciever) + "번 유저의 돈") == undefined){
          replier.reply("해당 유저의 갱신이 진행되지 않았습니다. 해당 유저가 낚시봇 명령어를 쳐야합니다!");
          return;
        }
        if (isNaN(moneyy)) {
          replier.reply("%낚시봇 송금 (유저 닉네임) (금액) 형식으로 입력해주세요!");
          return;
        }
        if (reciever == sender) {
          replier.reply("자기 자신에게 송금한다라..");
          return;
        }
        moneyy = Math.floor(moneyy);
        if (moneyy == 0) {
          replier.reply("'줄까 말까' 뭐 그런건가요?");
          return;
        }
        if (moneyy < 0) {
          replier.reply("어디서 이런 도둑 같은 짓을!");
          return;
        }
        if (moneyy > money) {
          replier.reply("소유하신 금액보다 많아요!\n현재 돈 : " + money);
          return;
        }
        DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 돈", money - moneyy);
        DataBase.setDataBase("낚시봇 " + joinbot.indexOf(reciever) + "번 유저의 돈", moneyy + Number(DataBase.getDataBase("낚시봇 " +joinbot.indexOf(reciever)+ "번 유저의 돈")));
        Log.i(sender + "님이 " + reciever + "님에게 " + moneyy + "원을 송금함");
        replier.reply("[ " + reciever + " ] 님에게 " + moneyy + "원 송금했습니다.\n현재 내 돈 : " + DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 돈") + "\n현재 대상의 돈 : " + DataBase.getDataBase("낚시봇 " + joinbot.indexOf(reciever) + "번 유저의 돈") + "\n송금한 금액은 환불이 불가능할 수 있습니다.");
        break;
      case "최적화요청":
        replier.reply("최적화를 시작합니다..봇의 전송 속도가 너무 느려졌을때만 사용해주세요.\n낚시가 취소될수 있습니다.");
        Api.reload("낚시봇");
        break;
      case "건의사항":
        replier.reply("건의사항이 작성되었습니다! 건의 감사드립니다!");
        Log.i(msg.replace("%낚시봇 건의사항 ", "") + " -" + sender + "-");
        break;
      case "버그보고서작성":
        replier.reply("작성 완료됨.");
        Log.e(msg.replace("%낚시봇 버그보고서작성 ", "") + " -" + sender + "-");
        break;
      default:
        replier.reply("해당 명령어는 존재하지 않습니다.");
    }
  }
}
//가입시, 기본 셋팅
function setting(user_index) {
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 돈", "0");
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨", "1");
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 레벨", "0");
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호", "<뉴비>\n");
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 장착한 칭호", "<뉴비>");
  DataBase.setDataBase("낚시봇 " + user_index + "번 유저의 랭크점수", "0");
}
//%낚시봇 내정보 에서 내정보 보여주기
function show_important(user_index, replier, sender) {
  let text = DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 장착한 칭호") + "\n" + sender + "\n\n";
  text += "●레벨 : " + ((Number(DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 레벨"))) / 100).toFixed(2) + "렙";
  text += "\n●돈 : " + DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 돈") + "원";
  text += "\n●낚싯대 레벨 : " + DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 낚싯대 레벨") + "렙";
  let much = DataBase.getDataBase("낚시봇 " + user_index + "번 유저의 소유한 칭호").split("\n");
  text += "\n●소유한 칭호 : " + --much.length + "개";
  replier.reply(text);
}
