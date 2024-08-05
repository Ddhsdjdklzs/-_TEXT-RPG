/*

  원작자 표기 + 2차수정 ([관리자정보], [접두사] 제외) , 무단 베포 금지
sender가 포함되지않은 메세지, 그리고 시스템이 말했을때 []괄호 붙이기
전역변수사용
『 』 ─
값끼리 계산할땐 Number(값) 하기 
comma 이용해서 수정, 양동이 판매등등
9031
이름 대괄호
기타 특괄호
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
//made by -KAHN-
const FS = FileStream;
const j = '!';
const Path = '/sdcard/THELIFE/';
const RankPath = '/sdcard/LIFEDATA/RANKING.txt', UserHash = '/sdcard/LIFEDATA/HASHCODE.txt', GuildData = '/sdcard/LIFEDATA/GUILDDATA.txt';

const FW = ('\u200b'.repeat(500));
const SOC = ('\u3014');
const SCC = ('\u3015');
const DevName = ['관리자 이름 입력'];
const DevHash = [ /*관리자 해시코드 입력*/ ];
const OreCommon = ['돌', '조약돌', '석탄', '구리', '납', '아연', '철', '망간', '주석', '석회석', '규석', '장석', '방해석', '고령토', '운모', '활석', '불석', '규조토', '규회석', '명반석','사문석', '석면', '석영', '자수정', '중정석', '홍주석', '흑철석', '흑연'];
const OreRare = ['은', '금', '아만타디움', '다이아몬드', '백금', '가넷', '사파이어', '에메랄드', '연옥', '미스릴'];
const OreEpic = ['코발트', '리튬', '오리하르콘', '금강석', '흑요석', '쿤자이트', '티타늄', '아메트린', '레드 사파이어', '영석'];
const OreLegend = ['로들라이트', '핑크 다이아몬드', '레드 다이아몬드', '스피넬', '지르콘', '머스그레이비트', '헤소나이트', '파이어 오팔', '데만토이드가넷', '레인보우 다이아몬드'];
const OreOverlg = ['고대 생물', '운석', '특별한 조각', '은하수', '공허', '특별한 돌', '균열의 돌', '고대의 책', 'UFO', '녹아버린 돌'];
const OreSpecial = ['우주 조각', '행성의 파편', '개발자의 팬티', '시공주머니', '???'];

const FishCommon = ['고등어', '멸치', '연어', '갈치', '잡어', '숭어', '붕어', '꽁치', '송어', '청어'];
const FishRare = ['오징어', '우럭', '참치', '방어', '문어', '광어', '돌돔', '낙지', '소라', '상어'];
const FishEpic = ['참돔', '감성돔', '농어', '가시고기', '쏘가리', '금붕어', '백상아리', '참다랑어', '장어', '전어'];
const FishLegend = ['레인보우 피쉬', '고래', '대왕오징어', '크라켄', '버터의 눈물', '골드샤크', '흑동고래', '자수정피쉬'];
const FishOverlg = ['버터의 마지막 조각', '책', '버터의 저주가 씌인 팬티', '버터의 마지막 머리카락', '신비한 조각'];
const FishSpecial = ['녹아버린 돌조각', '개발자의 팬티', '운석파편', '버터의 낚싯대'];

const Title = ['뉴비', '거지', '노숙자', '바바리맨', '구속된', '느끼한', '과학자', '노예','랭킹 1위', '녹아버린', '모쏠', '낚시를 좋아하는', '고수', '신', '부개발자', '수집가', '패왕', '변태', '재벌', '물고기 애호가', '판사', '야스왕', '씹변태', '게임 중독', '오타쿠', '게임 10년차', '버터', '아몬드', '탈모왕', '고인물', '썩은물', '해커', '쁘띠', '잼민이', '대머리', '기부천사', '(❁´◡`❁)', '^_^', '(¬_¬ )', '(╯°□°）', '씹덕', '바른토스트', '응애'];

const DevHash1 = [], DevHash2 = [], DevHash3 = [], DevHash4 = [], DevHash5 = [];
const DevHash6 = [], DevHash7 = [], DevHash8 = [], DevHash9 = [], DevHash10 = [];

