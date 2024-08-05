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
        responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
      }
    }
}

const UnFL = '━━━━━━━━━━━━━━━━';
const FL = '━━━━━━━━━━━━━━━━━━━━━━━━';
const OA = [
    {'Name' : '돌', 'Rank' : '일반'}, {'Name' : '조약돌', 'Rank' : '일반'}, {'Name' : '석탄', 'Rank' : '일반'}, {'Name' : '구리', 'Rank' : '일반'}, {'Name' : '납', 'Rank' : '일반'}, {'Name' : '아연', 'Rank' : '일반'}, {'Name' : '철', 'Rank' : '일반'}, {'Name' : '망간', 'Rank' : '일반'}, {'Name' : '주석', 'Rank' : '일반'}, {'Name' : '석회석', 'Rank' : '일반'},
    {'Name' : '규석', 'Rank' : '일반'}, {'Name' : '장석', 'Rank' : '일반'}, {'Name' : '방해석', 'Rank' : '일반'}, {'Name' : '고령토', 'Rank' : '일반'}, {'Name' : '운모', 'Rank' : '일반'}, {'Name' : '활석', 'Rank' : '일반'}, {'Name' : '불석', 'Rank' : '일반'}, {'Name' : '규조토', 'Rank' : '일반'}, {'Name' : '규회석', 'Rank' : '일반'}, {'Name' : '명반석', 'Rank' : '일반'},
    {'Name' : '사문석', 'Rank' : '일반'}, {'Name' : '석면', 'Rank' : '일반'}, {'Name' : '석영', 'Rank' : '일반'}, {'Name' : '자수정', 'Rank' : '일반'}, {'Name' : '중정석', 'Rank' : '일반'}, {'Name' : '홍주석', 'Rank' : '일반'}, {'Name' : '흑철석', 'Rank' : '일반'},
    {'Name' : '흑연', 'Rank' : '일반'},
    {'Name' : '은', 'Rank' : '희귀'}, {'Name' : '금', 'Rank' : '희귀'}, {'Name' : '아만타디움', 'Rank' : '희귀'}, {'Name' : '다이아몬드', 'Rank' : '희귀'}, {'Name' : '백금', 'Rank' : '희귀'}, {'Name' : '가넷', 'Rank' : '희귀'}, {'Name' : '사파이어', 'Rank' : '희귀'}, {'Name' : '에메랄드', 'Rank' : '희귀'}, {'Name' : '연옥', 'Rank' : '희귀'}, {'Name' : '미스릴', 'Rank' : '희귀'},
    {'Name' : '알루미늄', 'Rank' : '초희귀'}, {'Name' : '니켈', 'Rank' : '초희귀'}, {'Name' : '탄산나트륨', 'Rank' : '초희귀'}, {'Name' : '인', 'Rank' : '초희귀'}, {'Name' : '칼슘카보네이트', 'Rank' : '초희귀'}, {'Name' : '유연석고', 'Rank' : '초희귀'}, {'Name' : '우라늄', 'Rank' : '초희귀'}, {'Name' : '크롬', 'Rank' : '초희귀'}, {'Name' : '플래티넘', 'Rank' : '초희귀'}, {'Name' : '루테늄', 'Rank' : '초희귀'},
    {'Name' : '코발트', 'Rank' : '영웅'}, {'Name' : '리튬', 'Rank' : '영웅'}, {'Name' : '오리하르콘', 'Rank' : '영웅'}, {'Name' : '금강석', 'Rank' : '영웅'}, {'Name' : '흑요석', 'Rank' : '영웅'}, {'Name' : '쿤자이트', 'Rank' : '영웅'}, {'Name' : '티타늄', 'Rank' : '영웅'}, {'Name' : '아메트린', 'Rank' : '영웅'}, {'Name' : '레드 사파이어', 'Rank' : '영웅'}, {'Name' : '영석', 'Rank' : '영웅'}, 
    {'Name' : '로들라이트', 'Rank' : '전설'}, {'Name' : '핑크다이아몬드', 'Rank' : '전설'}, {'Name' : '레드 다이아몬드', 'Rank' : '전설'}, {'Name' : '스피넬', 'Rank' : '전설'}, {'Name' : '지르콘', 'Rank' : '전설'}, {'Name' : '머스그레이비트', 'Rank' : '전설'}, {'Name' : '헤소나이트', 'Rank' : '전설'}, {'Name' : '파이어 오팔', 'Rank' : '전설'}, {'Name' : '데만토이드가넷', 'Rank' : '전설'}, {'Name' : '레인보우 다이아몬드', 'Rank' : '전설'},
    {'Name' : '고대생물', 'Rank' : '초월'}, {'Name' : '운석', 'Rank' : '초월'}, {'Name' : '특별한 조각', 'Rank' : '초월'}, {'Name' : '은하수', 'Rank' : '초월'}, {'Name' : '공허', 'Rank' : '초월'}, {'Name' : '특별한 돌', 'Rank' : '초월'}, {'Name' : '균열의 돌', 'Rank' : '초월'}, {'Name' : '고대의 책', 'Rank' : '초월'}, {'Name' : 'UFO', 'Rank' : '초월'}, {'Name' : '녹아버린 돌', 'Rank' : '초월'}, 
    {'Name' : '우주 조각', 'Rank' : '영원'}, {'Name' : '행성의 파편', 'Rank' : '영원'}, {'Name' : '버터의 팬티', 'Rank' : '영원'}, {'Name' : '시공주머니', 'Rank' : '영원'}, {'Name' : '???', 'Rank' : '영원'},
    {'Name' : '불의 조각', 'Rank' : '불멸'}, {'Name' : '???의 심장', 'Rank' : '불멸'}, {'Name' : '영혼 조각', 'Rank' : '불멸'}
];
const FS = FileStream;
const Path = '/sdcard/RPG/UserData/';
const RankPath = '/sdcard/RPG/Data/Ranking.txt';
const OrePath = '/sdcard/RPG/DATA/OreArr.txt';
const FW = '\u200b'.repeat(500);
const OwnerHash = [];

