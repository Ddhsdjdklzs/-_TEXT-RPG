//대응소스 (수정X)
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

const j = '!';

const AS = '\u200d'.repeat(500);

const FS = FileStream;

const Path = '/sdcard/Life/', UserPath = '/sdcard/Life/UserListData.txt';

const line = 'ㅡ'.repeat(16);

const Aline = 'ㅡ'.repeat(24);

const acces = '[THE LIFE]\n' + line + '\n';

if(!FS.read(UserPath)) FS.write(UserPath, JSON.stringify([], null, 4));

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, xxx, Id2){

  let p = scan(Id2);

  let Players = JSON.parse(FS.read(UserPath));

  //닉변감지
  if(p.Name !== sender){ p.Name = sender; save(Id2, p); }

  //가입 명령어
  if(msg === j + '가입'){
    
    if(p){ replier.reply(acces + '이미 가입하셨습니다.'); return }

    let DisplayId = generateId(9);

    Data = {

      'Name' : sender,

      'Code' : DisplayId, /* 사용자 코드 */

      'Ban' : false,

      'Message' : [],

      'Title' : '(칭호없음)',

      'Mine' : {

        'isMining' : false

      }
      
    }

    Players.unshift({'Name' : sender, 'userId' : Id2, 'Id' : DisplayId});

    FS.write(UserPath, JSON.stringify(Players, null, 4));

    FS.write(Path + Id2 + '.txt', JSON.stringify(Data, null, 4));

    replier.reply(acces + sender + '님께서 가입하셨습니다.\'!도움말\'을 입력해 도움을 받아보세요.');

  }

  if(msg.startsWith(j) && !p){ replier.reply(acces + '가입을 해주세요.'); return; }

  if(msg.startsWith(j) && p.Ban){ replier.reply(acces + '밴 상태입니다.'); return; }

  if(p.Message.length !== 0){ replier.reply('띵동! ' + sender + '님께 ' + p.Message.length + '개의 메세지가 도착했습니다.' + AS + '\n' + p.Message.join(Aline)); }

  //편지 명령어
  if(RegExp('/^' + j + '편지\\s(.+)\\s(.+)').test(msg)){

    let targetInfo = Players.find(e => e.Id === RegExp.$1);

    if(!targetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    let s = scan(targetInfo.userId);

    s.Message.push('\n보낸이 : ' + sender + '\n내용 : ' + RegExp.$2);

    save(targetInfo.userId, s);

    replier.reply(acces + sender + '님께서 ' + targetInfo.Name + '님께 메세지를 전달하셨습니다.');

  }

  //광질 명령어
  if(msg === j + '광질'){

    if(p.Mine.isMining){ replier.reply(acces + '이미 광질중입니다.'); return; }

    replier.reply(acces + '[(' + p.Title + ')' + sender + ']님이 광질을 시작하셨습니다.');

    wait(p.Mine.Time);

    

  }

}

/** 사용자의 데이터 불러오는 함수 scan(유저아이디) */
function scan(Id){

  return JSON.parse(FS.read(Path + Id + '.txt'));

}

/** 사용자 데이터 저장해주는 함수 save(유저아이디, 사용자의 데이터) */
function save(Id, ob){

  if(!scan(Id)){ return false; }

  FS.write(Path + Id + '.txt', JSON.stringify(ob, null, 4));

  return true;

}

function wait(sec){

  java.lang.Thread.sleep(sec * 1000);

}

/** 아이디 출력 함수 generateId(생성할 아이디 길이) */
function generateId(len){

  let result = '';
  
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for(let i = 0; i < len; i++){
  
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  
  }
  
  return result;

}






















































































































































































































































































































































































































































































































































































































































































































































































































































/*



[THE LIFE]

-가입

-광질

-가방

-곡괭이

-곡괭아 강화

-곡괭이 

-곡괭이 인첸트





















































*/