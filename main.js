const ScriptName = 'RELAUNCH : RPG';

/*

 ____       ______      __  __      ______    ______      _____       __  __     
/\  _`\    /\  _  \    /\ \/\ \    /\__  _\  /\__  _\    /\  __`\    /\ \/\ \    
\ \ \/\_\  \ \ \L\ \   \ \ \ \ \   \/_/\ \/  \/_/\ \/    \ \ \/\ \   \ \ `\\ \   
 \ \ \/_/_  \ \  __ \   \ \ \ \ \     \ \ \     \ \ \     \ \ \ \ \   \ \ , ` \  
  \ \ \L\ \  \ \ \/\ \   \ \ \_\ \     \ \ \     \_\ \__   \ \ \_\ \   \ \ \`\ \ 
   \ \____/   \ \_\ \_\   \ \_____\     \ \_\    /\_____\   \ \_____\   \ \_\ \_\
    \/___/     \/_/\/_/    \/_____/      \/_/    \/_____/    \/_____/    \/_/\/_/
                                                                                 

    저작권
-------------------------------------------------------------------------------------------------------------------------------------------------------
    저작권
             ______      ____       ____                  ____       __    __             __  __      ______      __  __      __  __     
 /'\_/`\    /\  _  \    /\  _`\    /\  _`\               /\  _`\    /\ \  /\ \           /\ \/\ \    /\  _  \    /\ \/\ \    /\ \/\ \    
/\      \   \ \ \L\ \   \ \ \/\ \  \ \ \L\_\             \ \ \L\ \  \ `\`\\/'/           \ \ \/'/'   \ \ \L\ \   \ \ \_\ \   \ \ `\\ \   
\ \ \__\ \   \ \  __ \   \ \ \ \ \  \ \  _\L              \ \  _ <'  `\ `\ /'             \ \ , <     \ \  __ \   \ \  _  \   \ \ , ` \  
 \ \ \_/\ \   \ \ \/\ \   \ \ \_\ \  \ \ \L\ \             \ \ \L\ \   `\ \ \              \ \ \\`\    \ \ \/\ \   \ \ \ \ \   \ \ \`\ \ 
  \ \_\\ \_\   \ \_\ \_\   \ \____/   \ \____/              \ \____/     \ \_\              \ \_\ \_\   \ \_\ \_\   \ \_\ \_\   \ \_\ \_\
   \/_/ \/_/    \/_/\/_/    \/___/     \/___/                \/___/       \/_/               \/_/\/_/    \/_/\/_/    \/_/\/_/    \/_/\/_/
                                                                                                                            

*/


//************* 수정 가능한 구역 ------------------------------------------
const userId = 14321103211;
const BotId = 14321103211;
//접두사
const j = '!';
//허용방
const roomList = ['들어오지마'];
//시스템 메세지 장식
const systemMessage = '[TRPG]\n';
const line = '──────────────';
const deco = systemMessage + line + '\n';
//저장위치
const Path = '/sdcard/Pictures/';
const NamePath = Path + 'NameList.txt';

//명령어 (추가는 능력에 따라 해주세요)
const CMDS = [
    [ {Cmd : '상점초기화', Code : 'StoreReset'}, /*시스템 메세지*/ {Cmd : '가방', Code : 'Bag'}, {Cmd : '광질', Code : 'Mining'}, {Cmd : '광질종료', Code : 'CancelMining'}, {Cmd : '벌목', Code : 'Logging'}, {Cmd : '벌목종료', Code : 'CancelLogging'}, {Cmd : '상점', Code : 'Store'} ],
    [ {Cmd : '가입', Code : 'signUp'} ],
    [ {Cmd : /^송금 (.+) (\d+)$/, Code : 'SendMoney'}, {Cmd : /^전송 (.+) (\d+) (\d+)$/, Code : 'SendItem'}]
];
//**************--------------------------------------------

