/*
신용등급, 돈 특괄호
이름 대괄호









*/
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
const OreArr = [
    {'Name' : '돌', 'Rank' : '일반'}, {'Name' : '조약돌', 'Rank' : '일반'}, {'Name' : '석탄', 'Rank' : '일반'}, {'Name' : '구리', 'Rank' : '일반'}, {'Name' : '납', 'Rank' : '일반'}, {'Name' : '아연', 'Rank' : '일반'}, {'Name' : '철', 'Rank' : '일반'}, {'Name' : '망간', 'Rank' : '일반'}, {'Name' : '주석', 'Rank' : '일반'}, {'Name' : '석회석', 'Rank' : '일반'},
    {'Name' : '규석', 'Rank' : '일반'}, {'Name' : '장석', 'Rank' : '일반'}, {'Name' : '방해석', 'Rank' : '일반'}, {'Name' : '고령토', 'Rank' : '일반'}, {'Name' : '운모', 'Rank' : '일반'}, {'Name' : '활석', 'Rank' : '일반'}, {'Name' : '불석', 'Rank' : '일반'}, {'Name' : '규조토', 'Rank' : '일반'}, {'Name' : '규회석', 'Rank' : '일반'}, {'Name' : '명반석', 'Rank' : '일반'},
    {'Name' : '사문석', 'Rank' : '일반'}, {'Name' : '석면', 'Rank' : '일반'}, {'Name' : '석영', 'Rank' : '일반'}, {'Name' : '자수정', 'Rank' : '일반'}, {'Name' : '중정석', 'Rank' : '일반'}, {'Name' : '홍주석', 'Rank' : '일반'}, {'Name' : '흑철석', 'Rank' : '일반'},
    {'Name' : '흑연', 'Rank' : '일반'}, 
    {'Name' : '은', 'Rank' : '희귀'}, {'Name' : '금', 'Rank' : '희귀'}, {'Name' : '아만타디움', 'Rank' : '희귀'}, {'Name' : '다이아몬드', 'Rank' : '희귀'}, {'Name' : '백금', 'Rank' : '희귀'}, {'Name' : '가넷', 'Rank' : '희귀'}, {'Name' : '사파이어', 'Rank' : '희귀'}, {'Name' : '에메랄드', 'Rank' : '희귀'}, {'Name' : '연옥', 'Rank' : '희귀'}, {'Name' : '미스릴', 'Rank' : '희귀'}, 
    {'Name' : '코발트', 'Rank' : '영웅'}, {'Name' : '리튬', 'Rank' : '영웅'}, {'Name' : '오리하르콘', 'Rank' : '영웅'}, {'Name' : '금강석', 'Rank' : '영웅'}, {'Name' : '흑요석', 'Rank' : '영웅'}, {'Name' : '쿤자이트', 'Rank' : '영웅'}, {'Name' : '티타늄', 'Rank' : '영웅'}, {'Name' : '아메트린', 'Rank' : '영웅'}, {'Name' : '레드 사파이어', 'Rank' : '영웅'}, {'Name' : '영석', 'Rank' : '영웅'}, 
    {'Name' : '로들라이트', 'Rank' : '전설'}, {'Name' : '핑크다이아몬드', 'Rank' : '전설'}, {'Name' : '레드 다이아몬드', 'Rank' : '전설'}, {'Name' : '스피넬', 'Rank' : '전설'}, {'Name' : '지르콘', 'Rank' : '전설'}, {'Name' : '머스그레이비트', 'Rank' : '전설'}, {'Name' : '헤소나이트', 'Rank' : '전설'}, {'Name' : '파이어 오팔', 'Rank' : '전설'}, {'Name' : '데만토이드가넷', 'Rank' : '전설'}, {'Name' : '레인보우 다이아몬드', 'Rank' : '전설'},
    {'Name' : '고대생물', 'Rank' : '초월'}, {'Name' : '운석', 'Rank' : '초월'}, {'Name' : '특별한 조각', 'Rank' : '초월'}, {'Name' : '은하수', 'Rank' : '초월'}, {'Name' : '공허', 'Rank' : '초월'}, {'Name' : '특별한 돌', 'Rank' : '초월'}, {'Name' : '균열의 돌', 'Rank' : '초월'}, {'Name' : '고대의 책', 'Rank' : '초월'}, {'Name' : 'UFO', 'Rank' : '초월'}, {'Name' : '녹아버린 돌', 'Rank' : '초월'}, 
    {'Name' : '우주 조각', 'Rank' : '영원'}, {'Name' : '행성의 파편', 'Rank' : '영원'}, {'Name' : '버터의 팬티', 'Rank' : '영원'}, {'Name' : '시공주머니', 'Rank' : '영원'}, {'Name' : '???', 'Rank' : '영원'},
    {'Name' : '불의 조각', 'Rank' : '불멸'}, {'Name' : '???의 심장', 'Rank' : '불멸'}, {'Name' : '영혼 조각', 'Rank' : '불멸'}
];
const FishArr = [
    {'Name' : '고등어', 'Rank' : '일반'}, {'Name' : '멸치', 'Rank' : '일반'}, {'Name' : '연어', 'Rank' : '일반'}, {'Name' : '갈치', 'Rank' : '일반'}, {'Name' : '잡어', 'Rank' : '일반'}, {'Name' : '숭어', 'Rank' : '일반'}, {'Name' : '붕어', 'Rank' : '일반'}, {'Name' : '꽁치', 'Rank' : '일반'}, {'Name' : '송어', 'Rank' : '일반'}, {'Name' : '청어', 'Rank' : '일반'}, 
    {'Name' : '오징어', 'Rank' : '희귀'}, {'Name' : '우럭', 'Rank' : '희귀'}, {'Name' : '참치', 'Rank' : '희귀'}, {'Name' : '방어', 'Rank' : '희귀'}, {'Name' : '문어', 'Rank' : '희귀'}, {'Name' : '광어', 'Rank' : '희귀'}, {'Name' : '돌돔', 'Rank' : '희귀'}, {'Name' : '낙지', 'Rank' : '희귀'}, {'Name' : '소라', 'Rank' : '희귀'}, {'Name' : '상어', 'Rank' : '희귀'}, 
    {'Name' : '참돔', 'Rank' : '영웅'}, {'Name' : '감성돔', 'Rank' : '영웅'}, {'Name' : '농어', 'Rank' : '영웅'}, {'Name' : '가시고기', 'Rank' : '영웅'}, {'Name' : '쏘가리', 'Rank' : '영웅'}, {'Name' : '금붕어', 'Rank' : '영웅'}, {'Name' : '백상아리', 'Rank' : '영웅'}, {'Name' : '참다랑어', 'Rank' : '영웅'}, {'Name' : '장어', 'Rank' : '영웅'}, {'Name' : '전어', 'Rank' : '영웅'}, 
    {'Name' : '레인보우 피쉬', 'Rank' : '전설'}, {'Name' : '고래', 'Rank' : '전설'}, {'Name' : '대왕오징어', 'Rank' : '전설'}, {'Name' : '크라켄', 'Rank' : '전설'}, {'Name' : '버터의 눈물', 'Rank' : '전설'}, {'Name' : '골드샤크', 'Rank' : '전설'}, {'Name' : '흑동고래', 'Rank' : '전설'}, {'Name' : '자수정피쉬', 'Rank' : '전설'}, 
    {'Name' : '버터의 마지막 조각', 'Rank' : '초월'}, {'Name' : '책', 'Rank' : '초월'}, {'Name' : '버터의 저주가 씌인 팬티', 'Rank' : '초월'}, {'Name' : '버터의 마지막 머리카락', 'Rank' : '초월'}, {'Name' : '신비한 조각', 'Rank' : '초월'}, 
    {'Name' : '녹아버린 돌조각', 'Rank' : '영원'}, {'Name' : '개발자의 팬티', 'Rank' : '영원'}, {'Name' : '운석파편', 'Rank' : '영원'}, {'Name' : '버터의 낚싯대', 'Rank' : '영원'}, 
    {'Name' : '오르넷', 'Rank' : '불멸'}, {'Name' : '???의 봉인사슬', 'Rank' : '불멸'}
];
const TitleArr = ['뉴비', '거지', '노숙자', '바바리맨', '구속된', '느끼한', '과학자', '노예','랭킹 1위', '녹아버린', '모쏠', '낚시를 좋아하는', '고수', '신', '부개발자', '수집가', '패왕', '변태', '재벌', '물고기 애호가', '판사', '야스왕', '씹변태', '게임 중독', '오타쿠', '게임 10년차', '버터', '아몬드', '탈모왕', '고인물', '썩은물', '해커', '쁘띠', '잼민이', '대머리', '기부천사', '(❁´◡`❁)', '^_^', '(¬_¬ )', '(╯°□°）', '씹덕', '썩은', '응애'];
const Mrank = ['『MEMBER』', '『STANDARD』', '『STARSHIP』', '『STARPLUS』', '『VIP』', '『VVIP』', '『SVIP』', '『MVIP』', '『XVIP』', '『MASTER』', '『DEVELOPER』'];
const FS = FileStream;
const j = '!';
const Path = '/sdcard/RPG/UserData/';