let tutor = {};
let DailyQuest1 = '낚시 1회 달성';
let DailyQuest2 = '광질 3회 달성';
let DailyQuest3 = '상점 이용 1회 달성';
let DailyQuest4 = '개발자 프로필하트 1회';

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName){
  if(!FS.read(RankPath)) FS.write(RankPath, JSON.stringify([], null, 4));
  if(!FS.read(UserHash)) FS.write(UserHash, JSON.stringify([], null, 4));
  if(!FS.read(GuildData)) FS.write(GuildData, JSON.stringify([], null, 4));
  let hc = new java.lang.String(imageDB.getProfileHash());
  let p = scan(sender);
  let Ranking = JSON.parse(FS.read(RankPath));
  let HASHLIST = JSON.parse(FS.read(UserHash));
  let GuildList = JSON.parse(FS.read(GuildData));

  if(msg == j + 'h'){
    say(Number(hc));
  }
  if(msg == j + '가입'){
    if(scan(sender)){ say('이미 가입하셨습니다!'); return; }
    if(!scan(sender)){
      if(sender.includes('@') || sender.includes('/') || sender.includes('￦') || sender.includes(':') || sender.includes('*') || sender.includes('?') || sender.includes('"') || sender.includes('<') || sender.includes('>') || sender.includes('|')){
        say('닉네임에 사용불가능한 문자가 포함되어 있습니다.'); return; }
      if(sender.includes(j)){ say('닉네임에 접두사가 포함되어 있습니다.'); }
      else{ Data = {
        'Name' : sender,
        'HashCode' : Number(hc),
        'isBanned' : false, //새거
        'isDev' : false,
        User : {
          'Exp' : 0,
          'Gold' : 1000,
          'Inventory' : [],
          //inevntory.amount, name
          'Title' : '(칭호 없음)',
          'TitleVentory' : [],
          'CreditRank' : 'MEMBER',
          'CreditMP' : 0,
          'CreditMaxMP' : 100
        },
        Quest : [
          { 'num' : 1, 'explain' : DailyQuest1, 'IsDone' : '미완료', 'reward' : 100},
          { 'num' : 2, 'explain' : DailyQuest2, 'IsDone' : '미완료', 'reward' : 1000},
          { 'num' : 3, 'explain' : DailyQuest3, 'IsDone' : '미완료', 'reward' : 10000},
          { 'num' : 4, 'explain' : DailyQuest4, 'IsDone' : '미완료', 'reward' : 100000}
        ],
        Mining : {
            Pixaxe :{
              'LVL' : 1,
              'Rank' : '일반'
            },
            'MiningTime' : 30,
            'isMining' : false, //새거
            'Ore' : []
        },
        Hunting : {
            HuntPlayer : {
                'HP' : 100,
                'MaxHP' : 100,
                'Damage' : 10
            }
        },
        Fishing : {
          'Rod' : '기본 낚싯대',
          'Rodlvl' : 1,
          'Fcost' : 100,
          'isFishing' : false,
          'FishingTime' : 30,
          'Bowl' : []
        },
        UserGuild : {
          'isGM' : false,
          'isSGM' : false,
          'isMem' : false,
          'isInGuild' : false,
          'GuildName' : '(길드 없음)'
        }
      };
      FS.write(Path + sender + '/' + hc + '.txt', JSON.stringify(Data, null, 4));
      HASHLIST.push({'Name' : sender, 'Hash' : scan(sender).HashCode});
      Ranking.push({'Name' : sender, 'Exp' : scan(sender).User.Exp});
      SaveRank(Ranking);
      SaveHash(HASHLIST);
      p = scan(sender);
      say('[THE LIFE]에 가입하셨습니다!');
      say('[' + j + '도움말]을 입력해 도움을 받아보세요!\n(지원금 1,000G)');
    }
    }
  }
  if(scan(sender)){
    if(p.isBanned == false){
      if(msg == j + '도움말'){
        say([
          '[THE LIFE]도움말' + FW,,,
          '《 접두사 : ' + j + ' 》',,,
          '💾 ───────────────',,
          '[가입] : 게임에 가입합니다.',,
          '[내정보] : 사용자의 데이터를 봅니다.',,
          '[인벤토리] : 사용자의 아이템 리스트를 봅니다.',,
          '[퀘스트] : 사용자의 퀘스트 목록을 봅니다.',,
          '🎁 ───────────────',,
          '[칭호] : 사용자의 모든 칭호를 봅니다.',,
          '[칭호뽑기] : 칭호를 랜덤하게 뽑습니다.(10,000G)',,
          '[칭호목록] : 현존하는 칭호 리스트를 봅니다.',,
          '[칭호장착 (칭호 번호)] : 해당하는 칭호를 장착합니다.',,
          '💎 ───────────────',,
          '[지갑] : 소유하고 있는 골드량을 봅니다.',,
          '[송금 (맨션 혹은 이름) (골드)] : 해당 사용자에게 골드를 송금합니다.(신용등급에 따라 제한됨.)',,
          '[신용등급] : 현존하는 신용등급 리스트를 봅니다.',,
          '🩸 ───────────────',,
          '[전설] : [THE LIFE]의 전설.',,
          '🎫 ───────────────',,
          '[상점] : 구매가능한 아이템들을 봅니다.',,
          '[대장간] : 구매가능한 도구들을 봅니다.',,
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
          '🏛 ────────────────',,
          '[길드] : 길드 리스트를 봅니다.',,
          '[G가입 (길드코드)] : 해당하는 길드에 가입합니다.',,
          '[G탈퇴] 현재 가입하고 있는 길드에서 탈퇴합니다.',,
          '[G인원] : 길드 가입자 리스트를 봅니다.',,
          '[G창고] : 현재 길드 창고를 봅니다.',,
          '[G보관 (아이템 번호)] : 길드 창고에 해당하는 아이템을 보관합니다.',,
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
          '⚔ ───────────────',,
          '(경험치 100,000이상)',,
          '┗ [탐험] : 탐험을 시작합니다.(1,000,000G)',,
          '┗ [공격하기] : 탐험중 만난 상대에게 공격을 시도합니다.',,
          '┗ [도망가기] : 탐험중 만난 상대에게서 도망을 시도합니다.',,
          '🏹 ───────────────',,
          '(경험치 100,000이상)',,
          '┗ [도전 (맨션 혹은 이름)] : 사용자에게 도전합니다.(10,000,000G)',,
          '┗ [도전취소 (맨션 혹은 이름)] : 사용자에게 건 도전을 취소합니다.',,
          '┗ [전적 (맨션 혹은 이름)] : 사용자의 PVP 전적을 봅니다.',,
          '👻 ───────────────',,
          '(경험치 1,000,000이상)',,
          '┗ [보스] : 사냥가능한 보스들을 봅니다.',,
          '┗ [B시작 (보스코드)] : 해당하는 보스를 공략을 시작합니다.(1,000,000,000G)',,
          '┗ [B종료] : 보스공략을 종료합니다.',,
          '🛡 ───────────────',,
          '(경험치 1,500,000이상)',,
          '┗ [G생성] : 길드를 생성합니다.(1,000,000,000)',,
          '┗ [G추방 (맨션 혹은 이름)] : 길드에서 사용자를 추방합니다.',,
          '┗ [G이동 (창고 아이템번호)] : 해당하는 아이템을 길드 창고에서 인벤토리로 이동시킵니다.',,
          '┗ [G랭크업] : 길드 랭크를 올립니다.(현재 랭크에 따라 가격이 달라짐.)',,
          '┗ [G상점] : 길드 상점을 봅니다.',,
          '🗡 ───────────────',,
          '(경험치 10,000,000이상)',,
          '┗ [보스레이드] : 보스레이드 방 리스트를 봅니다.',,
          '┗ [BS방생성] : 보스레이드 방을 생성합니다.(1,000,000,000)',,
          '┗ [BS방해체] : 보스레이드 방을 해체합니다.',,
          '┗ [BS추방 (맨션 혹은 이름)] : 사용자를 보스레이드 방에서 추방합니다.',,
          '┗ [BS시작] : 보스레이드를 시작합니다.',,
          '┗ [BS참가 (방코드)] : 해당하는 보스레이드 방에 참가합니다.(100,000,000)',,
          '📢 ──────────────',,
          '(관리자 권한)',,
          '┗ [해시코드 (맨션 혹은 이름)] : 해당유저의 해시코드를 봅니다.',,
          '┗ [밴 (해시코드)] : 해당하는 해시코드 사용자를 밴합니다.',,
          '┗ [공지 (내용)] : 내용을 공지에 등록합니다.',,
          '┗ [경매시작 (경매코드)] : 해당하는 경매를 시작합니다.',,
          '┗ [아이템 리스트] : 모든 아이템을 봅니다',,
          '┗ [아이템 지급 (맨션 혹은 이름) (아이템 번호)] : 해당하는 아이템을 지급합니다.'
        ].join('\n'));
      }
      if(msg == j + '내정보'){//레벨 경험치 최대 돈 랭킹 레벨 순위
        say([
          '[(' + p.User.Title + ')' + sender + ']님의 정보',
          '────────────────',,
          '(채력)',
          ultrabar(p.Hunting.HuntPlayer.HP, p.Hunting.HuntPlayer.MaxHP, 10, 1),,
          '(신용등급 : 『' + p.User.CreditRank + '』)',
          ultrabar(p.User.CreditMP, p.User.CreditMaxMP, 10, 1),,
          '[공격력 : ' + comma(p.Hunting.HuntPlayer.Damage) + ']',,
          '[경험치 : ' + comma(p.User.Exp) + ']',,
          '[길드 : ' + Guild(p.UserGuild.isInGuild) + ']'
        ].join('\n'));
      }//else 광질게임return
      if(msg == j + '인벤토리'){
        let result = '[(' + p.User.Title + ')' + sender + ']님의 인벤토리' + FW + '\n─────────────────────';
        if(p.User.Inventory.length == 0){ result += '\n(비었음)'; }
        else{
          for(var i = 0; i < p.User.Inventory.length; i++){
          result += ('\n' + (i + 1) + ' | ' + p.User.Inventory[i].name + ' (' + p.User.Inventory[i].amount + '개)\n' + '─────────────────────\n');
          }
        }
        say(result);
      }
      if(msg == j + '지갑'){ //done
        say('[(' + p.User.Title + ')' + sender + ']님의 지갑\n────────────────\n\n『' + comma(p.User.Gold) + 'G』');
      }
      switch (tutor[sender]) {
        case 'end' : {
          if(msg == j + '1'){ tutor[sender] = 'default'; p.User.Gold += 10; p.Tutorial = true; save(sender, p); say('[튜토리얼 보상 10G 지급.]'); }
        } break;
        case 'final' : {
          if(msg == j + '1'){ tutor[sender] = 'end'; say('[잘 이해하셨다니 다행이네요, 그럼 행운을 빕니다!]'); say('1) 튜토리얼 끝내기'); }
          if(msg == j + '2'){ tutor[sender] = 'first'; say('[저런... 다시 설명해드릴게요!]'); say('1) 알겠어\n2) 취소'); }
          if(msg == j + '3'){ tutor[sender] = 'default'; say('[튜토리얼을 취소합니다.]'); }
        } break;
        case 'explain' : {
          if(msg == j + '1'){ tutor[sender] = 'final'; say('[게임을 처음 가입하셨군요!'); say('그렇다면 『' + j + '도움말』을 통해 명령어를 익혀보세요!]'); say('1) 이해했어\n2) 다시 설명해줘\n3) 취소'); }
          if(msg == j + '2'){ tutor[sender] = 'final'; say('[처음이 아니시라면 우선 『' + j + '광질』 혹은 『' + j + '낚시』명령어로 돈을 벌어보세요!]'); say('1) 이해했어\n2) 다시 설명해줘\n3) 취소'); }
          if(msg == j + '3'){ tutor[sender] = 'default'; say('[튜토리얼을 취소합니다.]'); }
        } break;
        case 'first' : {
          if(msg == j + '1'){ tutor[sender] = 'explain'; say('[혹시 게임이 처음이신가요?]'); say('1) 응\n2) 아니\n3) 취소'); }
          if(msg == j + '2'){ tutor[sender] = 'default'; say('[튜토리얼을 취소합니다.]'); }
        } break;
      }
      if(msg == j + '튜토리얼'&&p.Tutorial == false){
        tutor[sender] = 'first';
        say('[어서오세요! ' + sender + '님. 튜토리얼을 정말로 시작하시겠습니까?]\n(보상있음)');
        say('1) 응\n2) 아니');
      }
      if(msg == j + '퀘스트'){
        say([
            '[(' + p.User.Title + ')' + sender + ']님의 퀘스트 목록' + FW,
            '──────────────────────',
            '『' + p.Quest[0].num + '』 | ' + p.Quest[0].explain + ' | 보상 : ' + comma(p.Quest[0].reward) + 'G',
            '(' + p.Quest[0].IsDone + ')',
            '──────────────────────',
            '『' + p.Quest[1].num + '』 | ' + p.Quest[1].explain + ' | 보상 : ' + comma(p.Quest[1].reward) + 'G',
            '(' + p.Quest[1].IsDone + ')',
            '──────────────────────',
            '『' + p.Quest[2].num + '』 | ' + p.Quest[2].explain + ' | 보상 : ' + comma(p.Quest[2].reward) + 'G',
            '(' + p.Quest[2].IsDone + ')',
            '──────────────────────',
            '『' + p.Quest[3].num + '』 | ' + p.Quest[3].explain + ' | 보상 : ' + comma(p.Quest[3].reward) + 'G',
            '(' + p.Quest[3].IsDone + ')',
            '──────────────────────'
          ].join('\n'));
      }
      if(msg == j + '칭호'){
        let result = '[('+ p.User.Title + ')' + sender + ']님의 칭호' + FW + '\n────────────────';
        if(p.User.TitleVentory.length == 0){ result += '\n(비었음)'; return; }
        for(var i = 0; i < p.User.TitleVentory.length; i++){
          result += ('\n' + (i + 1) + ' | ' + p.User.TitleVentory[i]);
          if(p.User.TitleVentory[i] == p.User.Title){ result += ' -- (장착됨)'; }
          result += '\n────────────────'
        }
        say(result);
      }
      if(msg == j + '칭호뽑기'){
        if(p.User.Gold < 10000){ say('돈이 부족합니다.'); return; }
        let result = GetRandom(Title);
        for(var i = 0; i < p.User.TitleVentory.length; i++){
          if(p.User.TitleVentory[i] == result){
            p.User.Title = result; p.User.Gold -= 10000; save(sender, p); say(sender + '님이 칭호 (' + result + ') 를 뽑으셨습니다.'); return;
          }
        }
        p.User.Title = result; p.User.TitleVentory.push(result); p.User.Gold -= 10000; save(sender, p); say(sender + '님이 칭호 (' + result + ') 를 뽑으셨습니다.');
      }
      if(msg == j + '칭호목록'){
        let result = '[THE LIFE]칭호 목록' + FW + '\n────────────────';
        for(var i = 0; i < Title.length; i++){
          result += ('\n' + (i + 1) + ' | ' + Title[i] + '\n────────────────');
        }
        say(result);
      }
      if(msg.startsWith(j + '칭호장착 ')){
        let number = (Number(msg.slice(6)) - 1);
        if(isNaN(number)){ say('(숫자가 아님)'); return; }
        if(!p.User.TitleVentory[number]){ say('(존재하지 않는 값)'); return; }
        p.User.Title = p.User.TitleVentory[number];
        save(sender, p);
        say(sender + '님이 (' + p.User.TitleVentory[number] + ') 칭호를 장착합니다.');
      }
      if(/^!송금 @?(.+) (\d+)$/.test(msg)){
        let player = RegExp.$1.trim();
        let Gold = Math.floor(RegExp.$2);
        let hhh = '';
        if(Gold < 1){ say('(잘못된 값)'); return; }
        if(Gold > p.User.Gold){ say('돈이 부족합니다.'); return; }
        for(var i = 0; i < HASHLIST.length; i++){
          
          if(HASHLIST[i].Name == player){
            hhh += HASHLIST[i].Hash;
          }
        }
        SS(player, ).User.Gold += Gold;
        p.User.Gold -= Gold;
        
      }
      if(/^!해시코드 @?(.+)$/.test(msg)){
        let player = RegExp.$1.trim();
        let result = '사용자 : ' + player + '\n\n';
        for(var i = 0; i < HASHLIST.length; i++){
          if(HASHLIST[i].Name == player){
            result += ('\n' + (i + 1) + '번째 가입자 | ' + HASHLIST[i].Hash);
          }
        }
        if(result.length == (9 + (player.length))){
          result += '(존재하지 않는 사용자)'
        }
        say(result);
      }
      if(msg.startsWith(j + '밴 ')){
        let hcode = Number(msg.slice(3));
        let result = '';
        for(var i = 0; i < HASHLIST.length; i++){
          if(HASHLIST[i].Hash == hcode){
            say(hcode);
            say(HASHLIST[i].Name);
            say(SS(HASHLIST[i].Name, hcode).isBanned);
            SS(HASHLIST[i].Name, hcode).isBanned = true;
            FS.write(Path + sender + '/' + hc + '.txt', JSON.stringify(SS(HASHLIST[i].Name, hcode), null, 4));
            result += (i + 1) + '번째 사용자 ' + HASHLIST[i].Name + '님이 밴 되셨습니다.';
            say(SS(HASHLIST[i].Name, hcode).isBanned);
          }
        }
        say(result);
      }
    }
  }
  function say(message){
    replier.reply(message);
  }
  function scan(name){
    return JSON.parse(FS.read(Path + name + '/' + hc + '.txt'));
  }
  function save(name, obj){
    if(!scan(name)){return false;}
    FS.write(Path + name + '/' + hc + '.txt', JSON.stringify(obj, null, 4));
    return true;
  }
  function Guild(ob, name){
    if(ob == false){ return '(길드 없음)'; }
    return p.UserGuild.GuildName;
  }
}
function SS(name, HH){
  return JSON.parse(FS.read(Path + name + '/' + HH + '.txt'));
}
function SA(name, ob, HH){
  FS.write(Path + name + '/' + HH + '.txt', JSON.stringify(ob, null, 4));
  return true;
}
function SaveRank(ob){
  FS.write(RankPath, JSON.stringify(ob, null, 4));
  return true;
}
function SaveHash(ob){
  FS.write(UserHash, JSON.stringify(ob, null, 4));
  return true;
}
function SaveGuild(ob){
  FS.write(GuildData, JSON.stringify(ob, null, 4));
  return true;
}
function comma(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
}
function wait(sec){
    java.lang.Thread.sleep(sec * 1000);
}
function GetRandom(arr){
  let result = arr[Math.floor(Math.random()*(arr.length))];
  return result;
}
function Random(min, max){
  let result = (Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min));
  return result;
}
function ultrabar(number, maximum, lengthofbar, isPP){
  var nowbar = (lengthofbar * (number / maximum));
  var rest = (nowbar % 1);
  var PP = '';
  if(isPP == 1){ PP = '(' + maximum + ' / ' + number + ')'; }
  if(number < 0){ return ('' + ('□'.repeat(lengthofbar) + ' ' + PP)); }
  if(number > maximum||number == maximum){ return ('' + ('■'.repeat(lengthofbar) + ' ' + PP)); }
  if((nowbar % 1) != 0){ return ('' + ('■'.repeat((nowbar - rest))) + ('□'.repeat(lengthofbar - (nowbar - rest))) + ' ' + PP); }
  if((nowbar % 1) == 0){ return ('' + ('■'.repeat(nowbar))) + ('□'.repeat(lengthofbar - nowbar) + ' ' + PP); }
}