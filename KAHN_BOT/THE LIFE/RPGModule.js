//THE LIFE 명령어 모듈입니다.

//접두사
const prex = '!';

exports.Lifecmd = {

    //가입명령어
    'join' : prex + '가입',

    //해시코드명령어
    'Hash' : prex + '해시코드',

    //프로필 새로고침 명령어
    'refresh' : prex + '새로고침',
    
    //설정
    'setting' : /^!설정 (\d+) , (.+)$/,

    //편지명령어
    'mail' : /^!편지 @?(.+) , (.+)$/,

    //도움말명령어
    'help' : prex + '도움말',

    //내정보명령어
    'myprofile' : prex + '내정보',
    
    //상대방정보명령어
    'eprofile' : /^!정보 @?(.+)$/,
        
    //광질명령어
    'orestart' : prex + '광질',
    
    //광물 가방명령어
    'bag' : prex + '가방',
    
    //광물 가방명령어
    'ebag' : /^!가방 @?(.+)$/,
    
    //잠금명령어 (랭크, 광물번호)
    'lock' : prex + 'G잠금',
    
    //잠금해제명령어 ('')
    'unlock' : prex + 'G잠금해제',

    //판매 명령어
    'sell' : prex + 'G판매',

    //일괄판매 명령어
    'allsell' : prex + 'G일괄판매',

    //광물전송 명령어
    'sendore' : /^!광물전송 @?(.+) , (\d+)$/,

    //---------------------------------관리자 명령어
    
    //밴명령어
    'ban' : /^!밴 @?(.+)$/,

    //밴해제명령어
    'unban' : /^!언밴 @?(.+)$/,

    //등록
    'rk' : /^!등급 @?(.+) , (\d+)$/
    
};

exports.LifeOb = {

    //설정 1 : 2 : 메세지 차단 3 : k
    
    'Setting' : [false, false, false, false, false, false],

    //메일함
    'Mail' : [],

    //관리자 1~4 (1 == 멤버, 2 == 서포터, 3 == 관리자, 4 == 오너)
    'Dev' : 1,

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
        'Bag' : [],

        'Baglimit' : 100
    
    },
    
    //에너지
    'Energy' : {
    
        //최대 에너지
        'MaxEnergy' : 100,
    
        //현재 에너지
        'NowEnergy' : 100
    
    }

}