const FS = FileStream;
const CreateArrayFile = (path) => {
    if(!FS.read(path)) FS.write(path, JSON.stringify([], null, 4));
};
CreateArrayFile(NamePath);
const RankArr = ['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸'];
const blank = ' ';
let NameLists = JSON.parse(FS.read(NamePath));
let Minerals = JSON.parse(FS.read(Path + 'Ore_Wood.json'));
let ItemBook = JSON.parse(FS.read(Path + 'ItemBook.json'));
let Server = JSON.parse(FS.read(Path + 'Server.json'));
const FullScreen = '\u200b'.repeat(500);

const Data = (displayName) => {
    return {
        Name : displayName,
        Code : Game.Tools.generateId(6),
        Tutorial : false,
        /* {} */

        Title : '',
        TitleBox : [],

        Gold : 1000,

        Inventory : [],

        Mine : {
            isMining : false,
            MineAmt : 0,
            Pixaxe : [
                {
                    Name : '나무 곡괭이',
                    Rank : '일반',
                    LvL : 1,
                    Time : 30,
                    Luck : [40, 30, 20, 8, 1.1, 0.8, 0.09, 0.01],
                    Selected : true
                }
            ]
        },

        Logg : {
            isLogging : false,
            LoggAmt : 0,
            Axe : [
                {
                    Name : '나무 도끼',
                    Rank : '일반',
                    LvL : 1,
                    Time : 20,
                    Selected : true
                }
            ]
        }
    };
};