const OrePath = '/sdcard/RPG/ServerData/OreArray.txt';
const FishPath = '/sdcard/RPG/ServerData/FishArray.txt';

const Notice = '/sdcard/RPG/ServerData/Notice.txt';

const TradeCenter = '/sdcard/RPG/ServerData/TradeCenter.txt';

const RankPath = '/sdcard/RPG/ServerData/Ranking.txt';

const TitleList = '/sdcard/RPG/ServerData/Title.txt';

const UserHash = '/sdcard/RPG/ServerData/HashCode.txt';

const FW = '\u200b'.repeat(500);
const StoreList1 = [];
//{Name : ''}
const ItemList = []
//광물 배열 파일
if(!FS.read(OrePath)) FS.write(OrePath, JSON.stringify(OreArr, null, 4));
//물고기 배열 파일
if(!FS.read(FishPath)) FS.write(FishPath, JSON.stringify(FishArr, null, 4));
//랭킹파일
if(!FS.read(RankPath)) FS.write(RankPath, JSON.stringify([], null, 4));
//거래소 파일
if(!FS.read(TradeCenter)) FS.write(TradeCenter, JSON.stringify([], null, 4));
//공지파일
if(!FS.read(Notice)) FS.write(Notice, JSON.stringify('(공지 없음)', null, 4));
//칭호 파일
if(!FS.read(TitleList)) FS.write(TitleList, JSON.stringify(TitleArr, null, 4));
//해시코드 파일
if(!FS.read(UserHash)) FS.write(UserHash, JSON.stringify([], null, 4));