if(!FS.read(RankPath)) FS.write(RankPath, JSON.stringify([], null, 4));

if(!FS.read(OrePath)) FS.write(OrePath, JSON.stringify(OA, null, 4));

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName){

    let HashCode = new java.lang.String(imageDB.getProfileHash());
    let Time = new Date().getTime();
    let p = scan(sender);
    let Ranking = JSON.parse(FS.read(RankPath));
    let OreArr = JSON.parse(FS.read(OrePath));

    //-----------------------개인톡 옵션

    //----------------------------가입

    if(msg.startsWith('!가입 ')){

        if(scan(sender)){ replier.reply('[THE LIFE]\n이미 가입하셨습니다.'); return; }

        if(isGroupChat){ replier.reply('[THE LIFE]\n가입은 봇 갠톡에서 진행해주세요.'); return; }

        if(scan(sender)){

            if(p.HashCode === Number(HashCode)){ replier.reply('[THE LIFE]\n이미 가입하셨습니다.'); return; }

            if(p.HashCode !== Number(HashCode)){ replier.reply('[THE LIFE]\n존재하는 아이디입니다.'); return; }

        }
        if(sender.length > 10){ replier.reply('[THE LIFE]\n닉네임 길이 한도를 초과하였습니다.'); return; }

        if(sender.includes('@') || sender.includes('/') || sender.includes('￦') || sender.includes(':') || sender.includes('*') || sender.includes('?') || sender.includes('"') || sender.includes('<') || sender.includes('>') || sender.includes('|')){ replier.reply('[THE LIFE]\n닉네임에 사용불가능한 문자가 포함되어 있습니다.'); return; }

        let Code = String(msg.slice(4));

        if(Code.length < 8){ replier.reply('[THE LIFE]\n비밀번호가 너무 짧습니다.'); return; }

            Data = {
                //이름
                'Name' : sender,
                //해시코드
                'HashCode' : Number(HashCode),
                //비밀번호
                'LogCode' : Code,
                //로그인 여부
                'isLogged' : false,
                //칭호
                'Title' : '(뉴비)',
                //밴 여부
                'isBanned' : false,
                //골드
                'Gold' : 10000,
                //경험치
                'Exp' : 0,
                //광질
                'Oreing' : {
                    //곡괭이
                    'Pixaxe' : {
                        //곡괭이 이름
                        'Name' : '기본 곡괭이',
                        //곡괭이 레벨
                        'Level' : 1,
                        //레벨업 비용
                        'Lcost' : 1000000,
                        //광질 쿨타임
                        'Time' : 60,
                        //쿨타임 줄인
                        'DeTime' : 0
                    },
                    //곡괭이 인벤토리
                    'PixIn' : [],
                    //광질 여부
                    'isOreing' : false,
                    //광물 가방
                    'Bag' : []
                },
                //에너지
                'Energy' : {
                    //최대 에너지
                    'MaxEnergy' : 100,
                    //현재 에너지
                    'NowEnergy' : 100
                }
            };

            FS.write(Path + sender + '.txt', JSON.stringify(Data, null, 4));
            p = scan(sender);
            Ranking.push({'Name' : sender, 'Gold' : 10000, 'Exp' : 0});
            RankSave(Ranking);
            replier.reply('[THE LIFE]\n' + sender + '님께서 가입하셨습니다.');
            replier.reply('\'!로그인 (비밀번호)\' 혹은 \'!도움말\' 을 입력해 도움을 받아보세요.\n\n※카카오톡 이름 혹은 프로필 사진 변경시 봇 사용이 불가능합니다.(책임 안짐)');
            return;
    }

    if(msg === '!도움말'){
        //한줄에 20자 이상 == 내려쓰기 괄호 안 내용 제외
        replier.reply([
            '〈          도움말          〉',
            FW,
            '《접두사 : !》',,
            '📁---------------------------',,
            '[가입 (비밀번호)]',
            '┗ 봇 개인톡에서 해당 계정으로',
            '     게임에 가입합니다.',,
            '⛏---------------------------',,
            '[광질]',
            '┗ 광질을 시작합니다.',,
            '[광질종료]',
            '┗ 광질을 종료합니다.',,
            '[G판매 (광물 번호)]',
            '┗ 해당하는 광물을 판매합니다.',,
            '[G일괄판매]',
            '┗ 사용자의 모든 광물을 판매합니다.',,
            //효과가 있는 명령어는 괄호로 특별 설명 붙이는거
            '[곡괭이]',
            '┗ 사용자의 곡괭이 리스트를 봅니다.',,
            '[곡괭이 뽑기]',
            '┗ 곡괭이를 뽑습니다.',,
            '[곡괭이 강화]',
            '┗ 곡괭이를 강화합니다.(광질 쿨타임 감소)',,
            '〈 Made by 아몬드 〉'
        ].join('\n'));
        return;
    }
    //------------가입여부


    if(msg.startsWith('!')){ if(!scan(sender)){ replier.reply('[THE LIFE]\n가입을 해주세요.'); return;} }

    if(msg.startsWith('!로그인 ')){
        let isCode = msg.slice(5);

        if(isGroupChat){ replier.reply('[THE LIFE]\n로그인은 봇 갠톡에서 진행해주세요.'); return; }

        if(p.isLogged === true){ replier.reply('[THE LIFE]\n이미 로그인 되셨습니다.'); return; }

        if(p.LogCode !== isCode){ replier.reply('[THE LIFE]\n비밀번호가 일치하지 않습니다.'); return; }

        p.isLogged = true;
        save(sender, p);
        replier.reply('[THE LIFE]\n로그인에 성공하셨습니다. \'!Set\'을 입력해 계정을 설정해보세요.');
    }

    if(msg === '!Set'){
        if(isGroupChat){ replier.reply('[THE LIFE]\n세팅은 봇 갠톡에서 진행해주세요.'); return; }
        if(p.isLogged === false){ replier.reply('[THE LIFE]\n로그인을 해주세요.'); return; }
        replier.reply([
            '〈          명령어          〉',,
            '《접두사 : !》',,
            '💾---------------------------',,
            '[계정삭제]',
            '┗ 현재 계정을 삭제합니다.',,
            '[로그아웃]',
            '┗ 현재 적용된 계정에서',
            '     로그아웃 합니다.',,
            '[코드변경 (비밀번호)]',
            '┗ 현재 적용된 비밀번호를',
            '     (비밀번호)값으로 변경합니다.',,
            '[재설정]',
            '┗ 계정을 초기화 합니다.',,
            '[프로필변경 (해시코드)]',
            '┗ 현재 적용된 해시코드를',
            '     (해시코드)값으로 변경합니다.',,
            '〈 Made by 아몬드 〉'
        ].join('\n'));
    }

    //--------------------------게임조건 확인

    if(msg === '!해시코드'){ replier.reply('[THE LIFE]\n' + sender + '님의 해시코드\n' + Number(HashCode)); return; }

    if(!isGroupChat){ return; }

    //--------------------------그룹챗 옵션

    if(msg.startsWith('!')){ if(scan(sender)){ if(p.HashCode !== Number(HashCode)){ replier.reply('[THE LIFE]\n프로필이 일치하지 않습니다.'); return; } } }
    
    if(msg.startsWith('!')){ msg = msg.slice(1); } else { return; }

    if(p.isBanned){ replier.reply('[THE LIFE]\n밴 상태입니다.'); return; }
    
    //------------------------명령어 시작

    if(msg === '가방'){
        let res = '[' + p.Title + sender + ']님의 가방' + FW + '\n━━━━━━━━━━━━━━━━━━━━';

        if(p.Oreing.Bag.length === 0){ res += '\n(비었음)'; replier.reply(res); return; }
        for(i in p.Oreing.Bag){
            let isLock = (p.Oreing.Bag[i].Lock)?'(🔒)':'';
            res +='\n' + isLock + '『' + (Number(i) + 1) + '』[' + p.Oreing.Bag[i].Rank + '] ' + p.Oreing.Bag[i].Name + ' : ' + ReplaceToKorean(p.Oreing.Bag[i].Cost, 'G') + '\n━━━━━━━━━━━━━━━━━━━━';
        }

        replier.reply(res);
    }

    if(/^가방 @?(.+)$/.test(msg)){
        let target = RegExp.$1.trim();

        if(!scan(target)){ replier.reply('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }

        let s = scan(target);

        let res = '[' + s.Title + target + ']님의 가방' + FW + '\n━━━━━━━━━━━━━━━━━━━━';

        if(s.Oreing.Bag.length === 0){ res += '\n(비었음)'; replier.reply(res); return; }

        for(i in s.Oreing.Bag){
            let isLock = (s.Oreing.Bag[i].Lock)?'(🔒)':'';
            res +='\n' + isLock + '『' + (Number(i) + 1) + '』[' + s.Oreing.Bag[i].Rank + '] ' + s.Oreing.Bag[i].Name + ' : ' + ReplaceToKorean(s.Oreing.Bag[i].Cost, 'G') + '\n━━━━━━━━━━━━━━━━━━━━';
        }

        replier.reply(res);
    }

    if(msg === '광질종료'){
        p.Oreing.isOreing = false;
        save(sender, p);
        replier.reply('[THE LIFE]\n광질이 종료되었습니다.');
    }

    if(msg === '곡괭이'){

        let res = '[THE LIFE]\n[' + p.Title + sender + ']님의 곡괭이\n' + FW + FL;
        if(p.Oreing.PixIn.length === 0){ res += '\n(비었음)'; return; }
        for(i in p.Oreing.PixIn){

        }
    }

    if(/^G잠금 (.+)$/.test(msg)){
        let rk = RegExp.$1;
        let b = [];
        let amt = 0;

        for(i in p.Oreing.Bag){
            if(p.Oreing.Bag[i].Rank === rk){
                p.Oreing.Bag[i].Lock = true;
                amt++
                b.push(i);
            }
        }
        if(b.length === 0){
            replier.reply('[THE LIFE]\n해당 등급의 광물이 존재하지 않습니다.');
            return;
        }
        replier.reply('[THE LIFE]\n' + amt + '개의 광물을 잠금했습니다.');
        save(sender, p);
    }

    if(/^G잠금 (\d+)$/.test(msg)){
        let num = Number(RegExp.$1);
        if(!p.Oreing.Bag[num - 1]){ replier.reply('[THE LIFE]\n존재하지 않는 값입니다.'); return; }

        p.Oreing.Bag[num - 1].Lock = true;
        replier.reply('[THE LIFE]\n광물을 잠금했습니다.');
        save(sender, p);
    }

    if(/^G잠금해제 (.+)$/.test(msg)){
        let rk = RegExp.$1;
        let b = [];
        let amt = 0;
        for(i in p.Oreing.Bag){
            if(p.Oreing.Bag[i].Rank === rk){
                p.Oreing.Bag[i].Lock = false;
                amt++
                b.push(i);
            }
        }
        if(b.length === 0){
            replier.reply('[THE LIFE]\n해당 등급의 광물이 존재하지 않습니다.');
            return;
        }
        replier.reply('[THE LIFE]\n' + amt + '개의 광물을 잠금해제 했습니다.');
        save(sender, p);
    }

    if(/^G잠금해제 (\d+)$/.test(msg)){
        let num = Number(RegExp.$1);
        if(!p.Oreing.Bag[num - 1]){ replier.reply('[THE LIFE]\n존재하지 않는 값입니다.'); return; }

        p.Oreing.Bag[num - 1].Lock = false;
        replier.reply('[THE LIFE]\n광물을 잠금해제 했습니다.');
        save(sender, p);
    }

    //-------------------------------------------게임중엔 작동X

    /*
    let a = [{'Name' : '꽝', 'Rank' : '일반'}, {'Name' : '꽝1', 'Rank' : '일반'},{'Name' : '꽝2', 'Rank' : '야스'},{'Name' : '꽝3', 'Rank' : '일반'},{'Name' : '꽝4', 'Rank' : '일반'},{'Name' : '꽝5', 'Rank' : '일반'},{'Name' : '꽝6', 'Rank' : '일반'},{'Name' : '꽝7', 'Rank' : '전설'},]

여기중에서 새로운 b라는 변수에 a에 있는 요소들중 Rank값이 일반인 요소들을 넣어주는 코드 짜줘
    */
    /*
    if(p.Oreing.isOreing){ replier.reply('[THE LIFE]\n광질중엔 이용이 불가능합니다.'); return; }
    if(p.Fishing.isFishing){ replier.reply('[THE LIFE]\n낚시중엔 이용이 불가능합니다.'); return; }
    */
    if(msg.startsWith('G판매 ')){
        if(p.Oreing.isOreing){ replier.reply('[THE LIFE]\n광질중엔 이용이 불가능합니다.'); return; }
        let num = Number(msg.slice(4));
        if(!p.Oreing.Bag[num - 1]){ replier.reply('[THE LIFE]\n존재하지 않는 광물입니다.'); return; }
        if(p.Oreing.Bag[num - 1].Lock){ replier.reply('[THE LIFE]\n잠금된 광물입니다.'); return; }
        let cst = Number(p.Oreing.Bag[num - 1].Cost);
        replier.reply('[THE LIFE]\n[' + p.Title + sender + '님이 ' + p.Oreing.Bag[num - 1].Name + '을(를) 판매하여 ' + ReplaceToKorean(cst, 'G') + '를 획득하셨습니다.');
        p.Gold += p.Oreing.Bag[num - 1].Cost;
        p.Oreing.Bag.splice(num - 1, 1);
        save(sender, p);
        RankSave(Ranking);
    }

    if(msg === 'G일괄판매'){
        if(p.Oreing.isOreing){ replier.reply('[THE LIFE]\n광질중엔 이용이 불가능합니다.'); return; }
        if(p.Oreing.Bag.length === 0){ replier.reply('[THE LIFE]\n판매할 광물이 없습니다.'); return; }
        let count = 0;
        let Ecost = 0;
        let a;
        for(i in p.Oreing.Bag){
            if(!p.Oreing.Bag[i].Lock){
                count++;
                Ecost += p.Oreing.Bag[i].Cost;
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
        RankSave(Ranking);
        replier.reply('[THE LIFE]\n[' + p.Title + sender + '님이 광물 ' + count + '개를 판매해 ' + ReplaceToKorean(Ecost, 'G') + '를 획득하셨습니다.');
    }

    if(msg === '광질'){
        if(p.Energy.NowEnergy <= 0){ replier.reply('[THE LIFE]\n에너지가 부족합니다.'); return; }
        //낚시중도 표기하기!
        if(p.Oreing.isOreing){ replier.reply('[THE LIFE]\n이미 광질중입니다.'); return; }
        if(p.Oreing.Bag.length >= 300){ replier.reply('[THE LIFE]\n양동이가 꽉찼습니다.'); return; }

        p.Oreing.isOreing = true;
        save(sender, p);
        replier.reply('[THE LIFE]\n[' + p.Title + sender + ']님이 광질을 시작하셨습니다.\n(' + p.Oreing.Pixaxe.Time + '-' + p.Oreing.Pixaxe.DeTime + ') 초');
        wait(p.Oreing.Pixaxe.Time - p.Oreing.Pixaxe.DeTime);
        if(!p.Oreing.isOreing){ return; }
        let Rank = PercentRandom(['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸'], [4109, 3000, 1500, 800, 500, 70, 20, 1])
        const ores = getRandomName(OreArr, Rank);
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
        p.Oreing.Bag.push({'Name' : ores, 'Rank' : Rank, 'Cost' : cost});
        p.Oreing.Bag = cleanSort(p.Oreing.Bag);
        p.Exp += 5;
        RankSave(Ranking);
        save(sender, p);
    }

    if(msg === '곡괭이 강화'){

        if(p.Oreing.isOreing){ replier.reply('[THE LIFE]\n광질중엔 이용이 불가능합니다.'); return; }

        if(p.Oreing.Pixaxe.Level >= 100){ replier.reply('[THE LIFE]\n곡괭이가 만렙입니다.'); return; }

        if(p.Gold < p.Oreing.Pixaxe.Lcost){ replier.reply('[THE LIFE]\n강화비용이 ' + ReplaceToKorean((p.Oreing.Pixaxe.Lcost - p.Gold), 'G') + '부족합니다.'); return; }
        
        p.Oreing.Pixaxe.Level += 1;

        p.Gold -= p.Oreing.Pixaxe.Lcost;

        p.Oreing.Pixaxe.Lcost = Math.floor(p.Oreing.Pixaxe.Lcost * 1.3);

        p.Oreing.Pixaxe.DeTime += 0.3;

        replier.reply('[THE LIFE]\n곡괭이 강화에 성공하셨습니다.\n(' + (p.Oreing.Pixaxe.Level - 1) + ' => ' + p.Oreing.Pixaxe.Level + ')');

        save(sender, p);
    }

}

/** 사용자의 데이터 불러오는 함수 scan(사용자의 이름) */
function scan(Name){
    return JSON.parse(FS.read(Path + Name + '.txt'));
}

/** 사용자 데이터 저장해주는 함수 save(사용자의 이름, 사용자의 데이터) */
function save(Name, ob){
    if(!scan(Name)){
        return false;
    }
    FS.write(Path + Name + '.txt', JSON.stringify(ob, null, 4));
    return true;
}

function RankSave(ob){
    FS.write(RankPath, JSON.stringify(ob, null, 4));
    return true;
}

function wait(sec){
    java.lang.Thread.sleep(sec * 1000);
}

/** 제한 있는 랜덤함수 */
function Getrandom(Min, Max){
    return Math.round(Math.random() * (Max - Min)) + Min;
}

/** 원하는 확률로 뽑아오기 */
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

function comma(num){
    let parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

  /*
function MakeKorean(amount, danwee){
    if(isNaN(amount)){
        return false;
    }
    if(amount === 0){
        return 0 + String(danwee);
    }
    let res = String(amount).split('').reverse().reduce(())
    
}
*/
v