/** 게임 실행기---------------------------------------------------------------------------*/
const Game = {

    Tools : {

        reply : (function(msg){}),

        wait : (function(sec){
            java.lang.Thread.sleep(sec * 1000);
        }),

        getrandom : (function(array){
            return array[Math.floor(Math.random()*(array.length))];
        }),

        generateId : (function(len){
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for(let i = 0; i < len; i++){
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }),

        save : (function(Id, obj){
            if(!Game.Tools.user(Id)){
                return false;
            }
            FS.write(Path + Id + '.txt', JSON.stringify(obj, null, 4));
            return true;
        }),

        user : (function(Id){
            return JSON.parse(FS.read(Path + Id + '.txt'));
        }),

        PercentRandom : (function(Names, Percent){
            if(Names.length !== Percent.length) return false;
            const TotalPercent = Percent.reduce((x, y) => x + y, 0);
            let number = Math.random() * TotalPercent;
            for (i in Names){
                number -= Percent[i];
                if (number <= 0) {
                    return Names[i];
                }
            }
        }),

        NumberTranslator : (function(num){
            if(!num) return 0;
            let wordArray = ['', '만', '억', '조', '경', '해', '자', '양', '구', '간', '정', '재', '극', '항아사', '아승기', '나유타', '불가사의', '무량대수'];
            let basicUnit = 10000, resultArray = [];
            let a = wordArray.reverse();
            for (let i = 0; i < wordArray.length; i++){
                let splitRes = Math.floor((num % Math.pow(basicUnit, i + 1))/Math.pow(basicUnit, i));
                if (splitRes > 0){
                    resultArray.unshift(String(splitRes) + a[wordArray.length - (i + 1)]);
                }
            }
            let comma = resultArray[resultArray.length - 1].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            resultArray.pop(), resultArray.push(comma);
            return resultArray.join(' ');
        }),

        gauge : (function(number, maximum, lengthofbar, doPerc, doSlash){
            if(isNaN(number)) return '숫자가 아님';
            if(String(number).includes('.')) number = Math.round(number);
            let nowbar = number<=0?[0,0]:number>=maximum?[lengthofbar, 100]:[Math.round(lengthofbar * (number / maximum)),Math.floor((number/maximum)*100)];
            let lastStr;
            (doPerc?lastStr=' 《 '+nowbar[1]+'% 》':doSlash?lastStr=' 《 '+number+' / '+maximum+' 》':'');
            return ('[' + ('█'.repeat(nowbar[0]))) + ('░'.repeat(lengthofbar - nowbar[0]) + ']' + lastStr);
        }),

        comma : (function(num){
            let parts = num.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        })

    },

    gameTools : {

        //도구 강화에 따른 미네랄 획득량
        MineralAmount : (function(lvl){
            return lvl < 3 ? 1 : lvl < 5 ? 2 : lvl < 7 ? 4 : lvl < 9 ? 5 : lvl == 9 ? 6 : lvl == 10 ? 7 : 15;
        }),

        sortInventory : (function(inventory){
            return inventory.sort((a, b) => {
              if (a.Rank != b.Rank) {
                return RankArr.indexOf(b.Rank) - RankArr.indexOf(a.Rank);
              } else {
                return a.Name.localeCompare(b.Name);
              }
            });
          })

    },

    TextTools : {

        TitleFunc : (function(tit, Name){
            return '«' + (tit?'(' + tit + ') ' + Name:'(칭호없음) ' + Name) + '» ';
        })

    },

    gameEvents : {

        StoreReset : (function(message, Id, room, isGroupChat, sender){

            if(Id != BotId) return;

            let resArr = [];

            let RandomCommon = Game.Tools.getrandom(ItemBook['일반']);

            resArr.push({Name : RandomCommon.Name, Rank : '일반', Price : (Math.floor((Math.random() * (1000 - 100)) + 100))});
            
            let RandomRare = Game.Tools.getrandom(ItemBook['희귀']);

            resArr.push({Name : RandomRare.Name, Rank : '희귀', Price : (Math.floor((Math.random() * (10000 - 1000)) + 1000))});

            let RandomSupRare = Game.Tools.getrandom(ItemBook['초희귀']);

            resArr.push({Name : RandomSupRare.Name, Rank : '초희귀', Price : (Math.floor((Math.random() * (100000 - 10000)) + 10000))});

            let RandomRK = Game.Tools.PercentRandom(['영웅', '전설', '초월', '영원', '불멸'], [60, 30, 6, 2, 2]);
            
            let RandomUpR = Game.Tools.getrandom(ItemBook[RandomRK])
            
            resArr.push({Name : RandomUpR.Name, Rank : RandomRK, Price : Number('100' + '0'.repeat(RankArr.indexOf(RandomRK)))});

            Server.Store = resArr;

            FS.write(Path + 'Server.json', JSON.stringify(Server, null, 4));

            return;

        }),

        checkList : (function(message, Id, room, isGroupChat, sender){
            let FileChecker = Game.Tools.user(Id);
            if(!FileChecker){
                Game.Tools.reply(deco + '가입을 먼저 해주세요.');
                return;
            }
            /*
            if(!FileChecker.Tutorial){
                //개인톡 체크
                Game.Tools.reply(deco + '튜토리얼을 먼저 해주세요.');
                return;
            }
            */
            return true;
        }),

        signUp : (function(message, Id, room, isGroupChat, sender){

            let inputName = message.slice(3);

            let finder = NameLists.find(x => x.Hash == Id)

            if(finder){

                Game.Tools.reply(deco + '이미 가입하셨습니다.');

                return;

            }

            if(!inputName){

                Game.Tools.reply(deco + '공백은 입력할 수 없습니다.');

                return;

            }

            if(/[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi.test(inputName)){

                Game.Tools.reply(deco + '닉네임에 특수문자는 입력이 불가합니다.');

                return;

            }

            if(inputName.length < 3 || inputName.length > 10){

                Game.Tools.reply(deco + '닉네임은 3~10글자 제한입니다.');

                return;

            }

            if(NameLists.find(x => x.Name == inputName)){

                Game.Tools.reply(deco + '중복된 이름입니다.');

                return;

            }

            NameLists.unshift({Name : inputName, Hash : Id});

            FS.write(NamePath, JSON.stringify(NameLists, null, 4));

            FS.write(Path + Id + '.txt', JSON.stringify(Data(inputName), null, 4));

            Game.Tools.reply(deco + '게임에 가입되셨습니다. "' + j + '튜토리얼"을 입력해 튜토리얼을 진행하세요.');
            
            Game.Tools.reply('본 게임은 폰트 사이즈 18pt 만을 지원하고 있습니다. 게임을 좀 더 쾌적하게 즐기시려면 해당 사이즈에 맞게 변경을 해주시기 바랍니다.');
           
            return;
        
        }),

        Book : (function(message){
            
        }),

        Store : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            Game.Tools.reply('[예란] : 어서오세요~');

            Game.Tools.reply(deco + '※상점 품목은 매일 변경됩니다.\n' + (Server.Store.map(x => '\n[' + x.Rank + '] ' + x.Name + ' : ' + Game.Tools.NumberTranslator(x.Price))).join(''));
        
        }),

        /*
        Bag : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            let p = Game.Tools.user(Id);

            let result = Game.TextTools.TitleFunc(p.Title, p.Name) + '님의 인벤토리' + FullScreen + '\n' + line + '\n※도구의 확률은 확률 기능을 통해 확인해주세요.\n※항상 플레이에 감사드립니다.';

            result += '\n\n============《곡괭이》============\n';

            let pix = p.Mine.Pixaxe.map(x => '\n[' + x.Rank + '] ' + x.Name + (x.Selected?' (장착됨)':'') + '\n\n└ <<레벨 : ' + x.LvL + '>>\n└ <<채굴시간 : ' + x.Time + '초>>');

            result += (p.Mine.Pixaxe.length?pix:'\n(비었음)');

            result += '\n\n============《도끼》============\n';

            let ax = p.Logg.Axe.map(x => '\n[' + x.Rank + '] ' + x.Name + (x.Selected?' (장착됨)':'') + '\n\n└ <<레벨 : ' + x.LvL + '>>\n└ <<채굴시간 : ' + x.Time + '초>>');

            result += (p.Logg.Axe.length?ax:'\n(비었음)');

            result += '\n\n============《아이템》============\n';

            let item = p.Inventory.map(x => '\n[' + x.Rank + '] ' + x.Name + ' x' + x.Amount);

            result += (p.Inventory.length?item:'\n(비었음)');

            Game.Tools.reply(result);

            return;

        }),
        for문사용해서 앞에 번호 표시
        map+join
        */

        SendMoney : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            let target = NameLists.find(x => x.Name == RegExp.$1);

            if(!target){

                Game.Tools.reply(deco + '해당 유저가 존재하지 않습니다.');

                return;

            }

            let p = Game.Tools.user(Id);

            if(target.Hash == Id){

                Game.Tools.reply(deco + '자기 자신입니다.');

                return;

            }

            let num = Number(RegExp.$2);
            
            if(num <= 0){

                Game.Tools.reply(deco + '액수 입력이 잘못되었습니다.');

                return;

            }

            let s = Game.Tools.user(target.Hash);

            

            if(p.Gold < num){

                Game.Tools.reply(deco + '돈이 부족합니다.');

                return;

            }

            p.Gold -= num;

            s.Gold += num;

            Game.Tools.save(target.Hash, s);

            Game.Tools.save(Id, p);

            Game.Tools.reply(deco + '송금이 완료되었습니다.');

            return;

        }),

        SendItem : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            let target = NameLists.find(x => x.Name == RegExp.$1);

            if(!target){

                Game.Tools.reply(deco + '해당 유저가 존재하지 않습니다.');

                return;

            }

            let p = Game.Tools.user(Id);

            if(target.Hash == Id){

                Game.Tools.reply(deco + '자기 자신입니다.');

                return;

            }
            
            let targetItem = RegExp.$2 - 1;

            if(!p.Inventory[targetItem]){

                Game.Tools.reply(deco + '해당 아이템이 존재하지 않습니다.')

                return;

            }

            let num = Number(RegExp.$3);

            if(num <= 0){

                Game.Tools.reply(deco + '갯수 입력이 잘못되었습니다.');

                return;

            }

            if(p.Inventory[targetItem].Amount < num){

                Game.Tools.reply(deco + '갯수 입력이 잘못되었습니다.');

                return;

            }

            let s = Game.Tools.user(target.Hash);

            let tarItm = s.Inventory.findIndex(x => x.Name == p.Inventory[targetItem].Name);

            if(tarItm == -1){

                s.Inventory.push({Name : p.Inventory[targetItem].Name, Rank : p.Inventory[targetItem].Rank, Amount : num});

                Game.gameTools.sortInventory(s.Inventory);

                Game.Tools.save(target.Hash, s);

            } else {

                s.Inventory[tarItm].Amount += num;

                Game.Tools.save(target.Hash, s);

            }

            let rest = '[' + p.Inventory[targetItem].Rank + '] ' + p.Inventory[targetItem].Name + ' x' + num;

            if(p.Inventory[targetItem].Amount == num){

                p.Inventory = p.Inventory.filter(x => x.Name != p.Inventory[targetItem].Name);

                Game.Tools.save(Id, p);

            } else if(p.Inventory[targetItem].Amount > num){

                p.Inventory[targetItem].Amount -= num;

                Game.Tools.save(Id, p);
            }

            Game.Tools.reply(deco + '아이템 전송이 완료되었습니다.\n\n' + rest);

            return;

        }),



        Mining : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            let p = Game.Tools.user(Id);

            if(p.Mine.isMining){

                Game.Tools.reply(deco + '이미 광질중입니다.');

                return;

            }

            if(p.Logg.isLogging){

                Game.Tools.reply(deco + '현재 벌목중입니다.');

                return;

            }

            let pixChecker = p.Mine.Pixaxe.find(x => x.Selected);

            if(!pixChecker){

                Game.Tools.reply(deco + '장착된 곡괭이가 없습니다.');

                return;

            }

            Game.Tools.reply(deco + (Game.TextTools.TitleFunc(p.Title, p.Name)) + '님이 광질을 시작하셨습니다.');

            p.Mine.isMining = true;

            Game.Tools.save(Id, p);

            Game.Tools.wait(pixChecker.Time);

            p = Game.Tools.user(Id);

            if(!p.Mine.isMining) return;

            let Crystals = {'철광석' : 30, '금광석' : 15, '아쿠아마린' : 30, '다이아몬드' : 5};

            let crysRanks = {'철광석' : '초희귀', '금광석' : '영웅', '아쿠아마린' : '전설', '다이아몬드' : '초월'};

            let crystalNames = {'철광석' : '철 크리스탈', '금광석' : '금 크리스탈', '아쿠아마린' : '아쿠아마린 크리스탈', '다이아몬드' : '다이아몬드 크리스탈'};

            let getRandomRK = Game.Tools.PercentRandom(RankArr, pixChecker.Luck);

            let popedOre = Game.Tools.getrandom(Minerals.Ores[getRandomRK]);

            let index = p.Inventory.findIndex(x => x.Name == popedOre);

            let ReturnAmount = Game.gameTools.MineralAmount(pixChecker.LvL);

            let crystal;

            if(Crystals.hasOwnProperty(popedOre)){

                crystal = Game.Tools.PercentRandom([popedOre, false], [Crystals[popedOre], 100 - (Crystals[popedOre])]);
            
                if(crystal){

                    let index2 = p.Inventory.findIndex(x => x.Name == crystalNames[crystal]);

                    if(index2 == -1){

                        p.Inventory.push({Name : crystalNames[crystal], Rank : crysRanks[crystal], Amount : 1});

                        p.Inventory = Game.gameTools.sortInventory(p.Inventory);

                    } else {

                        p.Inventory[index2].Amount++;

                    }

                }

            }

            if(index == -1){

                p.Inventory.push({Name : popedOre, Rank : getRandomRK, Amount : ReturnAmount});

                p.Inventory = Game.gameTools.sortInventory(p.Inventory);

            } else {

                p.Inventory[index].Amount += ReturnAmount;

            }

            p.Mine.isMining = false;

            p.Mine.MineAmt++;

            Game.Tools.save(Id, p);

            Game.Tools.reply(deco + (Game.TextTools.TitleFunc(p.Title, p.Name)) + '님이 아이템을 획득하셨습니다.\n\n'+ (crystal?'\n[' + crysRanks[crystal] + '] ' + crystalNames[crystal] + ' x1\n':'') + '[' + getRandomRK + '] ' + popedOre + ' x' + ReturnAmount);

            return;

        }),

        CancelMining : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            let p = Game.Tools.user(Id);

            if(!p.Mine.isMining){

                Game.Tools.reply(deco + '광질중이 아닙니다.');

                return;

            }

            p.Mine.isMining = false;

            Game.Tools.save(Id, p);

            Game.Tools.reply(deco + '광질이 종료되었습니다.');

            return;

        }),

        Logging : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            let p = Game.Tools.user(Id);

            if(p.Logg.isLogging){

                Game.Tools.reply(deco + '이미 벌목중입니다.');

                return;

            }

            if(p.Mine.isMining){

                Game.Tools.reply(deco + '현재 벌목중입니다.');

                return;

            }

            let AxeChecker = p.Logg.Axe.find(x => x.Selected);

            if(!AxeChecker){

                Game.Tools.reply(deco + '장착된 도끼가 없습니다.');

                return;

            }

            p.Logg.isLogging = true;

            Game.Tools.save(Id, p);

            Game.Tools.reply(deco + (Game.TextTools.TitleFunc(p.Title, p.Name)) + '님이 벌목을 시작하셨습니다');

            Game.Tools.wait(AxeChecker.Time);

            p = Game.Tools.user(Id);

            if(!p.Logg.isLogging) return;

            let randomRank = Game.Tools.PercentRandom(['일반', '희귀'], [70, 30]);

            let resultWood = Minerals.Woods[randomRank];

            let amt = AxeChecker.LvL * 3;

            let index = p.Inventory.findIndex(x => x.Name == resultWood);

            if(index == -1){

                p.Inventory.push({Name : resultWood, Rank : randomRank, Amount : amt});
            
                p.Inventory = Game.gameTools.sortInventory(p.Inventory);

            } else {

                p.Inventory[index].Amount += amt;

            }

            p.Logg.isLogging = false;

            Game.Tools.save(Id, p);

            Game.Tools.reply(deco + (Game.TextTools.TitleFunc(p.Title, p.Name)) + '님이 아이템을 획득하셨습니다.\n\n[' + randomRank + '] ' + resultWood + ' x' + amt);

            return;

        }),

        CancelLogging : (function(message, Id, room, isGroupChat, sender){

            let checker = Game.gameEvents.checkList(message, Id, room, isGroupChat, sender);

            if(!checker) return;

            let p = Game.Tools.user(Id);

            if(!p.Logg.isLogging){

                Game.Tools.reply(deco + '벌목중이 아닙니다.');

                return;

            }

            p.Logg.isLogging = false;

            Game.Tools.save(Id, p);

            Game.Tools.reply(deco + '벌목이 종료되었습니다.');

            return;

        }),
    
    },

    CommandFunc : (message, Id, room, isGroupChat, sender) => {
        //비교
        let FindSame = CMDS[0].find(x => x.Cmd == message);
        if(FindSame){
            return Game.gameEvents[FindSame.Code](message, Id, room, isGroupChat, sender);
        }
        //~시작
        let FindStarts = CMDS[1].find(x => message.startsWith(x.Cmd + blank));
        if(FindStarts){
            return Game.gameEvents[FindStarts.Code](message, Id, room, isGroupChat, sender);
        }
        //정규식
        let FindReg = CMDS[2].find(x => x.Cmd.test(message));
        if(FindReg){
            return Game.gameEvents[FindReg.Code](message, Id, room, isGroupChat, sender);
        }
        return;
    }

};


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, a, b, c, d){
    if(!roomList.includes(room)) return;
    Game.Tools.reply = (message) => {
        replier.reply(message);
    };

    if(!msg.startsWith(j)) return;
    msg = msg.slice(j.length);
    Game.CommandFunc(msg, userId, room, isGroupChat, sender);
    return;
}