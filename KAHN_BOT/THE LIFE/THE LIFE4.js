
//주석은 붙이기

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

//THE LIFE 명령어 모듈
const LifeM = require('RPGModule');
//THE LIFE리스트 모듈
const LifeL = require('LifeLists');
//광물리스트 가져오기
const OreArr = LifeL.LifeOre;
//명령어가져오기
const cmd = LifeM.Lifecmd;
//객체
const Data = LifeM.LifeOb;
//파일스트림
const FS = FileStream;
//유저 저장경로
const Path = '/sdcard/RPG/UserData/';
//랭킹 저장경로
const RankPath = '/sdcard/RPG/ServerData/Ranking.txt';
//전체보기
const FW ='\u200b'.repeat(500);
//일반 짝대기
const SS = "━━━━━━━━━━━━━━";
//전체보기 짝대기
const LL = "━━━━━━━━━━━━━━━━━━━━━━━━";
//봇 개인톡 링크
const Blink = 'google.com';
//봇을 쓸 방 리스트
const Rlist = [];
//꾸밈
const Tt = '[THE LIFE]\n';
//허용X닉
const Nname = ['@', '/', '￦', ':', '*', '?', '<', '>', '|', '"', '\'', ','];

//랭킹파일 생성
if(!FS.read(RankPath)) FS.write(RankPath, JSON.stringify([], null, 4));

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, xxxx, FullUserId){

    let p = scan(sender);

    //가입명령어
    if(msg.startsWith(cmd.join + ' ')){

        if(scan(sender)){
        
            if(p.HashCode !== Number(Hc)){ replier.reply(Tt + '이미 존재하는 아이디입니다.'); return; }
        
            if(p.HashCode === Number(Hc)){ replier.reply(Tt + '이미 가입하셨습니다.'); return; }
        
        }

        for(i in Nname){

            if(sender.includes(Nname[i])){ replier.reply(Tt + '닉네임에 특수문자가 포함되어 있습니다.'); break; }
            
        }

        if(sender.length > 10){ replier.reply(Tt + '닉네임 길이 한도를 초과하였습니다.'); return; }

        if(sender.length < 1){ replier.reply(Tt + '닉네임이 너무 짧습니다.'); return; }

        let Code = msg.slice(cmd.join.length + 1);

        if(Code.length < 6){ replier.reply(Tt + '비밀번호가 너무 짧습니다.'); return; }

        if(Code.length > 19){ replier.reply(Tt + '비밀번호가 너무 깁니다.'); return; }

        FS.write(Path + sender + '.txt', JSON.stringify(Data, null, 4));

        p.HashCode = Number(Hc);

        save(sender, p);

        replier.reply(Tt + sender + '님께서 게임에 가입하셨습니다.');

        replier.reply('\'!도움말\' 을 입력해 도움을 받아보세요.\n\n※카카오톡 이름 혹은 프로필 사진 변경시 봇 사용이 불가능합니다.(책임 안짐)');

    }

    //가입X?
    if(msg.startsWith('!')){

        if(!scan(sender)){ replier.reply(Tt + '가입을 해주세요.'); return; }

    }

    //프로필 갱신
    if(msg.startsWith(cmd.refresh + ' ')){

        if(isGroupChat){ replier.reply(Tt + '프로필 업데이트는 봇 개인톡에서 진행해주세요.\n' + Blink); return; }
        
        let c = msg.slice(cmd.refresh.length + 1);

        if(p.LogCode !== c){ replier.reply(Tt + '비밀번호가 일치하지 않습니다.'); return; }
    
        p.HashCode = Number(Hc);

        save(sender, p);

        replier.reply(Tt + '프로필이 갱신되었습니다.');

    }

    //도움말 명령어
    if(msg === cmd.help){

        replier.reply([

            ''

        ].join('\n'));

    }

    //개인톡에서 플레이 X
    if(!isGroupChat){ return; }

    //방 확인(필요없다면 지우기)
    if(!Rlist.includes(room)){ return; }

    //해시코드
    if(msg === cmd.Hash){ replier.reply(Tt + sender + '님의 해시코드\n' + Number(Hc)); return; }

    //해시코드 일치X 일때
    if(msg.startsWith('!')){ if(scan(sender)){ if(p.HashCode !== Number(Hc)){ replier.reply(Tt + '프로필이 일치하지 않습니다.새로고침을 해주세요.\n' + Blink); return; } } }
    
    //밴상태일때
    if(msg.startsWith('!')){ if(p.isBanned){ replier.reply(Tt + '밴 상태입니다.'); return; } }

    //메일이 도착했을때
    if(p.Mail.length !== 0){ replier.reply(Tt + '띵동! ' + sender + '님께 ' + p.Mail.length + '개의 메세지가 도착했습니다.' + FW + '\n' + LL + p.Mail.join('\n' + LL)); p.Mail = []; save(sender, p); }

    //설정명령어
    if(cmd.setting.test(msg)){

        let num = RegExp.$1;

        let onf = RegExp.$2;

        if(isNaN(tool)){ replier.reply(Tt + '올바른 값을 입력해주세요.'); return; }

        if(onf === 'on'){
       
            if(p.Setting[num - 1]){ replier.reply(Tt + '이미 켜진 기능입니다.'); return; }
       
            p.Setting[num - 1] = true;
       
            save(sender, p);
            
            replier.reply(Tt + '설정값을 변경했습니다.');

            return;
        
        }
        
        if(onf === 'off'){

            if(!p.Setting[num - 1]){ replier.reply(Tt + '이미 꺼진 기능입니다.'); return; }
       
            p.Setting[num - 1] = false;

            save(sender, p);

            replier.reply(Tt + '설정값을 변경했습니다.');

            return;
        
        }

        else {

            replier.reply(Tt + '올바른 값을 입력해주세요.');

            return;

        }

    }

    //메일쓰기 명령어
    if(cmd.mail.test(msg)){

        let target = RegExp.$1.trim();

        let message = RegExp.$2

        if(!scan(target)){ replier.reply(Tt + '존재하지 않는 사용자입니다.'); return; }

        let s = scan(target);

        if(s.Setting[2]){ replier.reply(Tt + '메일을 차단한 사용자입니다.'); return; }

        replier.reply(sender + '님께서 ' + target + '님께 메세지를 전달하셨습니다.');
        
        s.Mail.push('\n내용 : ' + message + '\n보낸이 : ' + sender);

    }

    















    //가방 명령어
    if(msg === cmd.bag){

        let res = '[' + p.Title + sender + ']님의 가방' + FW + '\n' + LL;
    
        if(p.Oreing.Bag.length === 0){ res += '\n(비었음)'; replier.reply(res); return; }

        for(i in p.Oreing.Bag){

            let isLock = (p.Oreing.Bag[i].Lock) ? '●' : '○';

            res +='\n' + isLock + '『' + (Number(i) + 1) + '』[' + p.Oreing.Bag[i].Rank + '] ' + p.Oreing.Bag[i].Name + ' : ' + ReplaceToKorean(p.Oreing.Bag[i].Cost, 'G') + '\n' + LL;
       
        }
    
        replier.reply(res);
        
    }

    //상대방 가방명령어
    if(cmd.ebag.test(msg)){

        let target = RegExp.$1.trim();

        if(!scan(target)){ replier.reply(Tt + '존재하지 않는 사용자입니다.'); return; }

        let s = scan(target);

        let res = '[' + s.Title + target + ']님의 가방' + FW + '\n' + LL;

        if(s.Oreing.Bag.length === 0){ res += '\n(비었음)'; replier.reply(res); return; }

        for(i in s.Oreing.Bag){

            let isLock = (s.Oreing.Bag[i].Lock) ? '●' : '○';
            
            res +='\n' + isLock + '『' + (Number(i) + 1) + '』[' + s.Oreing.Bag[i].Rank + '] ' + s.Oreing.Bag[i].Name + ' : ' + ReplaceToKorean(s.Oreing.Bag[i].Cost, 'G') + '\n' + LL;
        
        }

        replier.reply(res);

    }

    //잠금명령어
    if(msg.startsWith(cmd.lock + ' ')){

        let gap = msg.slice(cmd.lock.length + 1);

        if(!isNaN(gap)){

            if(!p.Oreing.Bag[gap - 1]){ replier.reply(Tt + '존재하지 않는 값입니다.'); return; }

            if(p.Oreing.Bag[gap - 1].Lock){ replier.reply(Tt + '이미 잠금된 광물입니다.'); return; }

            p.Oreing.Bag[gap - 1].Lock = true;

            save(sender, p);

            replier.reply(Tt + '광물을 잠금했습니다.' + FW + '\n' + LL + '\n[' + p.Oreing.Bag[gap - 1].Rank + ']' + p.Oreing.Bag[gap - 1].Name);

            return;

        }

        let rak = ['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸'];

        if(!rak.includes(gap)){ replier.reply(Tt + '존재하지 않는 등급입니다.'); return; }

        let res = Tt + '광물을 잠금했습니다.' + FW + '\n' + LL;

        let amt = 0

        for(i in p.Oreing.Bag){

            if(p.Oreing.Bag[i].Rank === gap){

                p.Oreing.Bag[i].Lock = true;

                amt++;

                res += '\n[' + p.Oreing.Bag[i].Rank + ']' + p.Oreing.Bag[i].Name;

            }

        }

        if(amt === 0){

            replier.reply(Tt + '해당 등급의 광물이 존재하지 않습니다.');
        
            return;
        
        }
        
        replier.reply(res);
        
        save(sender, p);

    }

    //잠금해제 명령어
    if(msg.startsWith(cmd.unlock + ' ')){

        let gap = msg.slice(cmd.unlock.length + 1);

        if(!isNaN(gap)){

            if(!p.Oreing.Bag[gap - 1]){ replier.reply(Tt + '존재하지 않는 값입니다.'); return; }

            if(!p.Oreing.Bag[gap - 1].Lock){ replier.reply(Tt + '해당하는 광물이 잠금상태가 아닙니다.'); return; }

            p.Oreing.Bag[gap - 1].Lock = false;

            save(sender, p);

            replier.reply(Tt + '광물을 잠금해제 했습니다.' + FW + '\n' + LL + '\n[' + p.Oreing.Bag[gap - 1].Rank + ']' + p.Oreing.Bag[gap - 1].Name);

            return;

        }

        let rak = ['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸'];

        if(!rak.includes(gap)){ replier.reply(Tt + '존재하지 않는 등급입니다.'); return; }

        let res = Tt + '광물을 잠금해제 했습니다.' + FW + '\n' + LL;

        let amt = 0

        for(i in p.Oreing.Bag){

            if(p.Oreing.Bag[i].Rank === gap){

                p.Oreing.Bag[i].Lock = false;

                amt++;

                res += '\n[' + p.Oreing.Bag[i].Rank + ']' + p.Oreing.Bag[i].Name;

            }

        }

        if(amt === 0){

            replier.reply(Tt + '해당 등급의 광물이 존재하지 않습니다.');
        
            return;
        
        }
        
        replier.reply(res);
        
        save(sender, p);

    }

    //광물 전송 명령어
    if(cmd.sendore.test(msg)){

        let target = RegExp.$1;

        let num = RegExp.$2;

        if(!scan(target)){ replier.reply(Tt + '존재하지 않는 사용자입니다.'); return; }

        let s = scan(target);

        if(!p.Oreing.Bag[num - 1]){ replier.reply(Tt + '존재하지 않는 광물입니다.'); return; }

        if(p.Oreing.Bag[num - 1].Lock){ replier.reply(Tt + '잠금된 광물입니다.'); return; }

        s.Oreing.Bag.push(p.Oreing.Bag[num - 1]);

        s.Oreing.Bag = cleanSort(s.Oreing.Bag);

        p.Oreing.Bag.splice(num - 1, 1);

        save(sender, p);

        save(target, s);

    }

    //----------------------------------------광질, 낚시중엔 작동X

    //판매 명령어
    if(msg.startsWith(cmd.sell + ' ')){

        if(p.Oreing.isOreing){ replier.reply(Tt + '광질중엔 이용이 불가능합니다.'); return; }
        
        let gap = msg.slice(cmd.sell.length + 1);

        if(!isNaN(gap)){

        if(!p.Oreing.Bag[gap - 1]){ replier.reply(Tt + '존재하지 않는 광물입니다.'); return; }
        
        if(p.Oreing.Bag[gap - 1].Lock){ replier.reply(Tt + '잠금된 광물입니다.'); return; }
        
        let cst = p.Oreing.Bag[gap - 1].Cost;

        p.Gold += cst;

        p.Oreing.Bag.splice(gap - 1, 1);

        save(sender, p);

        replier.reply(Tt + '[' + p.Title + sender + '님이 광물을 판매하여 ' + ReplaceToKorean(cst, 'G') + '를 획득하셨습니다.' + FW + '\n' + LL + '\n[' + p.Oreing.Bag[gap - 1].Rank + ']' + p.Oreing.Bag[gap - 1].Name); 
    
        return;

        }

        let rak = ['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸'];

        if(!rak.includes(gap)){ replier.reply(Tt + '존재하지 않는 등급입니다.'); return; }

        let res = Tt + '광물을 판매했습니다.\n' + FW + LL + '\n';

        let arr = [];

        let amt = 0

        for(i in p.Oreing.Bag){

            if(p.Oreing.Bag[i].Rank === gap){

                if(!p.Oreing.Bag[i].Lock){

                amt++;
                
                arr.push('[' + p.Oreing.Bag[i].Rank + ']' + p.Oreing.Bag[i].Name);

                }

            }

        }

        if(amt === 0){

            replier.reply(Tt + '해당 등급의 광물이 존재하지 않습니다.');
        
            return;
        
        }

        p.Oreing.Bag = p.Oreing.Bag.filter(ore => ore.Rank !== gap || ore.Lock);
        
        replier.reply(res + arr.join('\n'));
        
        save(sender, p);

    }

    //일괄판매 명령어
    if(msg === cmd.allsell){

        if(p.Oreing.isOreing){ replier.reply('[THE LIFE]\n광질중엔 이용이 불가능합니다.'); return; }
        
        if(p.Oreing.Bag.length === 0){ replier.reply('[THE LIFE]\n판매할 광물이 없습니다.'); return; }
        
        let count = 0;
        
        let Ecost = 0;
        
        let al = ''
        
        for(i in p.Oreing.Bag){
        
            if(!p.Oreing.Bag[i].Lock){
        
                count++;
        
                Ecost += p.Oreing.Bag[i].Cost;

                al += '[' + p.Oreing.Bag[i].Rank + ']' + p.Oreing.Bag[i].Name;
        
            }
        
        }
        
        if (p.Oreing.Bag.every(ore => ore.Lock)) {
        
            replier.reply('[THE LIFE]\n판매할 광물이 없습니다.');
        
            return;
        
        }
        
        if (p.Oreing.Bag.some(ore => ore.Lock)) {

            p.Oreing.Bag = p.Oreing.Bag.filter(ore => ore.Lock);

        }

        else {

            p.Oreing.Bag = [];

        }

        p.Gold += Ecost;

        save(sender, p);

        replier.reply(Tt + '[' + p.Title + sender + '님이 광물 ' + count + '개를 판매해 ' + ReplaceToKorean(Ecost, 'G') + '를 획득하셨습니다.' + FW + '\n' + LL + '\n' + al.join('\n'));
    
    }

    //광질명령어(기존)
    if(msg === cmd.orestart){

        //낚시중도 표기하기!
        if(p.Oreing.isOreing){ replier.reply(Tt + '이미 광질중입니다.'); return; }

        if(p.Oreing.Bag.length >= 300){ replier.reply(Tt + '가방이 꽉찼습니다.'); return; }

        if(p.Energy.NowEnergy <= 0){ replier.reply(Tt + '에너지가 부족합니다.'); return; }

        p.Oreing.isOreing = true;

        save(sender, p);

        replier.reply(Tt + '[' + p.Title + sender + ']님이 광질을 시작하셨습니다.\n(' + p.Oreing.Pixaxe.Time + '-' + p.Oreing.Pixaxe.DeTime + ') 초');

        wait(p.Oreing.Pixaxe.Time - p.Oreing.Pixaxe.DeTime);

        if(!p.Oreing.isOreing){ return; }

        let Rank = PercentRandom(['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸'], [4109, 3000, 1500, 800, 500, 70, 20, 1])
        
        let ores = getRandomName(OreArr, Rank);

        let cost;

        if(Rank === '일반'){ cost = Getrandom(10, 1000); }

        if(Rank === '희귀'){ cost = Getrandom(1000, 10000); }

        if(Rank === '초희귀'){ cost = Getrandom(10000, 100000); }

        if(Rank === '영웅'){ cost = Getrandom(100000, 1000000); }

        if(Rank === '전설'){ cost = Getrandom(1000000, 8000000); }

        if(Rank === '초월'){ cost = Getrandom(8000000, 50000000); }

        if(Rank === '영원'){ cost = Getrandom(50000000, 500000000); }

        if(Rank === '불멸'){ cost = Getrandom(500000000, 2000000000); }

        replier.reply('[THE LIFE]\n[' + p.Title + sender + ']님이 [' + Rank + ']' + ores + '을/를 채굴하셨습니다.');

        p.Oreing.isOreing = false;

        p.Energy.NowEnergy -= 2;

        p.Oreing.Bag.push({'Name' : ores, 'Rank' : Rank, 'Cost' : cost, 'Lock' : false});

        p.Oreing.Bag = cleanSort(p.Oreing.Bag);

        p.Exp += 5;

        save(sender, p);

    }














































































































































































    //-------------------관리자 전용

    //밴명령어
    if(cmd.ban.test(msg)){

        if(p.Dev === 1){ replier.reply(Tt + '서포터가 아닙니다.'); return; }

        let target = RegExp.$1.trim();

        if(!scan(target)){ replier.reply(Tt + '존재하지 않는 사용자입니다.'); return; }

        let s = scan(target);

        if(s.isBanned === true){ replier.reply(Tt + '이미 밴상태인 사용자입니다.'); return; }

        if(s.Dev > 1){ replier.reply(Tt + '관리자는 밴이 불가능합니다.'); return; }

        s.isBanned = true;

        save(target, s);

        replier.reply(Tt + '사용자 ' + target + '님을 밴상태로 전환합니다.');

    }

    //언밴명령어
    if(cmd.unban.test(msg)){

        if(p.Dev === 1){ replier.reply(Tt + '서포터가 아닙니다.'); return; }

        let target = RegExp.$1.trim();

        if(!scan(target)){ replier.reply(Tt + '존재하지 않는 사용자입니다.'); return; }

        let s = scan(target);

        if(s.isBanned === false){ replier.reply(Tt + '밴상태가 아닙니다.'); return; }

        if(s.Dev > 1){ replier.reply(Tt + '관리자는 밴 해제가 불가능합니다.'); return; }

        s.isBanned = false;

        save(target, s);

        replier.reply(Tt + '사용자 ' + target + '님을 밴 해제 상태로 전환합니다.');

    }

    //관리자 등록 명령어
    if(cmd.rk.test(msg)){

        if(p.Dev !== 4){ replier.reply(Tt + '오너가 아닙니다.'); return; }

        let target = RegExp.$1.trim();

        let rk = RegExp.$2;

        if(!scan(target)){ replier.reply(Tt + '존재하지 않는 사용자입니다.'); return; }

        let s = scan(target);

        if(rk === '1'){ s.Dev = 1; save(target, s); replier.reply(Tt + target + '님을 멤버로 변경합니다.'); return; }

        if(rk === '2'){ s.Dev = 2; save(target, s); replier.reply(Tt + target + '님을 서포터로 변경합니다.'); return; }
        
        if(rk === '3'){ s.Dev = 3; save(target, s); replier.reply(Tt + target + '님을 관리자로 변경합니다.'); return; }
        
        if(rk === '4'){ s.Dev = 4; save(target, s); replier.reply(Tt + target + '님을 오너로 변경합니다.'); return; }
        
        else{ replier.reply(Tt + '존재하지 않는 등급입니다.'); return; }
    
    }

}

