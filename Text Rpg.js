const j = '!';

const AS = '\u200d'.repeat(500);

const FS = FileStream;

const Path = '/sdcard/Life/', UserPath = '/sdcard/Life/UserListData.txt', ServerPath = '/sdcard/Life/ServerData.json';

const line = 'ㅡ'.repeat(11);

const acces = '[Text RPG]\n' + line + '\n';

const Rooms = [];

const Ranks = ['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸'];

const system = require('LifeModule');

if(!FS.read(UserPath)) FS.write(UserPath, JSON.stringify([], null, 4));

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, xxx, Id2){

  //if(!Rooms.includes(room)) return;

  let p = scan(Id2);

  let Players = JSON.parse(FS.read(UserPath));

  let Server = JSON.parse(FS.read(ServerPath));

  //가입 명령어
  if(msg === '!가입'){
    
    if(p){ replier.reply(acces + '이미 가입하셨습니다.'); return; }

    let DisplayId = generateId(8);

    Data = {

      'Name' : sender,

      'Code' : DisplayId, /* 사용자 코드 */

      'Ban' : false,

      'Developer' : 0,

      'Block' : [],

      'Message' : [],

      'Title' : '(칭호없음)',

      'Items' : [],

      'Logging' : {

        'Axes' : [{'Name' : '나무 도끼', 'Rank' : '일반', 'Amount' : 1, 'isPicked' : true, 'Reducer' : 0}],

        'isLogging' : false,

        'Time' : 30

      },

      'Mine' : {

        'Pixaxe' : [{'Name' : '나무 곡괭이', 'Rank' : '일반', 'Amount' : 1, 'isPicked' : true, 'Reducer' : 0}],

        'isMining' : false,

        'Time' : 30

      },

      'Labor' : {

        'LvL' : 1

      },

      'Energy' : {

        'Now' : 100,

        'Max' : 100

      }
      
    };

    Players.unshift({'Name' : sender, 'userId' : Id2, 'Id' : DisplayId, 'PreviousName' : []});

    FS.write(UserPath, JSON.stringify(Players, null, 4));

    FS.write(Path + Id2 + '.txt', JSON.stringify(Data, null, 4));

    replier.reply(acces + sender + '님께서 가입하셨습니다.\'!도움말\'을 입력해 도움을 받아보세요.');

    replier.reply('[10,000G 지급완료]');

    return;

  }

  if(msg.startsWith(j) && !p){ replier.reply(acces + '가입을 해주세요.'); return; }

  if(msg.startsWith(j) && p.Ban){ replier.reply(acces + '밴 상태입니다.'); return; }

  //편지통
  if(p && p.Message.length !== 0){
    
    replier.reply('띵동! ' + sender + '님께 ' + p.Message.length + '개의 메세지가 도착했습니다.' + AS + '\n' + p.Message.join('\n'));
    
    p.Message = [];
    
    save(Id2, p);
  
  }

  //닉변감지
  if(p && p.Name !== sender){
    
    p.Name = sender;
  
    let Info = Players.find(x => x.userId === Id2);
  
    Info.PreviousName.push(Info.Name);

    Info.Name = sender;

    save(Id2, p);
  
    FS.write(UserPath, JSON.stringify(Players, null, 4));

  }
  
  if(!msg.startsWith(j)) return;

  msg = msg.slice(j.length);

  //문의 명령어
  if(msg.startsWith('문의 ')){

    Server.Report.push({'Name' : sender, 'Comment' : msg.slice(3)});

    FS.write(ServerPath, JSON.stringify(Server, null, 4));

    replier.reply(acces + '곧 답변을 드리겠습니다. 감사합니다.');

  }

  //공지 명령어
  if(msg === '공지'){

    replier.reply(Server.Notice);

  }

  //멤버검색 명령어
  if(/^멤버검색 @?(.+)$/.test(msg)){

    let keyword = RegExp.$1.trim();

    if(!keyword){ replier.reply(acces + '잘못된 값입니다.'); return; }

    let result = Players.filter(x => x.Name.includes(keyword));

    if(!result.length){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    let f = '[' + keyword + ']의 검색결과\n' + line + '\n총 ' + result.length + '개\n';

    for(i in result){ f += '\n[' + result[i].Name + '] : ' + result[i].Id; }

    replier.reply(f);

  }

  //차단 명령어
  if(msg.startsWith('차단 ')){

    let targetInfo = Players.find(x => x.Id === msg.slice(3));

    if(!targetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    if(p.Block.includes(targetInfo.Id)){ replier.reply(acces + '이미 차단한 상대입니다.'); return; }

    p.Block.push(targetInfo.Id);

    save(Id2, p);

    replier.reply(acces + sender + '님께서 ' + targetInfo.Name + '님을 차단하셨습니다.');

  }

  //차단해제 명령어
  if(msg.startsWith('차단해제 ')){

    let targetInfo = Players.find(x => x.Id === msg.slice(5));

    if(!targetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    if(!p.Block.includes(targetInfo.Id)){ replier.reply(acces + '차단한 상대가 아닙니다.'); return; }

    p.Block.splice(p.Block.indexOf(targetInfo.Id), 1);

    save(Id2, p);

    replier.reply(acces + sender + '님께서 ' + targetInfo.Name + '님을 차단해제 하셨습니다.');

  }

  //편지 명령어
  if(/^편지\s(\w+)\s(.+)$/.test(msg)){

    let targetInfo = Players.find(x => x.Id === RegExp.$1);

    if(!targetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    let s = scan(targetInfo.userId);

    if(s.Block.includes(p.Code)){ replier.reply(acces + '상대가 사용자를 차단한 상태입니다.'); return; }

    s.Message.push('\n[수신자] : ' + sender + '\n[내용] : ' + RegExp.$2);

    save(targetInfo.userId, s);

    replier.reply(acces + sender + '님께서 ' + targetInfo.Name + '님께 메세지를 전달하셨습니다.');

  }

  //가방 명령어
  if(msg === '가방'){
   //특징은 도감에!
    let result = '«' + p.Title + sender + '»님의 가방' + AS + '\n\n';

    let SortedAxes = p.Logging.Axes.sort((x, y) => Ranks.indexOf(x.Rank) === Ranks.indexOf(y.Rank) ? x.Name.localeCompare(y.Name) : Ranks.indexOf(y.Rank) - Ranks.indexOf(x.Rank));

    SortedAxes = SortedAxes.map(x => '[' + x.Rank + '] ' + x.Name + (x.isPicked ? ' (장착됨)' : '')).join('\n\n');

    let SortedPixaxes = p.Mine.Pixaxe.sort((x, y) => Ranks.indexOf(x.Rank) === Ranks.indexOf(y.Rank) ? x.Name.localeCompare(y.Name) : Ranks.indexOf(y.Rank) - Ranks.indexOf(x.Rank));

    SortedPixaxes = SortedPixaxes.map(x => '[' + x.Rank + '] ' + x.Name +  (x.isPicked ? ' (장착됨)' : '')).join('\n\n');

    let SortedItems = p.Items.sort((x, y) => Ranks.indexOf(x.Rank) === Ranks.indexOf(y.Rank) ? x.Name.localeCompare(y.Name) : Ranks.indexOf(y.Rank) - Ranks.indexOf(x.Rank));

    SortedItems = SortedItems.map(x => '[' + x.Rank + '] ' + x.Name + ' x' + x.Amount).join('\n\n');

    if(!p.Logging.Axes.length) SortedAxes = '(비었음)'; if(!p.Mine.Pixaxe.length) SortedPixaxes = '(비었음)'; if(!p.Items.length) SortedItems = '(비었음)';

    replier.reply(result + '<《도끼》>\n\n' + SortedAxes + '\n\n<《곡괭이》>\n\n' + SortedPixaxes + '\n\n<《아이템》>\n\n' + SortedItems);

  }

  //가방 명령어2
  if(msg.startsWith('가방 ')){

    let TargetInfo = Players.find(x => x.Id === msg.slice(3));

    if(!TargetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    let s = scan(TargetInfo.userId);

    let result = '«' + s.Title + TargetInfo.Name + '»님의 가방' + AS + '\n\n';

    let SortedAxes = s.Logging.Axes.sort((x, y) => Ranks.indexOf(x.Rank) === Ranks.indexOf(y.Rank) ? x.Name.localeCompare(y.Name) : Ranks.indexOf(y.Rank) - Ranks.indexOf(x.Rank));

    SortedAxes = SortedAxes.map(x => '[' + x.Rank + '] ' + x.Name + (x.isPicked ? ' (장착됨)' : '')).join('\n\n');

    let SortedPixaxes = s.Mine.Pixaxe.sort((x, y) => Ranks.indexOf(x.Rank) === Ranks.indexOf(y.Rank) ? x.Name.localeCompare(y.Name) : Ranks.indexOf(y.Rank) - Ranks.indexOf(x.Rank));

    SortedPixaxes = SortedPixaxes.map(x => '[' + x.Rank + '] ' + x.Name +  (x.isPicked ? ' (장착됨)' : '')).join('\n\n');

    let SortedItems = s.Items.sort((x, y) => Ranks.indexOf(x.Rank) === Ranks.indexOf(y.Rank) ? x.Name.localeCompare(y.Name) : Ranks.indexOf(y.Rank) - Ranks.indexOf(x.Rank));

    SortedItems = SortedItems.map(x => '[' + x.Rank + '] ' + x.Name + ' x' + x.Amount).join('\n\n');

    if(!s.Logging.Axes.length) SortedAxes = '(비었음)'; if(!s.Mine.Pixaxe.length) SortedPixaxes = '(비었음)'; if(!s.Items.length) SortedItems = '(비었음)';

    replier.reply(result + '<《도끼》>\n\n' + SortedAxes + '\n\n<《곡괭이》>\n\n' + SortedPixaxes + '\n\n<《아이템》>\n\n' + SortedItems);

  }

  //벌목 명령어
  if(msg === '벌목'){

    if(p.Logging.isLogging){ replier.reply(acces + '이미 벌목중입니다.'); return; }
    
    if(p.Mine.isMining){ replier.reply(acces + '광질중에는 이용하실 수 없습니다.'); return; }
    
    if(!p.Logging.Axes.some(x => x.isPicked)){ replier.reply(acces + '장착된 도끼가 없습니다.'); return; }

    if(p.Energy.Now < 5){ replier.reply(acces + '에너지가 부족합니다.'); return; }

    replier.reply(acces + '«' + p.Title + sender + '» 님이 벌목을 시작하셨습니다.');

    let FilteredWoods = system.Woods[PercentRandom(['Common', 'Rare', 'SuperRare', 'Epic', 'Legendary', 'OverPowered', 'Infinity', 'Deathfull'], [4109, 3000, 1500, 800, 500, 70, 20, 1])]

    let RandomWood = FilteredWoods[Math.floor(Math.random() * FilteredWoods.length)];
    //reducer == 줄일 시간
    let TimeReduce = p.Logging.Axes.find(x => x.isPicked).Reducer;

    p.Logging.isLogging = true; save(Id2, p);

    wait(p.Logging.Time - TimeReduce);

    let a = p.Items.findIndex(x => x.Name === RandomWood.Name);

    if(a === -1){ p.Items.push({'Name' : RandomWood.Name, 'Rank' : RandomWood.Rank, 'Amount' : 1}); } else { p.Items[a].Amount++; }
    
    p.Logging.isLogging = false; p.Energy.Now -= 5; save(Id2, p);

    replier.reply(acces + '«' + p.Title + sender + '» 님이 [' + RandomWood.Rank + '] ' + RandomWood.Name + '을/를 획득하셨습니다.');

  }

  //광질 명령어 - 레벨이 높을수록 수량 업
  if(msg === '광질'){

    if(p.Mine.isMining){ replier.reply(acces + '이미 광질중입니다.'); return; }
    
    if(p.Logging.isLogging){ replier.reply(acces + '벌목중에는 이용하실 수 없습니다.'); return; }
    
    if(!p.Mine.Pixaxe.some(x => x.isPicked)){ replier.reply(acces + '장착된 곡괭이가 없습니다.'); return; }

    if(p.Energy.Now < 5){ replier.reply(acces + '에너지가 부족합니다.'); return; }

    replier.reply(acces + '«' + p.Title + sender + '» 님이 광질을 시작하셨습니다.');

    let FilteredMinerals = system.Minerals[PercentRandom(['Common', 'Rare', 'SuperRare', 'Epic', 'Legendary', 'OverPowered', 'Infinity', 'Deathfull'], [4109, 3000, 1500, 800, 500, 70, 20, 1])]

    let RandomMinerals = FilteredMinerals[Math.floor(Math.random() * FilteredMinerals.length)];
    //reducer == 줄일 시간
    let TimeReduce = p.Mine.Pixaxe.find(x => x.isPicked).Reducer;

    p.Mine.isMining = true; save(Id2, p);

    wait(p.Mine.Time - TimeReduce);

    let a = p.Items.findIndex(x => x.Name === RandomMinerals.Name);

    if(a === -1){ p.Items.push({'Name' : RandomMinerals.Name, 'Rank' : RandomMinerals.Rank, 'Amount' : 1}); } else { p.Items[a].Amount++; }
    
    p.Mine.isMining = false; p.Energy.Now -= 5; save(Id2, p);

    replier.reply(acces + '«' + p.Title + sender + '» 님이 [' + RandomMinerals.Rank + '] ' + RandomMinerals.Name + '을/를 획득하셨습니다.');

  }

  //연구실 명령어
  if(msg === '연구실'){

    let res = '«' + p.Title + sender + '»님의 연구실' + AS;

    for(key in system.Laboratory){

      if(p.Labor.LvL >= key){

        res += '\n\n<《Lv.' + key + '》>\n\n' + system.Laboratory[key].map(x => x.Maker.map(y => '[' + y.Rank + '] ' + y.Name + ' x' + y.Amount).join(' + ') + ' = ' + '[' + x.Rank + '] ' + x.Name + ' x' + x.Amount).join('\n\n');
      
      }
      
      if(p.Labor.LvL < key){
      
        res += '\n\n<《Lv.' + key + ' (잠금)》>\n\n' + system.Laboratory[key].map(x => x.Maker.map(y => '[' + y.Rank + '] ??? x' + y.Amount).join(' + ') + ' = ' + '[' + x.Rank + '] ??? x' + x.Amount).join('\n\n');
      
      }
   
    }

    replier.reply(res);

  }

  //제작 명령어
  if(/^제작 (.+) (\d+)$/.test(msg)){

    let result = RegExp.$1;

    let num = RegExp.$2.trim();

    if(!num || isNaN(num)){ replier.reply(acces + '잘못된 값입니다.'); return; }

    let res;

    for(key in system.Laboratory){
      
      let search = system.Laboratory[key].map(x => x.Name).includes(result);
        
      if(key <= p.Labor.LvL){
            
        if(search){

          res = system.Laboratory[key];

          break;

        }
        
      }
        
      else if(key > p.Labor.LvL){
            
        if(search){
                
          res = 1;
                
          break;
            
        }else{
          
          res = 0;
          
          break;
          
        }
        
      }
    
    }

    if(!res){ replier.reply(acces + '존재하지 않는 아이템입니다.'); return; }

    if(res === 1){ replier.reply(acces + '현재는 제작이 불가능한 아이템입니다.'); return; }

    let FindLab = res.find(x => x.Name === result);
    //Name이 포함되는지 확인
    if(!FindLab.Maker.every(x => p.Items.some(y => x.Name === y.Name))){ replier.reply(acces + '재료가 부족합니다.'); return; }

    let NewItem = Make(p.Items, num, FindLab.Maker, FindLab.Name, FindLab.Rank, FindLab.Amount);
    
    if(!NewItem){ replier.reply(acces + '재료가 부족합니다.'); return; }
    
    p.Items = NewItem;
    
    save(Id2, p);

    replier.reply(acces + '«' + p.Title + sender + '» 님이 [' + FindLab.Rank + '] ' + FindLab.Name + '을/를 제작하셨습니다.');

  }

  //닉네임기록 명령어
  if(msg.startsWith('전닉 ')){

    if(!p.Developer){ replier.reply(acces + '관리자가 아닙니다.'); return; }

    let TargetInfo = Players.find(x => x.Id === msg.slice(3));

    if(!TargetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    let Names = TargetInfo.PreviousName.map(x => '[' + x + ']').reverse();

    if(!Names.length){ replier.reply(acces + '닉네임 변경 기록이 없습니다.'); return; }

    replier.reply('[닉네임 조회 결과]\n' + line + '\n총 ' + Names.length + '개\n\n' + Names.join('\n'));

  }

  //밴 명령어
  if(msg.startsWith('밴 ')){

    if(!p.Developer){ replier.reply(acces + '관리자가 아닙니다.'); return; }

    let TargetInfo = Players.find(x => x.Id === msg.slice(2));

    if(!TargetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    let s = scan(TargetInfo.userId);

    if(s.Developer){ replier.reply(acces + '관리자는 밴이 불가능합니다.'); return; }

    if(s.Ban){ replier.reply(acces + '이미 밴 상태의 사용자입니다.'); return; }

    s.Ban = true;

    save(TargetInfo.userId, s);

    replier.reply(acces + sender + '님께서 ' + TargetInfo.Name + '님을 밴하셨습니다.');

  }

  //밴해제 명령어
  if(msg.startsWith('밴해제 ')){

    if(!p.Developer){ replier.reply(acces + '관리자가 아닙니다.'); return; }

    let TargetInfo = Players.find(x => x.Id === msg.slice(4));

    if(!TargetInfo){ replier.reply(acces + '존재하지 않는 사용자입니다.'); return; }

    let s = scan(TargetInfo.userId);

    if(!s.Ban){ replier.reply(acces + '밴 상태의 사용자가 아닙니다.'); return; }

    s.Ban = false;

    save(TargetInfo.userId, s);

    replier.reply(acces + sender + '님께서 ' + TargetInfo.Name + '님을 밴해제 하셨습니다.');

  }

  if(msg.startsWith('ev ')){

   // if(sender != '아몬드') return;

    let res = msg.slice(3);

    try{

      replier.reply(eval(res));

    } catch(e){

      replier.reply(e);

    }

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

function PercentRandom(Names, Percent){
  
  if(Names.length !== Percent.length) return false;

  const TotalPercent = Percent.reduce((x, y) => x + y, 0);
  
  let number = Math.random() * TotalPercent;
  
  for (i in Names){
  
    number -= Percent[i];
  
    if (number <= 0) {
  
      return Names[i];
  
    }
  
  }

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

/** Make(인벤토리, 재료 배열, 생성할 아이템 이름, 생성할 아이템 등급, 생성할 아이템 수량) */
function Make(Inventory, Amount, Ingredients, ItemName, ItemRank, ItemAmount){

  let newInventory = [];

  for (i in Inventory) {

    let Item = Inventory[i];

    let Ingredient = Ingredients.find(x => x.Name === Item.Name);

    if (Ingredient){

      let newAmount = Item.Amount - Ingredient.Amount * Amount;

      if (newAmount >= 0) {

        newInventory.push({'Name' : Item.Name, 'Rank' : Item.Rank, 'Amount' : newAmount});

      }

      if(newAmount < 0){

        return null;

      }

    } else{

      newInventory.push(Item);

    }

  }

  let a = newInventory.findIndex(x => x.Name === ItemName);

  if(a === -1){ newInventory.push({'Name' : ItemName, 'Rank' : ItemRank, 'Amount' : (ItemAmount * Amount)}); } else { newInventory[a].Amount += (ItemAmount * Amount); }
  
  return newInventory.filter(x => x.Amount !== 0);

}

