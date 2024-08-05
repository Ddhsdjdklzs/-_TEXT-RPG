/*

유저간 데이터 저장 - json
[

    각자의 데이터별로 파일 생성

    파일 이름을 유저아이디로 설정

    + 따로 유저아이디, 일반 아이디, 이름을 정리한 배열 파일 생성

    
    구조 : 
    roomId{
        userID{
            닉네임
            고유 ID

        }
    }

    이렇게 되면 항상 특정 유저 데이터를 가져올때 비효율적이에요

    '/sdcard/{게임 이름}/{roomId}/{userId}.txt' - 이게 최강 효율 - 유저 정보연결 불가능
    --------------------여기서는 roomId 필요 없을듯 보입니다. 어짜피 유저아이디는 항상 다르니 - 그럴듯 하네오 그럼 대충 정리 끝났으니 가입부터 천천히 만들어보죠

    정보연결이 뭘 말하는 ㅇㅅㅇ - 방1에서 유저1이 방2에서 게임을 플레이할 때 방1의 게임 데이터로 게임할수 있게 하는? - 그건 부계정 등록이나 멀티 계정 등록 기능 만들면 댑니다 - ㅏ
     
    상대방 정보 가져오는거요?

]

-----------광질게임

[유저 구분 방식] : 룸 이이디 + 유저아이디 - O
그럼 멤버검색도 추가

방별 정보 연결? = 정보 (대체 아이디{generateId함수 말하는거}) - O
정보검색은 방별 아이디 활용

-가입, 도움말 

-(튜토리얼) 나중에 결정

칭호 시스탬 (칭호장착 칭호구매 or 칭호뽑기) - O

(퀘스트?) 나중에 결정

문의 기능

랭킹기능
방별 1개, 전체 1개

광질 기능, 광질 중지

상점, 곡괭이 인첸트?

가방(보유 아이템 및 칭호 확인가능) + 곡괭이?



송금(방마다 각자) + 광물전송

(방마다 정보관리는 따로?) - 관리가 쉬움 | 연결된 방끼리 정보는 같이 관리? - 관리 힘듦, 그러나 유저가 편함

---------------관리자 기능

밴, 밴해제, 공지, 선물코드 생성, 아이템 지급(아이템별 고유코드 부여{generateId 사용}-잛게 관리 가능하게 i(숫자)[모듈화 필요]), (이발), 관리자 등록, 계정파괴
                                   - 아이템 검색(코드, 이름, 키워드)


*/



//게임 아이템은 모둘화 필요



//------------------------------게임 소스----------------------------------

//대응소스 (수정 불가)
function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal")) return;
    var actions = sbn.getNotification().actions;
    if (actions == null) return;
    var userId = sbn.getUser().hashCode();
    for (var n = 0; n < actions.length; n++) {
      var action = actions[n];
      if (action.getRemoteInputs() == null) continue;
      var bundle = sbn.getNotification().extras;
      var realId = bundle.getParcelableArray("android.messages")[0].get("sender_person").getKey();
      var msg = bundle.get("android.text").toString();
      var sender = bundle.getString("android.title");
      var room = bundle.getString("android.subText");
      if (room == null) room = bundle.getString("android.summaryText");
      var isGroupChat = room != null;
      if (room == null) room = sender;
      var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
      var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
      var image = bundle.getBundle("android.wearable.EXTENSIONS");
      if (image != null) image = image.getParcelable("background");
      var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
      com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
      if (this.hasOwnProperty("responseFix")) {
        responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0, realId);
      }
    }
}

//전체보기
const All = '\u200d'.repeat(500);

//모듈
const System = require('MiningModule'); //아이템 정보

//저장경로
const Path = '/sdcard/광질게임/', UserPath = '/sdcard/광질게임/Server/Users.txt'; 

//filestream
const FS = FileStream;

//작동 방리스트
const Rooms = ["카톡봇 연구소(자바스크립트)"];

//접두사
const p = '!';

//UserPath가 존재하지 않을경우 파일 생성하기
if(!FS.read(UserPath)) FS.write(UserPath, JSON.stringify([], null, 4));