//유저 정보 읽기
function scan(Name){

    return JSON.parse(FS.read(Path + Name + '.txt'));

}

//유저 정보 저장
function save(Name, ob){

    if(!scan(Name)){

        return false;

    }

    FS.write(Path + Name + '.txt', JSON.stringify(ob, null, 4));

    return true;

}

//쓰레드
function wait(sec){

    java.lang.Thread.sleep(sec * 1000);

}

//제한걸린 숫자뽑아내기
function Getrandom(Min, Max){

    return Math.round(Math.random() * (Max - Min)) + Min;

}

//배열 퍼센트 뽑기
function PercentRandom(Names, Percent){

    if(Names.length !== Percent.length){ return false; } //없어도 되긴 하는데 넣는걸 추천드립니다.

    const TotalPercent = Percent.reduce((x, y) => x + y, 0);

    let number = Math.random() * TotalPercent;

    for (i in Names){

        number -= Percent[i];

        if (number <= 0) {

        return Names[i];

        }

    }

}

//RKname에 해당되는 랭크에서 아무 {'Name' : 'dasd', 'Rank' : '랭크'}이름 하나 빼옴
function getRandomName(arr, RKname){

    const gap = arr.filter(function(x){

      return x.Rank === RKname;

    });

    const index = Math.floor(Math.random() * gap.length);

    return gap[index].Name;

}

//나중에 락 여부있는것도 추가해야함
//낚시, 광질 양동이 정렬함수 :>
function cleanSort(arr) {

    return arr.sort((a, b) => b.Cost - a.Cost);

}

//숫자 한글변경
function ReplaceToKorean(amount, danwee){

    if(amount == 0) return 0 + danwee;

    const cost = ['만', '억', '조', '경', '해', '자', '양'];

    let a = String(Math.floor(amount)).split('').reverse();

    let res = (a.reduce((x, y, i) => x.concat((i + 1) % 4 === 0 ?

    [y, (cost[i / 4 | 0]).concat(' ')] : y), []).reverse().join('').split(/(\D+)(\d{4})/).map((z) => /\D/.test(z) ?

    z : (Number(z) || '')).join('').replace(/^\D+| \D+/g, '   ').trim() + danwee);

    return res;

}

function code(){

    let num = Math.round(Math.random() * (9999999 - 1111111 + 1)) + 1111111;

    let str = num.toString();

    let res = '';

    for(i in str){

        let asc = str.charCodeAt(i);
    
        let cod = String.fromCharCode(asc + 64);

        res += cod;

    }

    return res.toUpperCase();

}