//if(!FS.read(TitleList)) FS.write(TitleList, JSON.stringify(OA, null, 4));
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName){

    let Ranking = JSON.parse(FS.read(RankPath));

    let Trade = JSON.parse(FS.read(RankPath));

    let Not = JSON.parse(FS.read(Notice));

    let Rtitle = JSON.parse(FS.read(TitleList));

    let HashList = JSON.parse(FS.read(UserHash));
    
    let p = scan(sender);

    let hc = new java.lang.String(imageDB.getProfileHash());

    if(msg.startsWith(j)){ if(isGroupChat == false){ return; } }

    if(msg === j + '가입'){
        if(sender.length > 10){ say('[THE LIFE]\n닉네임 길이 한도를 초과하였습니다.'); return; }
        if(sender.includes('@') || sender.includes('/') || sender.includes('￦') || sender.includes(':') || sender.includes('*') || sender.includes('?') || sender.includes('"') || sender.includes('<') || sender.includes('>') || sender.includes('|')){ say('[THE LIFE]\n닉네임에 사용불가능한 문자가 포함되어 있습니다.'); return; }
        if(scan(sender)){ if(p.HashCode == hc){ say('[THE LIFE]\n이미 가입하셨습니다.'); return; } }
        if(scan(sender)){ if(p.HashCode !== hc){ say('[THE LIFE]\n존재하는 아이디입니다.'); return; } }
        else {
            Data = {
                //이름
                'Name' : sender,
                //해시코드
                'HashCode' : Number(hc),
                //밴 여부
                'isBanned' : false,
                //관리자 여부
                'isDev' : false,
                //고급 관리자 여부
                'isProDev' : false,
                //오너 여부
                'isCre' : false,
                //경고 수
                'Warn' : 0,
                //플레이어
                'User' : {
                    //골드
                    'Gold' : 10000,
                    //경험치
                    'Exp' : 0,
                    //칭호
                    'Title' : '칭호없음',
                    //신용등급
                    'Mrank' : 0,
                    //inventory.name
                    //칭호 인벤토리
                    'InventoryT' : [],
                    // inventory.name, amount, rank
                    //아이템 인벤토리 
                    'Inventory' : []
                },
                //버프
                'Buffs' : {
                },
                //주식
                'Jusic' : [],
                //길드
                'Guild' : {
                    //길드마스터 여부
                    'GM' : false,
                    //부길드마스터 여부
                    'PreGM' : false,
                    //멤버 여부
                    'Member' : false
                },
                //낚시
                'Fishing' : {
                    //낚시 여부
                    'isFishing' : false,
                    //낚시 쿨타임
                    'FishingTime' : 30,
                    //FishingRod[i].Name, lvl, lvlupcost
                    //낚싯대
                    'FishingRod' : [],
                    //Bowl[i].Name, Rank, cost
                    //양동이
                    'Bowl' : []
                }
            }
        FS.write(Path + sender + '.txt', JSON.stringify(Data, null, 4));
        p = scan(sender);
        Ranking.push({'Name' : sender, 'Gold' : scan(sender).Gold, 'Exp' : scan(sender).Exp});
        HashList.push({'Name' : p.Name, 'HashCode' : Number(hc)});
        SaveRank(Ranking);
        say('[THE LIFE]\n' + sender + '님께서 가입하셨습니다. \'' + j + '도움말\'을 입력해 도움을 받아보세요.');
        say('※카카오톡 이름 혹은 프로필 사진 변경시 봇 사용이 불가능합니다.(책임 안짐)');
        }
    }
    if(msg.startsWith(j)){ if(!scan(sender)){ say('[THE LIFE]\n가입을 해주세요.'); return; } }
    if(msg.startsWith(j)){ if(scan(sender)){ if(p.HashCode !== Number(hc)){ say('[THE LIFE]\n프로필이 일치하지 않습니다.'); return; } } }
    if(msg.startsWith(j)){ if(p.isBanned === true){ say('[THE LIFE]\n밴 상태입니다.'); return; } }
    if(msg === j + '도움말'){ //70%
        say([
            '[THE LIFE]도움말' + FW,,,
            '《 접두사 : ' + j + ' 》',,,
            '💾 ───────────────',,
            '[가입] : 게임에 가입합니다.',,
            '[내정보] : 사용자의 데이터를 봅니다.',,
            '[정보 (맨션 혹은 이름)] : 해당 사용자의 정보를 봅니다.',,
            '[공지] : 공지를 봅니다.',,
            '[인벤토리] : 사용자의 아이템 리스트를 봅니다.',,
            '[퀘스트] : 사용자의 퀘스트 목록을 봅니다.',,
            '🏆 ───────────────',,
            '[랭킹] : 랭킹 정보를 봅니다.',,
            '🎁 ───────────────',,
            '[칭호] : 사용자의 모든 칭호를 봅니다.',,
            '[칭호뽑기] : 칭호를 랜덤하게 뽑습니다.(10,000G)',,
            '[칭호장착 (칭호 번호)] : 해당하는 칭호를 장착합니다.',,
            '💎 ───────────────',,
            '[송금 (맨션 혹은 이름) (금액)] : 해당 사용자에게 골드를 송금합니다.',,
            '[신용등급] : 현존하는 신용등급 리스트를 봅니다.',,
            '🎫 ───────────────',,
            '[낚시상점] : 구매가능한 낚시용 아이템들을 봅니다.',,
            '[광질상점] : 구매가능한 광질용 아이템들을 봅니다.',,
            '🏙 ───────────────',,
            '[]',,
            '📠 ───────────────',,
            '(신용등급 『STARPLUS』이상)',,
            '┗ [거래소] : 구매가능한 아이템들을 봅니다.',,
            '┗ [T등록 (아이템 번호) (골드)] : 거래소에 아이템을 등록합니다.',,
            '┗ [T등록해제 (거래코드)] : 거래소에 등록된 아이템을 등록 해제합니다.',,
            '┗ [T구매 (거래코드) (수량)] : 거래소에 등록된 아이템을 구매합니다.',,
            '📋 ───────────────',,
            '(신용등급 『VVIP』이상)',,
            '┗ [경매] : 등록된 경매 리스트를 봅니다.',,
            '┗ [경매참가 (경매코드)] : 해당하는 경매에 참가합니다.',,
            '┗ [경매취소 (경매코드)] : 해당하는 경매 참가를 취소합니다.',,
            '🍴 ───────────────',,
            '[식당] : 구매가능한 효과들을 봅니다.',,
            '📈 ───────────────',,
            '(신용등급 『SVIP』이상)',,
            '┗ [주식] : 주식 리스트를 봅니다.',,
            '┗ [내주식] : 사용자의 주식 리스트를 봅니다.',,
            '┗ [L투자 (주식코드) (수량)] : 해당하는 주식에 투자합니다.',,
            '┗ [L판매 (번호) (수량)] : 해당하는 주식을 판매합니다.',,
            '🐟 ───────────────',,
            '[낚시] : 낚시를 시작합니다.',,
            '[낚시종료] : 낚시를 종료합니다.',,
            '[양동이] : 물고기 리스트를 봅니다.',,
            '[F판매 (번호)] : 해당번호에 위치한 물고기를 판매합니다.',,
            '[F일괄판매] : 사용자의 모든 물고기를 판매합니다.',,
            '[F일괄값] : 사용자의 물고기 일괄판매값을 봅니다.',,
            '[F잠금 (번호)] : 해당번호에 위치한 물고기를 잠금합니다.',,
            '[F해제 (번호)] : 해당번호에 위치한 물고기를 잠금해제 합니다.',,
            '[F일괄잠금 (등급)] : 해당등급의 모든 물고기를 잠금합니다.',,
            '⛏ ───────────────',,
            '(경험치 10,000이상)',,
            '┗ [광질] : 광질을 시작합니다.',,
            '┗ [광질종료] : 광질을 종료합니다.',,
            '┗ [가방] : 광물 리스트를 봅니다.',,
            '┗ [M판매 (번호)] : 해당번호에 위치한 광물을 판매합니다.',,
            '┗ [M일괄판매] : 사용자의 모든 광물을 판매합니다.',,
            '┗ [M일괄값] : 사용자의 광물 일괄판매값을 봅니다.',,
            '┗ [M잠금 (번호)] : 해당번호에 위치한 광물을 잠금합니다,',,
            '┗ [M해제 (번호)] : 해당번호에 위치한 광물을 잠금해제 합니다.',,
            '┗ [M일괄잠금 (등급)] : 해당등급의 모든 물고기를 잠금합니다.',,
            '📢 ──────────────',,
            '(관리자 권한)',,
            '┗ [밴 (맨션 혹은 이름)] : 해당하는 사용자를 밴합니다.',,
            '┗ [공지 (내용)] : 내용을 공지에 등록합니다.',,
            '┗ [경매시작 (경매코드)] : 해당하는 경매를 시작합니다.',,
            '┗ [아이템 리스트] : 모든 아이템을 봅니다',,
            '┗ [아이템 지급 (맨션 혹은 이름) (아이템 번호)] : 해당하는 아이템을 해당 유저에게 지급합니다.'
          ].join('\n'));
    }
    if(msg === j + '내정보'){ //돈까지

    }
    if(msg.startsWith(j + '정보 ')){ // 돈까지 뜨게

    }
    if(msg === j + '공지'){ //DONE
        say('[THE LIFE]공지\n────────────────\n' + Not);
    }
    if(msg === j + '인벤토리'){ //DONE
        let result = '[THE LIFE]\n[(' + p.User.Title + ')' + sender + ']님의 인벤토리' + FW + '\n─────────────────────';
        if(p.User.Inventory.length == 0){ result += '\n(비었음)'; say(result); return; }       // ━━━━━━━━━━━━━━━━━━━━━
        for(var i = 0; i < p.User.Inventory.length; i++){
            result += '\n『' + (i + 1) + '』 | [' + p.User.Inventory[i].Rank + '] ' + p.User.Inventory[i].Name + ' (' + p.User.Inventory[i].Amount + ')\n─────────────────────';
        }
        say(result);
    }
    if(msg === j + '퀘스트'){ 

    }
    if(msg === j + '랭킹'){
        let chart = Ranking.sort((a, b) => b.Gold - a.Gold);
        let result = '[THE LIFE]부자 랭킹' + FW + '\n━━━━━━━━━━━━━━━━━━━━━';
        for(var i = 0; i < 100; i++){
            var s = scan(chart[i].Name);
            result += '\n『' + (i + 1) + '』 ' + '[(' + s.User.Title + ')' + s.Name + '] ┃ ' + chart[i].Gold;
        }
        say(result);
    }
    if(msg === j + '칭호'){ //DONE
        let result = '[THE LIFE]\n[('+ p.User.Title + ')' + sender + ']님의 칭호' + FW + '\n─────────────────────';
        if(p.User.InventoryT.length == 0){ result += '\n(비었음)'; say(result); return; }
        result += '\n(' + p.User.InventoryT.length + '/' + TitleList.length + ')';
        for(var i = 0; i < p.User.InventoryT.length; i++){
            result += '\n『' + (i + 1) + '』 | ' + p.User.InventoryT[i];
            if(p.User.InventoryT[i] == p.User.Title){ result += ' ── (장착됨)'; }
            result += '\n─────────────────────';
        }
        say(result);
    }
    if(msg === j + '칭호뽑기'){ //DONE
        if(p.User.Gold < 10000){ say('[THE LIFE]\n돈이 부족합니다.\n(『10,000G』)'); return; }
        let result = GetRandom(TitleList);
        for(var i = 0; i < p.User.InventoryT.length; i++){
            if(p.User.InventoryT[i].Name === result){
                p.User.Gold -= 10000;
                save(sender, p);
                say('[THE LIFE]\n[(' + p.User.Title + ')' + sender + ']님이 칭호 (' + result + ') 를 뽑으셨습니다.');
                return;
            }
        }
        p.User.InventoryT.push(result);
        p.User.Gold -= 10000;
        say('[THE LIFE]\n[(' + p.User.Title + ')' + sender + '님이 칭호 (' + result + ') 를 뽑으셨습니다.');
    }
    if(msg.startsWith(j + '칭호장착 ')){ //DONE
        let number = Number(msg.slice(6)) - 1;
        if(isNaN(number)){ say('[THE LIFE]\n숫자가 아닙니다.'); return; }
        if(!p.User.InventoryT[number]){ say('[THE LIFE]\n존재하지 않는 값입니다.'); return; }
        say('[THE LIFE]\n[(' + p.User.Title + ')' + sender + '님이 (' + p.User.InventoryT[number] + ') 칭호를 장착합니다.');
        p.User.Title = p.User.InventoryT[number];
    }
    if(/^!송금 @?(.+) (\d+)$/.test(msg)){ //DONE
        let Target = RegExp.$1.trim();
        let Gold = Math.floor(RegExp.$2);
        let s = scan(Target);
        if(Gold < 1){ say('[THE LIFE]\n잘못된 값입니다.'); return; }
        if(Gold > p.User.Gold){ say('[THE LIFE]\n돈이 부족합니다.'); return; }
        if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
        p.User.Gold -= Gold;
        s.User.Gold += Gold;
        save(Target, s);
        say('[THE LIFE]\n[(' + p.User.Title + ')' + sender + '님이 [(' + s.User.Title + ')' + Target + ']님께 『' + comma(Gold) + 'G』를 송금하셨습니다.');
    }
    if(msg === j + '신용등급'){ //DONE
        say([
            '[THE LIFE]신용등급' + FW,
            '─────────────────────',
            '『MEMBER』 :  일반 회원',,
            '『STANDARD』 :  여전히 일반 회원',,
            '『STARSHIP』 :  조금 특별해진 회원',,
            '『STARPLUS』 :  조금 더 특별해진 회원',,
            '『VIP』 :  특별한 회원',,
            '『VVIP』 :  많이 특별한 회원',,
            '『SVIP』 :  4급 특별 회원',,
            '『MVIP』 :  3급 특별 회원',,
            '『XVIP』 :  2급 특별 회원',,
            '『MASTER』 :  1급 특별 회원',,
            '『DEVELOPER』 :  아무나 가질 수 없는 등급'
        ].join('\n'));
    }
    if(msg === j + '낚시상점'){

    }
    if(msg === j + '광질상점'){

    }
    if(msg === j + '거래소'){
        let result = '[THE LIFE]거래소' + FW + '\n─────────────────────';
        if(Trade.length == 0){ result += '(등록된 거래 없음)'; say(result); return; }
        for(var i = 0; i < Trade.length; i++){
            result += '\n\n[거래코드 : ' + Trade[i].TradeCode + ']\n\n┗ 상품 : ' + Trade[i].Name + '┗ 수량 : ' + Trade[i].Amount + '\n\n┗ 등록자 : ' + Trade[i].Target
        }
        say(result);
    }
//관리자 라인----------------------------------------------------------------
    if(/^!해시코드 @?(.+)$/.test(msg)){
    if(p.isDev === false){ say('[THE LIFE]\n관리자가 아닙니다.(서포터 이상)'); return; }
    if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
    let Target = RegExp.$1.trim();
    let result = '[THE LIFE]\n';
    let s = scan(Target);
        for(var i = 0; i < HashList.length; i++){
            if(HashList[i].Name === Target){
                result += ('[(' + s.User.Title + ')' + Target + ']님의 해시코드\n' + HashList[i].HashCode);
            }
        }
        say(result);
    }
    if(/^!프로필 변경 @?(.+) (\d+)$/.test(msg)){
        if(p.isDev === false){ say('[THE LIFE]\n관리자가 아닙니다.(서포터 이상)'); return; }
        let Target = RegExp.$1.trim();
        let gap = RegExp.$2
        let s = scan(Target);
        if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
        s.HashCode = gap;
        save(Target, s);
        say('[THE LIFE]\n'+ Target + '님의 해시코드값을 변경합니다.');
    }
    if(/^!밴 @?(.+)$/.test(msg)){ //DONE
        if(p.isDev === false){ say('[THE LIFE]\n관리자가 아닙니다.(서포터 이상)'); return; }
        let Target = RegExp.$1.trim();
        let s = scan(Target);
        if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
        if(scan(Target).isBanned === true){ say('[THE LIFE]\n이미 밴 되셨습니다.'); return; }
        if(scan(Target).isDev === true){ say('[THE LIFE]]\n관리자는 밴이 불가능합니다.'); return; }
        s.isBanned = true;
        save(Target, s);
        say('[THE LIFE]\n' + Target + '님을 밴상태로 전환합니다.');
    }
    if(/^!밴해제 @?(.+)$/.test(msg)){ //DONE
        if(p.isDev === false){ say('[THE LIFE]\n관리자가 아닙니다.(서포터 이상)'); return; }
        let Target = RegExp.$1.trim();
        let s = scan(Target);
        if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
        if(scan(Target).isBanned === false){ say('[THE LIFE]\n밴 상태가 아닙니다.'); return; }
        s.isBanned = false;
        save(Target, s);
        say('[THE LIFE]\n' + Target + '님을 밴 해제 상태로 전환합니다.');
    }
    if(msg.startsWith(j + '공지 ')){
        if(p.isProDev === false){ say('[THE LIFE]\n관리자가 아닙니다.(관리자 이상)'); return; }
        let Message = msg.slice(4);
            Not = Message;
            SaveNotice(Not);
            say('[THE LIFE]\n공지를 등록했습니다.');
    }
    if(/^!아이템지급 @?(.+) (\d+) (\d+)$/.test(msg)){
        if(p.isProDev === false){ say('[THE LIFE]\n관리자가 아닙니다.(오너 이상)'); return; }
        let Target = RegExp.$1.trim();
        let num = RegExp.$2;
        let Amount = RegExp.$3;
        let s = scan(Target);
        if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
        if(!ItemList[num]){ say('[THE LIFE]\n존재하지 않는 아이템입니다.'); return; }
        for(var i = 0; i < s.User.Inventory.length; i++){
            if(s.User.Inventory[i].Name === ItemList[num]){
                s.User.Inventory[i].Amount += Amount;
                save(Target, s);
                say('[THE LIFE]\n아이템 지급 완료.');
                return;
            }
        }
        s.User.Inventory.push(ItemList[num]);
    }
    if(/^!관리자 등록 @?(.+) (.+)$/.test(msg)){
        if(p.isCre === false){ say('[THE LIFE]\n관리자가 아닙니다.(오너 이상)'); return; }
        let Target = RegExp.$1.trim();
        let Target2 = RegExp.$2
        let A = '서포터';
        let B = '관리자';
        let C = '오너';
        if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
        let s = scan(Target);
        if(Target2 == A){ say('[THE LIFE]\n사용자 ' + Target + '님을 서포터로 변경합니다.'); s.isDev = true; save(Target, s); return; }
        if(Target2 == B){ say('[THE LIFE]\n사용자 ' + Target + '님을 관리자로 변경합니다.'); s.isDev = true; s.isProDev = true; save(Target, s); return; }
        if(Target2 == C){ say('[THE LIFE]\n사용자 ' + Target + '님을 오너로 변경합니다.'); s.isDev = true; s.isProDev = true; s.isCre = true; save(Target, s); return; }
        else { say('[THE LIFE]\n존재하지 않는 등급입니다.'); return; }
    }
    if(/^!관리자 해제 @?(.+)$/.test(msg)){
        if(p.isCre === false){ say('[THE LIFE]\n관리자가 아닙니다.(오너 이상)'); return; }
        let Target = RegExp.$1.trim();
        if(!scan(Target)){ say('[THE LIFE]\n존재하지 않는 사용자입니다.'); return; }
        if(scan(Target).isDev !== true){ say('[THE LIFE]\n사용자는 현재 멤버 등급입니다.'); return; }
        let s = scan(Target);
        s.isDev = false;
        s.isProDev = false;
        s.isCre = false;
        save(Target, p)
        say('[THE LIFE]\n관리자 ' + Target + '님을 멤버로 변경합니다.');
    }
    
    
    save(sender, p);
    SaveRank(Ranking)
    /** replier.reply 대신해주는 함수 say(보낼 메세지) */
    function say(message){
        replier.reply(message);
    }
}
/** 사용자의 데이터 불러오는 함수 scan(사용자의 이름) */
function scan(name){
    return JSON.parse(FS.read(Path + name + '.txt'));
}
/** 사용자 데이터 저장해주는 함수 save(사용자의 이름, 사용자의 데이터) */
function save(name, ob){
    if(!scan(name)){ return false; }
    FS.write(Path + name + '.txt', JSON.stringify(ob, null, 4));
    return true;
}
function SaveRank(ob){
    FS.write(RankPath, JSON.stringify(ob, null, 4));
    return true;
}
function SaveNotice(ob){
    FS.write(Notice, JSON.stringify(ob, null, 4));
    return true;
}
/** 배열원소 랜덤으로 추출해주는 함수 GetRandom(배열) */
function GetRandom(arr){
    let result = arr[Math.round(Math.random()*(arr.length))];
    return result;
}
/** 랜덤 함수지만 범위 지정가능 Random(최소값, 최대값) */
function Random(min, max){
    let result = Math.round(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
    return result;
}
/** 단위마다 쉼표 찍어주는 함수 comma(값) */
function comma(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
}
/** 게이지바 함수 ultrabar(현재 값, 최대치, 바의 길이, 단위표시) */
function ultrabar(number, maximum, lengthofbar, isPP){
    var nowbar = (lengthofbar * (number / maximum));
    var rest = (nowbar % 1);
    var PP = '';
    if(isPP == 1){ PP = '(' + maximum + ' / ' + number + ')'; }
    if(number < 0){ return ('□'.repeat(lengthofbar) + PP); }
    if(number > maximum || number == maximum){ return ('■'.repeat(lengthofbar) + ' ' + PP); }
    if((nowbar % 1) != 0){ return ('■'.repeat((nowbar - rest))) + ('□'.repeat(lengthofbar - (nowbar - rest)) + PP); }
    if((nowbar % 1) == 0){ return ('■'.repeat(nowbar)) + ('□'.repeat(lengthofbar - nowbar) + PP); }
}
/** 코드표 만들어주는 함수 MakeCode(숫자값) */
function MakeCode(number){
    if(isNaN(number)){ return false; }
    if(number.length == 0){ return false; }
    const str = number.toString();
    if(number.length == 1){ str += '00000'; }
    if(number.length == 2){ str += '0000'; }
    if(number.length == 3){ str += '000'; }
    if(number.length == 4){ str += '00'; }
    if(number.length == 5){ str += '0'; }
    let result = '';
    for (var i = 0; i < str.length; i++) {
      const Ascii = str.charCodeAt(i);
      const code = String.fromCharCode(Ascii + 64);
      result += code;
    }
    return result.toUpperCase();
}

function code(){
    let num = Math.round(Math.random() * (999999 - 111111 + 1)) + 111111;

    let str = num.toString();

    let res = '';

    for(i in str){

        let asc = str.charCodeAt(i);
    
        let cod = String.fromCharCode(asc + 64);

        res += cod;

    }

    return res.toUpperCase();

}

















function GetArrOb(gap, Arrob, Name, tw){
    let result = null;
    for(var i = 0; i < arr.length; i++) {
        if(Arrob[i].Name === gap) {
        result = arr[i].HashCode;
    break;
  }
}//━━
}
function Find(arr, Message){
    let result = arr.filter(item => item.includes(Message));
    return result;
}
function srt(arr){
    arr.sort((a, b) => b - a);
    return arr
}
function getNamesOfRank(arr, Rank) {
    const RankNames = arr.filter(item => {
      return item.Rank === Rank;
    }).map(item => {
      return item.Name;
    });
    return RankNames;
  }
  function GetSort(ArrOb) {
    arr.sort((a, b) => b.Exp - a.Exp);
    const names = arr.map(item => item.Name);
    console.log(names);
  }
function getRandomLegendaryFish(arr) {
    const legendaryFish = arr.filter(item => { return item.Rank === '전설'; } );
    const randomIndex = Math.floor(Math.random() * legendaryFish.length);
    return legendaryFish[randomIndex].Name;
}