function responseFix(room, msg, sender, isGroupChat, replier, ImageDB, packageName, xxx, userId){
    var T = Date.now();

    //작동 방이 아닐경우 return
    if(!Rooms.includes(room)) return;

    var user = scan(userId);
    var Players = JSON.parse(FS.read(UserPath));

    if(user){
        if(user.Name!=sender) return;
        replier.reply('이름 변경이 감지되었습니다.\n전 닉네임 : '+user.Name+'\n변경된 닉네임 : '+sender);
        user.Name = sender;
        save(userId, user);
    }

    //메세지가 접두사로 시작하지 않을경우 return
    if(!msg.startsWith(p)) return;

    //메세지의 접두사 부분 자르기
    msg = msg.slice(p.length);



    if(msg === '가입'){

        //이미 저장된 값이 존재할때
        if(user){ replier.reply('이미 가입하셨습니다.'); return; }
        
        let user_ID = generateId(8);

        Data = { 

            'Name' : sender,

            'Code' : user_ID,

            'S_Code' : null, //관리자 인증시 필요
            
            'isBanned' : false,
            
            'Gold' : 1500, //기본

            'Admin' : 0, //관리자 여부

            'Title' : System.Lvl.find(x => x.Name === '뉴비'),

            'Health' : System.Lvl.find(x => x.Name === '뉴비').max_H, //체력은 칭호와 별개
            
            'TitleInv' : [], //칭호 보유목록

            'Inv' : [], //가방
            
            'Mine' : {

                'isMinning' : false,

                'S_conut' : 0,

                'Pixaxe' : System.Pixaxe.find(x => x.Name === '나무 곡괭이') //이걸 이름 말고 코드로 가져올까요 그래도 될꺼같아오

                
            }

        };

        Players.unshift({'Name' : sender, 'Code' : user_ID, 'Id' : userId});

        FS.write(UserPath, JSON.stringify(Players, null, 4));

        FS.write(Path + userId + '.txt', JSON.stringify(Data, null, 4));

        replier.reply('광질게임에 가입하셨습니다.\n기본금 1,500G 가 지급되었습니다.');
        
        return;

    }

    if(!user){ replier.reply('가입을 먼저 해주세요'); return; }

    if(user.isBanned){ replier.reply('밴 상태입니다.'); return; }

    if(msg.startsWith('eval ')){
        let cmd = msg.substr(5)
        if(!user.Admin){ replier.reply('관리자가 아닙니다'); return; }
        if(user.Admin_Lv<2){ replier.reply('해당 명령어를 사용 할 수 있는 관리자가 아닙니다'); return; }
        replier.reply(eval(cmd));
        replier.reply((Date.now()-T)/1000+'s');
    }
    
    if(msg==="임시 관리자 등록"){ //테스트용

      if(sender!="서형") return;

      user.Admin = 3;

      replier.reply("관리자 권한이 부여되었습니다.");

      save(userId, user);

    }
    //일단 정리좀 할게요ㅠ  네 정리끝 보기좋네요 힣 헋
    if(/^관리자 등록 (.+) (\s+)$/.test(msg)){
    
        let code = RegExp.$1;

        if(!user.Admin){ replier.reply('관리자가 아닙니다.'); return; } //인증번호 확인(3 or 초기등록) 인증번호갖고 인증하는 시스템이요 ㅏ

        let TargetInfo = Players.find(x => x.Code === code);

        if(!TargetInfo){ replier.reply('유저 정보가 없습니다.\n코드를 다시 확인해주세요.'); return; }

        let s = scan(TargetInfo.Id);

        s.Admin = RegExp.$2;
   
        save(TargetInfo.Id, s);

        replier.reply(s.Name + '님이 관리자로 등록되었습니다.');

    }

    if(msg=="인증코드 생성"){
        if(user.Admin>0){ replier.reply(sender + "님은 이미 관리자입니다."); return; }

        let code;

            if(user.S_Code==null){

                code = generateSC();

                replier.reply("관리자방으로 인증코드가 전송되었습니다.");

                Api.replyRoom("room", "[광질게임 관리자 인증코드 생성]\n" + "\n요청유저: " + sender + "\n인증코드: " + code);

                user.S_Code = code;

                save(userId, user);

            }else{

            replier.reply("이미 인증코드가 발급되었습니다.");

          }
        
    }

    if(msg.startsWith("인증 ")){
        if(user.S_Code==null){ 
            replier.reply(sender+"님은 인증코드를 발급받지 않았습니다.\n'!인증코드 생성'을 입력하여 인증코드를 먼저 생성 해주세요."); 
            return; 
        }

        if(user.S_Code!==msg.substr(3)){ 
            replier.reply("인증코드가 올바르지 않습니다.\n코드를 다시 발급 해주세요."); 
            user.S_Code=null; 
            save(userId, user); 
            return; 
        }

        if(user.S_Code===msg.substr(3)){
          replier.reply("관리자 인증이 완료되었습니다.");
          user.S_Code=null;
          user.Admin=3;
          save(userId, user);
        }
    }

    if(msg==='채굴'){
        if(user.Mine.isMinning){ replier.reply('이미 채굴중입니다.'); return; }
    }
}

/** 유저 정보 불러오는 함수 */
function scan(Id){
    return JSON.parse(FS.read(Path + Id + '.txt'));
}

/** 유저 정보 저장하는 함수 */
function save(Id, ob){
    if(!scan(Id)) return false;

    FS.write(Path + Id + '.txt', JSON.stringify(ob, null, 4));
    return true;
}

/**  아이디 출력 함수 */
function generateId(len){

    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for(let i = 0; i < len; i++){
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/** 인증코드 생성 함수 */
function generateSC(){ 

    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for(let i = 0; i < 13; i++){    
        result += characters.charAt(Math.floor(Math.random() * characters.length));    
    }
        
    return result;  
}