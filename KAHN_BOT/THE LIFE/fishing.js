/*
물고기 낚을 확률을 잘못 수정하면 유저정보 표시에 문제가 생깁니다.
모든 주석을 꼼꼼히 읽어본 후 사용하시기 바랍니다.
명령어 및 수치설정은 첨부된 fishing_data.js 파일에 있습니다.
http://kkyuya.tistory.com
*/
const fishData=require('fishing_data');
const ii = "━━━━━━━━━━";
const ll = "━━━━━━━━━━━━━━";
const li = "━━━━━━━━━━━━━━━━━━━━━━━━";
const more = "​".repeat(500);
const path='sdcard/Fishing/user/';  //유저경로
const pathRank='sdcard/Fishing/rank.json';  //랭킹파일경로
const FS=FileStream;
var fishUser={};  //낚시유저 데이터
var fishInv={};
var fishdelay={};  //낚시 소요시간
var fishOn={};  //낚시 On/Off

/* 천단위함수 */
function Div(str) {
    str = String(str);
    str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return str;
}

const fishfail=fishData.fishfail;
const rodArr=fishData.rodArr;
const baitArr=fishData.baitArr;
const fishArr=fishData.fishArr;
const fishex=fishData.fishex;
const nofishArr=fishData.trashex;
const fishcmd=fishData.fishcmd;
const config=fishData.config;

/* 랭크업 함수 */
rankup=(a)=>{
    for(let i=config.rank.name.length-1; i>-1; i--){
        if(a.count.true>=config.rank.if[i]){
        a.rank=config.rank.name[i];
        a.successRate=config.rank.success[i];
        a.maxHp=config.rank.maxHp[i];
        a.rest=config.rank.rest[i];
        a.castT=config.rank.castT[i];
        break;
        }
    }
};

/* 업데이트 함수 */
update=(a)=>{
    if(a.count.true+a.count.fail!=a.count.total) a.count.total=Number(a.count.true)+Number(a.count.fail);
};


function response(r, msg, s, isGroupChat, replier, imageDB) {

/* 도움말 */
if(msg==fishcmd.help){
    replier.reply([
    '🎣 세라 낚시터 명령어'+more,li,
    '※ 낚시성공횟수가 일정횟수에 도달하면 칭호가 변경되요.',
    '※ 칭호Up :: 낚시성공률 증가, 휴식시간/낚시소요시간 감소',
    '※ 낚싯대 :: 쓰레기/물고기 낚을 확률에 영향',
    '※ 미끼 :: 거대어종 낚을 확률에 영향',li,
    fishcmd.uphelp+' : 낚시 시스템 도움말',
    fishcmd.join+' : 세라낚시터 회원등록',
    fishcmd.info+' : 나의 낚시정보 보기',
    fishcmd.box+' : 잡은 물고기 보관통',
    fishcmd.info+' @이름 : 상대방의 낚시정보 보기',li,
    fishcmd.play+' : 낚시하기',
    fishcmd.rest+' : 체력회복 (토글)',
    fishcmd.lock+' (숫자) : 판매하지 않을 물고기 선택',
    fishcmd.unlock+' (숫자) : 물고기 잠금 해제',
    '( ※ 연속선택 예시 ..잠금 2-8 : 2~8번 모두잠금 )',li,
    fishcmd.sell+' : 잠금안된 물고기 모두 판매',
    fishcmd.rodpop+' : 낚싯대 뽑기 ('+Div(config.rodpopPrice)+'골드)',
    fishcmd.rodnamepop+' : 낚싯대뽑기, 능력치고정 ('+Div(config.rodnamePrice)+'골드)',
    fishcmd.rodup+' : 낚싯대 강화(골드소모)',
    fishcmd.bait+' (수량) : 미끼구매',
    fishcmd.baitup+' : 미끼 강화(골드,성공횟수 소모)',li,
    fishcmd.rank+' : 낚시터 순위 보기',
    fishcmd.title+' : 낚시터 칭호 목록',li,
    fishcmd.leave+' : 세라낚시터 회원해지'
    ].join('\n'));
    return;
}

if(msg==fishcmd.uphelp){
    replier.reply([
        '🐬 세라 낚시터 도움말'+more,li,
        '※ 낚시터 명령어는 "'+fishcmd.help+'"에서 확인하세요.',,
        ll,'√ 낚싯대 뽑기',ll,
        '• 뽑기의 최초 가격은 '+Div(config.rodpopPrice)+'골드예요.',
        '• 뽑기를 거듭할 수록 가격이 '+Div(config.rodpopPriceCoe)+'골드씩 늘어나요.',
        '• 낚싯대 이름과 능력치는 별개예요.',
        '• 원하는 능력치가 나왔다면 이름뽑기로 이름만 바꿀 수 있어요.',,
        ll,'√ 낚싯대 강화',ll,
        '• 낚싯대를 강화하여 낚을확률을 영구적으로 올려요.',
        '• 레벨당 중어이상 물고기 낚을확률이 소폭 증가',
        '• 반대로 소형어종을 낚을확률은 줄어들어요.',
        '• 강화비용은 "낚싯대레벨x'+Div(config.rodupPrice)+'골드" 예요.',
        '• 현재 최대레벨은 Lv.'+config.maxRodup+' 이예요.',
        '• 낚싯대를 다시 뽑아도 강화레벨이 유지되요.',,
        ll,'√ 미끼 강화',ll,
        '• 미끼를 다른미끼로 강화해요.',
        '• 대어이상 낚을 확률이 대폭 증가해요',
        '• 일정량의 골드와 낚시성공횟수가 필요해요.',
        '• 강화하면 미끼의 가격이 대폭증가해요.',,
        ll,'√ 칭호 시스템',ll,
        '• 낚시성공횟수에 따라 칭호가 자동적용되요.',
        '• 낚시성공확률, 낚시시간, 휴식시간이 바뀌어요.',
        '• "..낚시칭호" 명령어로 자세한 내용을 확인해보세요.'
    ].join('\n'));
}

/* 낚시터 입장, 등록 */
if(msg==fishcmd.join){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        if(s.includes('/')){
            replier.reply('@'+s+' \n• 닉네임에 슬래시"/" 가 들어가면 가입할 수 없어요.');
            return;
        }
        if(s.length<1){
            replier.reply('@'+s+' \n• 닉네임이 공백이면 가입할 수 없어요.');
            return;
        }
        let data={
            'name':s,
            'hp':config.rank.maxHp[0], 'maxHp':config.rank.maxHp[0],
            'best':{
                'name':'없음',
                'cm':0
            },
            'item':'낡은낚싯대',
            'rodpop':0,  //낚싯대 뽑은 횟수
            'lv':1,  //낚싯대 레벨
            'stat':{
                'xxl':0, 'xl':0, 'l':0, 'm':0, 'trash':0  //낚싯대 능력치
            },
            'rank':config.rank.name[0],  //칭호
            'gold':1000,  //초기보유자금
            'Bait':baitArr[0],  //미끼이름
            'bait':50, //초기미끼갯수
            'count':{
                'total':0,  //낚시횟수
                'true':0,  //낚시 성공횟수
                'fail':0  //낚시 실패횟수
            },
            'successRate':0,  //낚시성공률
            'rest':Number(config.rank.rest[0]),  //체력+1당 휴식시간
            'castT':0,  //캐스팅시간
            'restOn':{'on':0, 'time':0}  //휴식객체
        };
        let inv={'lock':[],'fish':[]};
        FS.write(path+s+"/"+s+'.json', JSON.stringify(data));
        FS.write(path+s+'/inv.json', JSON.stringify(inv));
        replier.reply('@'+s+' \n• 낚시터에 오신것을 환영해요!\n• "..낚시" 명령어로 낚싯대를 던져보세요.');
    } else replier.reply('@'+s+' \n• 이미 낚시터 회원이예요.');
}

/* 낚시터 퇴장, 탈퇴 */
if(msg==fishcmd.leave){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null) replier.reply('@'+s+' \n• 낚시터에 등록된 분이 아니예요.');
    else{
        let fishRank=JSON.parse(FS.read(pathRank));
        if(fishRank.some(e=>e.name==s)){
            fishRank.splice(fishRank.findIndex(e=>e.name==s),1);
            FS.write(pathRank, JSON.stringify(fishRank));
        }
        FS.remove(path+s+"/"+s+'.json');
        FS.remove(path+s+'/.json');
        replier.reply('@'+s+' \n• 낚시터 주인에게 발각되어 쫓겨났어요.\n• 낚시정보 삭제 완료.');
    }
    return;
}

/* 낚시 하기 */
if(fishcmd.play.includes(msg)){
    /* 디바이스 온도 체크 */
    if(Device.getBatteryTemperature()>=400){
        replier.reply('@'+s+' \n• 세라가 과열되었어요!\n• 식은 후 다시 시도해 주세요.');
        return;
    }
    /* 쓰레드감지 */
    if(Api.getActiveThreadsCount()>=5){
        replier.reply('@'+s+' \n• 사용자 폭주중이예요.\n• 잠시후에 다시 시도해 주세요.');
        return;
    }
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    if(fishOn[s]==undefined) fishOn[s]=0;
    if(fishOn[s]){
        replier.reply('@'+fishUser[s].name+'\n• 낚시중이예요. 기다리세요.');
        return;
    }
    update(fishUser[s]);
    if(fishUser[s].restOn.on){
        replier.reply('@'+s+' \n• 휴식중에는 낚시를 할 수 없어요.\n• "'+fishcmd.rest+'" 을 입력해서 종료하세요.');
        return;
    }
    if(fishUser[s].hp<=0){
        replier.reply('@'+s+' \n• 체력이 부족해요.\n• "'+fishcmd.rest+'" 명령어를 사용해보세요.');
        return;
    }
    if(fishUser[s].bait<=0){
        replier.reply('@'+s+' \n• 미끼가 없어요.\n• "'+fishcmd.bait+' (수량)" 명령어를 사용해보세요.');
        return;
    }
    fishOn[s]=1;
    fishInv[s]=JSON.parse(FS.read(path+s+'/inv.json'));
    fishdelay[s]=Math.random()*(config.castT.max*1000-config.castT.min*1000)+config.castT.min*1000-Number(fishUser[s].castT);  //낚시 소요시간
    let ltt=fishUser[s].item.length-1;
    replier.reply('• '+'<'+fishUser[s].rank+'> '+
        fishUser[s].name+'님이 '+fishUser[s].item+
        (fishUser[s].item[ltt].normalize("NFD").length == 3 ? '을' : '를')+' 던졌어요!');
    let rd=Math.random()*100;
    if(rd<=100-config.success-fishUser[s].successRate){
        ++fishUser[s].count.total;  //낚시횟수 증가
        ++fishUser[s].count.fail;
        --fishUser[s].hp;  //체력감소
        replier.reply('@'+fishUser[s].name+' \n'+
            fishfail[Math.random()*fishfail.length|0]+
            '\n• 낚시 실패!');
    }
    else{
        java.lang.Thread.sleep(fishdelay[s]);
        let fish;  //물고기이름
        let cmrd;  //물고기길이(number)
        let cm;  //물고기길이(string)
        let result;   //결과설명
        let baitCoe=Number(baitArr.indexOf(fishUser[s].Bait)*config.baitCoe);  //미끼로 인한 확률증가
        let rdfish=Math.random()*1000;
        if(rdfish<=(config.p.xxl*10+baitCoe+
            Number(fishUser[s].lv)-1+Number(fishUser[s].stat.xxl))){
            fish='<신화> '+fishArr.fish5[Math.random()*fishArr.fish5.length|0];
            cmrd=(Math.random()*294800+5200).toFixed(1);
            cm='('+cmrd+'Cm)';
            result=fishex.ex4[Math.random()*fishex.ex4.length|0];
        } else if(rdfish<=((config.p.xl+config.p.xxl)*10+baitCoe+
            Number(fishUser[s].lv)-1+Number(fishUser[s].stat.xxl)+Number(fishUser[s].stat.xl))){
            fish='<에픽> '+fishArr.fish4[Math.random()*fishArr.fish4.length|0];
            cmrd=(Math.random()*4500+700).toFixed(1);
            cm='('+cmrd+'Cm)';
            result=fishex.ex4[Math.random()*fishex.ex4.length|0];
        } else if(rdfish<=((config.p.l+config.p.xl+config.p.xxl)*10+baitCoe+
            Number(fishUser[s].lv)-1+Number(fishUser[s].stat.xxl)+Number(fishUser[s].stat.xl)+Number(fishUser[s].stat.l))){
            fish='<대물> '+fishArr.fish3[Math.random()*fishArr.fish3.length|0];
            cmrd=(Math.random()*600+100).toFixed(1);
            cm='('+cmrd+'Cm)';
            result=fishex.ex3[Math.random()*fishex.ex3.length|0];
        } else if(rdfish<=((config.p.m+config.p.l+config.p.xl+config.p.xxl)*10+
            Number(fishUser[s].lv)-1+Number(fishUser[s].stat.xxl)+Number(fishUser[s].stat.xl)+Number(fishUser[s].stat.l)+Number(fishUser[s].stat.m))){
            fish=fishArr.fish2[Math.random()*fishArr.fish2.length|0];
            cmrd=(Math.random()*85+15).toFixed(1);
            cm='('+cmrd+'Cm)';
            result=fishex.ex2[Math.random()*fishex.ex2.length|0];
        } else if(rdfish<=((config.p.s+config.p.m+config.p.l+config.p.xl+config.p.xxl)*10-
            Number(fishUser[s].stat.trash))){
            fish=fishArr.fish1[Math.random()*fishArr.fish1.length|0];
            cmrd=(Math.random()*14+1).toFixed(1);
            cm='('+cmrd+'Cm)';
            result=fishex.ex1[Math.random()*fishex.ex1.length|0];
        } else if(rdfish<=config.p.t){  //쓰레기 낚을확률
            fish=fishArr.trash[Math.random()*fishArr.trash.length|0];
            cmrd=0;
            cm='';
            result=nofishArr.ex1[Math.random()*nofishArr.ex1.length|0]+nofishArr.ex2[Math.random()*nofishArr.ex2.length|0];
        } else{
            fish=fishArr.gold[Math.random()*fishArr.gold.length|0];
            cmrd=Math.random()*1900+100|0;
            ++fishUser[s].count.total;  //낚시횟수 증가
            ++fishUser[s].count.true;  //성공횟수 증가
            --fishUser[s].hp;  //체력감소
            --fishUser[s].bait;  //미끼소모
            fishUser[s].gold=Number(fishUser[s].gold)+Number(cmrd);
            let lt=fish.length-1;
            FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
            replier.reply('@'+s+' \n• '+fish+(fish[lt].normalize("NFD").length == 3 ? '을' : '를')+
                ' 낚았어요.\n• '+Div(cmrd)+'골드 획득.');
            fishdelay[s]=undefined;
            fishOn[s]=0;
            return;
        }
        ++fishUser[s].count.total;  //낚시횟수 증가
        ++fishUser[s].count.true;  //성공횟수 증가
        --fishUser[s].hp;  //체력감소
        --fishUser[s].bait;  //미끼소모
        let fishRank=JSON.parse(FS.read(pathRank));
        if(!fishRank.some(e=>e.name==fishUser[s].name)){
            let rfish={
                'name':fishUser[s].name,
                'rank':fishUser[s].rank,
                'fish':{'name':'없음','size':0}
            };
            if(cmrd!=0){
                rfish.fish.name=fish;
                rfish.fish.size=Number(cmrd);
            }
            fishRank.push(rfish);
            FS.write(pathRank, JSON.stringify(fishRank));
        } else{
            let n=fishRank.findIndex(e=>e.name==fishUser[s].name);
            if(Number(fishRank[n].fish.size)<Number(cmrd)){
                fishRank[n].rank=fishUser[s].rank;
                fishRank[n].fish.name=fish;
                fishRank[n].fish.size=Number(cmrd);
                FS.write(pathRank, JSON.stringify(fishRank));
            }
        }
        if(Number(fishUser[s].best.cm)<Number(cmrd)){  //최고기록 갱신
            fishUser[s].best.name=fish;
            fishUser[s].best.cm=Number(cmrd);
        }
        if(cmrd != 0){  //인벤토리에넣기
            let box={
                'name':fish,
                'size':cmrd,
                'gold':parseInt(cmrd*2)
            }
            fishInv[s].fish.push(box);
        }
        let lt=fish.length-1;
        replier.reply('@'+fishUser[s].name+' \n'+
        '• '+fish+Div(cm)+(fish[lt].normalize("NFD").length == 3 ? '을' : '를')+
        ' 낚았어요!\n• '+result);
    }
    rankup(fishUser[s]);
    FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
    FS.write(path+s+'/inv.json', JSON.stringify(fishInv[s]));
    fishdelay[s]=undefined;
    fishOn[s]=0;
    return;
}

/* 낚시정보, 유저정보 함수 */
function UserInfo(fishuser){
    update(fishuser);
    let truep;  //낚시성공률
    let xl, l, m, trash  //스탯등급
    let st=fishuser.stat;
    if(st.xl>25) xl='최상';
    else if(st.xl>15) xl='상';
    else if(st.xl>3) xl='중';
    else xl='하';
    if(st.l>80) l='최상';
    else if(st.l>50) l='상';
    else if(st.l>20) l='중';
    else l='하';
    if(st.m>170) m='최상';
    else if(st.m>100) m='상';
    else if(st.m>20) m='중';
    else m='하';
    if(st.trash<=-120) trash='최상';
    else if(st.trash<=-70) trash='상';
    else if(st.trash<=0) trash='중';
    else trash='하';
    let p={'xxl':config.p.xxl*10,'xl':config.p.xl*10,'l':config.p.l*10,
        'm':config.p.m*10,'s':config.p.s*10,'t':config.p.t*10,'g':config.p.g*10};
    let baitCoe=Number(baitArr.indexOf(fishuser.Bait)*config.baitCoe);  //미끼로 인한 확률증가
    let sfish=p.s-Number(st.xxl)-Number(st.xl)-Number(st.l)-Number(st.m)+Number(st.trash)-(Number(fishuser.lv)-1)*4;
    p.xxl=p.xxl+st.xxl+baitCoe+fishuser.lv-1;
    p.xl=p.xl+st.xl+baitCoe+fishuser.lv-1;
    p.l=p.l+st.l+baitCoe+fishuser.lv-1;
    p.m=p.m+st.m+fishuser.lv-1;
    p.t=p.t+st.trash;
    p.s=st.xxl+st.xl+st.l+st.m-st.trash+((fishuser.lv-1)*4);
    let need={
        'success':(baitArr.indexOf(fishuser.Bait)+1)*100,  //미끼강화 : 낚시성공횟수
        'baitupgold':(baitArr.indexOf(fishuser.Bait)+1)*20000,  //미끼강화 : 미끼가격
        'rodupgold':Number(fishuser.lv)*config.rodupPrice,  //낚싯대 강화 필요금액
        'rodpopgold':Number(fishuser.rodpop)*config.rodpopPriceCoe+config.rodpopPrice  //낚싯대 뽑기 필요금액
    };
    if(fishuser.count.true==0) truep=0;
    else truep=(100/(Number(fishuser.count.total)/Number(fishuser.count.true)));
    replier.reply([
    '🎣 <'+fishuser.rank+'> '+fishuser.name,ll,
    '• 체력 : '+fishuser.hp+'/'+fishuser.maxHp,
    '• 낚싯대 : '+fishuser.item+'(Lv.'+fishuser.lv+')',
    '• 미끼 : '+fishuser.Bait+' (개당 '+(baitArr.indexOf(fishuser.Bait)*7+1)*config.baitPrice+'골드)',
    '• 미끼갯수 : '+fishuser.bait+'개 ('+fishuser.bait+'/'+config.maxBait+')',
    '• 보유금 : '+Div(fishuser.gold)+'골드'+more,,
    ii,'√ 기록 정보',ii,
    '• 낚시횟수 : '+fishuser.count.total+'회',
    '• 성공횟수 : '+fishuser.count.true+'회',
    '• 실패횟수 : '+fishuser.count.fail+'회',
    '• 누적성공률 : '+truep.toFixed(1)+'%',
    '• 최고기록'+(fishuser.best.cm==0?
        ' : '+fishuser.best.name:'\n'+fishuser.best.name+' ('+Div(fishuser.best.cm)+'Cm)'),,
    ii,'√ 세부 정보',ii,
    '• 휴식시간 : '+(Number(fishuser.rest)/1000)+'초당 체력 +1',
    '• 낚시소요시간 : '+(config.castT.min-fishuser.castT/1000)+'~'+(config.castT.max-fishuser.castT/1000)+'초 ('+(fishuser.castT/1000)+'초 단축)',
    '• 낚시성공률 : '+(65+Number(fishuser.successRate))+'% (+'+fishuser.successRate+'%)',
    '• 전설어 낚을 확률 : '+p.xxl/10+'% ('+(fishuser.stat.xxl+baitCoe+fishuser.lv-1>=0?'+':'')+(Number(fishuser.stat.xxl+baitCoe+fishuser.lv-1)/10)+'%)',
    '• 초대어 낚을 확률 : '+p.xl/10+'% ('+(fishuser.stat.xl+baitCoe+fishuser.lv-1>=0?'+':'')+(Number(fishuser.stat.xl+baitCoe+fishuser.lv-1)/10)+'%) - '+xl,
    '• 대어 낚을 확률 : '+p.l/10+'% ('+(fishuser.stat.l+baitCoe+fishuser.lv-1>=0?'+':'')+(Number(fishuser.stat.l+baitCoe+fishuser.lv-1)/10)+'%) - '+l,
    '• 중어 낚을 확률 : '+p.m/10+'% ('+(fishuser.stat.m+fishuser.lv-1>=0?'+':'')+(Number(fishuser.stat.m+fishuser.lv-1)/10)+'%) - '+m,
    '• 소어 낚을 확률 : '+(sfish<0?'0':sfish/10)+'% ('+(p.s*(-1)>=0?'+':'')+p.s/10*(-1)+'%)',
    '• 쓰레기 낚을 확률 : '+(p.t<0?'0':p.t/10)+'% ('+(fishuser.stat.trash>=0?'+':'')+Number(fishuser.stat.trash)/10+'%) - '+trash,,
    ll,'√ 기타 정보',ll,
    '• 낚싯대뽑기 비용 : '+Div(need.rodpopgold)+'골드',
    '• 낚싯대강화 비용 : '+(fishuser.lv==config.maxRodup?'최대강화 완료':Div(need.rodupgold)+'골드'),
    '• 미끼강화 비용 : '+((baitArr.indexOf(fishuser.Bait)+1==baitArr.length)?'최대강화 완료':('낚시성공횟수 '+Div(need.success)+'회, '+Div(need.baitupgold)+'골드'))
    ].join('\n'));
}

/* 유저정보 */
if(msg==fishcmd.info){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    UserInfo(fishUser[s]);
    return;
}

/* 상대방정보 */
if(msg.startsWith(fishcmd.info+' ')){
    let u=msg.substr(fishcmd.info.length+2);
    fishUser[u]=JSON.parse(FS.read(path+u+"/"+u+'.json'));
    if(fishUser[u]==null){
        replier.reply('@'+s+' \n• 정보를 찾지 못했어요.');
        return;
    }
    UserInfo(fishUser[u]);
    return;
}

/* 낚시통 */
if(msg==fishcmd.box){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    date(fishUser[s]);
    fishInv[s]=JSON.parse(FS.read(path+s+'/inv.json'));
    replier.reply([
        '🪣 <'+fishUser[s].rank+'> '+fishUser[s].name+'님의 낚시통'+more,li,
        fishcmd.sell+' : 잠금 제외한 모든 물고기 판매',
        fishcmd.lock+' (숫자) : 판매하지 않을 물고기 선택',
        fishcmd.unlock+' (숫자) : 물고기 잠금 해제',
        '※ 숫자 연속선택 예시 >> ..잠금 2-5 (2~5번 물고기 잠금)',li,
        (fishInv[s].lock.length==0&&fishInv[s].fish.length==0) ? '※ 잡은 물고기가 없어요.' :
            (fishInv[s].lock.length==0 ? '' : '🔒 잠금된 물고기\n'+ll+'\n'+
            fishInv[s].lock.sort((a,b)=>b.size-a.size).map((e,i)=>++i+'. '+e.name+' ('+Div(e.size)+'Cm)').join('\n')+'\n'+li+'\n')+
            (fishInv[s].fish.length==0 ? '' : (
                fishInv[s].lock.length==0? '' : '🐟 판매 가능한 물고기\n'+ll+'\n')+
            fishInv[s].fish.sort((a,b)=>b.size-a.size).map((e,i)=>++i+'. '+e.name+' ('+Div(e.size)+'Cm)').join('\n'))
    ].join('\n'));
    FS.write(path+s+'/inv.json', JSON.stringify(fishInv[s]));
    return;
}

/* 낚시 랭킹, 순위표 */
if(msg==fishcmd.rank){
    let fishRank=JSON.parse(FS.read(pathRank));
    if(fishRank==null){
        let data=[];
        FS.write(pathRank, JSON.stringify(data));
        replier.reply('@'+s+' \n• 낚시랭킹 파일 생성완료!');
        return;
    }
    let arr=[];
    let result;
    if(fishRank.length==0||fishRank==undefined) result='※ 랭킹에 등록된 유저가 없어요.';
    else if(fishRank.length==1)
        result='1등. '+fishRank[0].fish.name+'('+Div(fishRank[0].fish.size)+'Cm)\n>> 유저명 : <'+fishRank[0].rank+'> '+fishRank[0].name;
    else{
        fishRank.sort((a,b)=>b.fish.size-a.fish.size);
        let n;
        if(fishRank.length<config.ranknum) n=fishRank.length;
        else n=config.ranknum;
        for(let i=0; i<n; i++) arr.push(fishRank[i]);
        result=arr.map((e,i)=>++i+'등. '+e.fish.name+'('+Div(e.fish.size)+'Cm)\n>> 유저명 : <'+e.rank+'> '+e.name).join('\n'+ll+'\n');
    }
    replier.reply([
        '🐠 낚시 랭킹 (순위표)'+more,li,
        result
    ].join('\n'));
    return;
}

/* 칭호목록 출력 */
if(msg==fishcmd.title){
    replier.reply([
        '🎖 세라낚시터 칭호 목록'+more,li,
        config.rank.name.map((e,i)=>[
            '• 칭호명 : '+e,
            '• 조건 : 낚시성공 '+Div(config.rank.if[i])+'회 도달',
            '• 낚시성공률 : +'+config.rank.success[i]+'%',
            '• 최대체력 : '+config.rank.maxHp[i],
            '• 휴식중 '+(config.rank.rest[i]/1000)+'초당 체력 1 회복',
            '• 낚시 소요시간 '+(config.rank.castT[i]/1000)+'초 단축'
        ].join('\n')).join('\n'+ll+'\n')
    ].join('\n'));
    return;
}

/* 낚싯대 이름 뽑기 */
if(msg==fishcmd.rodnamepop){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    if(fishUser[s].gold<config.rodnamePrice){
        let gold=config.rodnamePrice-Number(fishUser[s].gold);
        replier.reply('@'+s+' \n• '+Div(gold)+'골드가 부족해요.');
        return;
    }
    update(fishUser[s]);
    let roded=fishUser[s].item;  //이전 낚싯대 이름
    let rod=rodArr[Math.random()*rodArr.length|0];  //뽑은 낚싯대 이름
    let ltt=roded.length-1;
    let lt=rod.length-1;
    fishUser[s].item=rod;
    fishUser[s].gold=Number(fishUser[s].gold)-config.rodnamePrice;
    FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
    replier.reply('@'+s+' \n• '+Div(config.rodnamePrice)+'골드를 사용하여 "'+
    roded+(roded[ltt].normalize("NFD").length == 3 ? '"을' : '"를')+' "'+
    rod+(rod[lt].normalize("NFD").length==3 ? '"으로' : '"로')+' 변경 완료!');
    return;
}

/* 낚싯대 뽑기 */
if(msg==fishcmd.rodpop){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    update(fishUser[s]);
    let money=Number(fishUser[s].rodpop)*config.rodpopPriceCoe+config.rodpopPrice;  //뽑기비용계산
    if(fishUser[s].gold<money){
        let gold=money-Number(fishUser[s].gold);
        replier.reply('@'+s+' \n• '+Div(gold)+'골드가 부족해요.');
        return;
    }
    let rod=rodArr[Math.random()*rodArr.length|0];  //낚싯대이름
    let xl=Math.random()*32-2|0;  //-2 ~ 30
    let l=Math.random()*110-10|0;  //-10 ~ 100
    let m=Math.random()*250-50|0;  //-50 ~ 200
    let trash=Math.random()*200-150|0;  //-150 ~ 50
    let lt=rod.length-1;
    let xln, ln, mn, trashn  //스탯등급
    if(xl>25) xln='(최상)';
    else if(xl>15) xln='(상)';
    else if(xl>3) xln='(중)';
    else xln='(하)';
    if(l>80) ln='(최상)';
    else if(l>50) ln='(상)';
    else if(l>20) ln='(중)';
    else ln='(하)';
    if(m>170) mn='(최상)';
    else if(m>100) mn='(상)';
    else if(m>20) mn='(중)';
    else mn='(하)';
    if(trash<=-120) trashn='(최상)';
    else if(trash<=-70) trashn='(상)';
    else if(trash<=0) trashn='(중)';
    else trashn='(하)';
    fishUser[s].gold=Number(fishUser[s].gold)-money;
    fishUser[s].item=rod;
    fishUser[s].rodpop++;
    fishUser[s].stat.xl=Number(xl);
    fishUser[s].stat.l=Number(l);
    fishUser[s].stat.m=Number(m);
    fishUser[s].stat.trash=Number(trash);
    FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
    replier.reply([
        '@'+s+' ',
        '• '+Div(money)+'골드를 사용하여 "'+rod+(rod[lt].normalize("NFD").length == 3 ? '"을' : '"를')+' 뽑았어요.',
        '• 남은금액 : '+Div(fishUser[s].gold)+'골드',
        '• 다음 뽑기 비용은 '+Div(Number(money)+config.rodpopPriceCoe)+'골드예요.'+more,,
        ll,'√ '+rod+' 능력치',ll,
        '• 쓰레기 낚을 확률 : '+(trash>=0?'+':'')+(Number(trash)/10)+'% '+trashn,
        '• 중어 낚을 확률 : '+(m>=0?'+':'')+(Number(m)/10)+'% '+mn,
        '• 대어 낚을 확률 : '+(l>=0?'+':'')+(Number(l)/10)+'% '+ln,
        '• 초대어 낚을 확률 : '+(xl>=0?'+':'')+(Number(xl)/10)+'% '+xln
    ].join('\n'));
    return;
}

/* 낚싯대 강화 */
if(msg==fishcmd.rodup){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    if(fishUser[s].lv==config.maxRodup){
        replier.reply('@'+s+' \n• 낚싯대 레벨이 최대예요.');
        return;
    }
    update(fishUser[s]);
    let gold=Number(fishUser[s].lv)*config.rodupPrice;  //필요금액
    if(fishUser[s].gold<gold){
        replier.reply('@'+s+' \n• '+Div(gold-Number(fishUser[s].gold))+'골드가 부족해요.');
        return;
    }
    let golded=Number(fishUser[s].gold);  //원래 보유금액
    fishUser[s].gold=Number(fishUser[s].gold)-gold;  //골드차감
    fishUser[s].lv++;  //레벨증가
    FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
    replier.reply('@'+s+' \n• '+Div(gold)+'골드를 사용하여 "'+fishUser[s].item+'(Lv.'+(Number(fishUser[s].lv)-1)+' ➡ Lv.'+Number(fishUser[s].lv)+')" 로 증가되었어요.\n'+
        '• 보유금액 : '+Div(fishUser[s].gold)+'골드');
    return;
}

/* 미끼강화 */
if(msg==fishcmd.baitup){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    if(baitArr.indexOf(fishUser[s].Bait)==baitArr.length-1){
        replier.reply('@'+s+' \n• 미끼등급이 최대예요.');
        return;
    }
    let needs=(baitArr.indexOf(fishUser[s].Bait)+1)*100;  //필요 낚시성공횟수
    let gold=(baitArr.indexOf(fishUser[s].Bait)+1)*20000;  //미끼가격 계산
    let success=Number(fishUser[s].count.true);  //낚시성공횟수
    if(fishUser[s].gold<gold || success<needs){
        replier.reply('@'+s+(fishUser[s].gold<gold?' \n• '+Div(gold-fishUser[s].gold)+'골드가 부족해요.':'')+
            (success<needs?' \n• 낚시성공 '+(needs-success)+'회가 부족해요.':''));
        return;
    }
    let baited=fishUser[s].Bait;
    fishUser[s].gold=Number(fishUser[s].gold)-gold;
    fishUser[s].count.true=Number(fishUser[s].count.true)-needs;
    fishUser[s].count.total=Number(fishUser[s].count.total)-needs;
    fishUser[s].Bait=baitArr[baitArr.indexOf(fishUser[s].Bait)+1];
    FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
    replier.reply('@'+s+' \n• '+Div(gold)+'골드, 성공횟수 '+Div(needs)+'회 차감.\n'+
        '• 미끼 : '+baited+' ➡ '+fishUser[s].Bait);
    return;
}

/* 회복, 휴식 */
if(msg==fishcmd.rest){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    if(fishUser[s].hp>=fishUser[s].maxHp){
        replier.reply('@'+s+' \n• 체력이 최대예요.');
        return;
    }
    update(fishUser[s]);
    if(!fishUser[s].restOn.on){
        fishUser[s].restOn.time=Number(Date.now());
        fishUser[s].restOn.on=1;
        FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
        replier.reply('@'+s+' \n• 휴식을 시작합니다.\n• 중지하시려면 명령어를 다시 입력하세요.');
    } else{
        let time=Number(Date.now());
        time=parseInt((time-Number(fishUser[s].restOn.time))/Number(fishUser[s].rest));
        time=Number(time);
        let hp=Number(fishUser[s].hp);
        fishUser[s].hp=hp+Number(time);
        if(fishUser[s].hp>fishUser[s].maxHp) fishUser[s].hp=Number(fishUser[s].maxHp);
        fishUser[s].restOn.on=0;
        FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
        replier.reply('@'+s+' \n• 휴식을 종료했어요.\n• 체력 '+hp+'/'+fishUser[s].maxHp+' ➡ '+fishUser[s].hp+'/'+fishUser[s].maxHp);
    }
    return;
}

/* 미끼구매 */
if(msg.startsWith(fishcmd.bait)){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    let n=msg.split(' ')[1];
    if(n==undefined) n=1;
    if(n<1){
        replier.reply('@'+s+' \n• 0과 음수는 기입할 수 없어요.');
        return;
    }
    if(isNaN(n)){
        replier.reply('@'+s+' \n• 갯수는 숫자로만 적어주세요.');
        return;
    }
    n=parseInt(n);
    if(fishUser[s].bait+n>config.maxBait){
        replier.reply('@'+s+' \n• 미끼는 최대 '+config.maxBait+'개까지 보유가능해요.\n• 현재 미끼갯수 : '+fishUser[s].bait+'개');
        return;
    }
    update(fishUser[s]);
    // (index*7+1)*baitPrice=미끼가격
    let gold=(baitArr.indexOf(fishUser[s].Bait)*7+1)*config.baitPrice*n;
    if(fishUser[s].gold<gold) replier.reply('@'+s+' \n• '+Div(gold-Number(fishUser[s].gold))+'골드가 부족해요.');
    else{
        fishUser[s].bait=Number(fishUser[s].bait)+n;
        fishUser[s].gold=Number(fishUser[s].gold)-gold;
        FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
        replier.reply('@'+s+' \n• '+Div(gold)+'골드로 미끼 '+n+'개를 구매했어요.\n• 남은금액 : '+Div(fishUser[s].gold)+'골드');
    }
    return;
}

/* 물고기판매 */
if(msg==fishcmd.sell){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    fishInv[s]=JSON.parse(FS.read(path+s+'/inv.json'));
    if(fishInv[s].fish.length==0){
        replier.reply('@'+s+' \n• 판매할 물고기가 없어요.');
        return;
    }
    update(fishUser[s]);
    let sell=0;  //판매가격 합계
    let n=fishInv[s].fish.length;
    let gold=Number(fishUser[s].gold);  //이전 보유금액
    for(let i=0; i<fishInv[s].fish.length; i++)
        sell+=Number(fishInv[s].fish[i].gold);
    fishUser[s].gold=gold+sell;
    fishInv[s].fish=[];
    FS.write(path+s+"/"+s+'.json', JSON.stringify(fishUser[s]));
    FS.write(path+s+'/inv.json', JSON.stringify(fishInv[s]));
    replier.reply('@'+s+' \n'+
        '• 물고기 '+n+'마리를 '+Div(sell)+'골드에 팔았어요.\n'+
        '• '+Div(gold)+'골드 ➡ '+Div(fishUser[s].gold)+'골드');
    return;
}

/* 물고기 잠금 */
if(msg.startsWith(fishcmd.lock+' ')){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    fishInv[s]=JSON.parse(FS.read(path+s+'/inv.json'));
    if(fishInv[s].lock.length==0 && fishInv[s].fish.length==0){
        replier.reply('@'+s+' \n• 낚시통에 물고기가 없어요.');
        return;
    }
    if(fishInv[s].lock.length>0 && fishInv[s].fish.length==0){
        replier.reply('@'+s+' \n• 모든 물고기가 잠겨있어요.');
        return;
    }
    let n=msg.split(' ')[1];
    if(n.includes('-')&&!isNaN(n.split('-')[0])&&!isNaN(n.split('-')[1])){
        let x=Number(n.split('-')[0]);
        let z=Number(n.split('-')[1]);
        let num=z-x;
        if(num<0 || x<1 || z<1){
            replier.reply('@'+s+' \n• 입력값이 1 미만이거나, 순서가 바뀌었어요.');
            return;
        }
        if(fishInv[s].fish.length<z){
            replier.reply('@'+s+' \n• 입력범위를 벗어났어요.');
            return;
        }
        let box=[];
        for(let i=0; i<num+1; i++){
            let a=fishInv[s].fish.splice((x-1),1);  //물고기 뽑아오기
            fishInv[s].lock.push(a[0]);
            box.push(a[0]);
        }
        FS.write(path+s+'/inv.json', JSON.stringify(fishInv[s]));
        replier.reply([
            '@'+s+' ',
            '• 아래 물고기들을 잠금완료 했어요.'+more,li,
            box.map(e=>'• '+e.name+'('+Div(e.size)+'Cm)').join('\n')
        ].join('\n'));
        return;
    }
    if(n==undefined || isNaN(n)){
        replier.reply('@'+s+' \n• "'+fishcmd.lock+' (숫자)" 형식으로 적어주세요.');
        return;
    }
    if(n<=0){
        replier.reply('@'+s+' \n• 숫자는 0보다 커야해요.');
        return;
    }
    if(n>fishInv[s].fish.length){
        replier.reply('@'+s+' \n• 선택범위를 벗어났어요.');
        return;
    }
    n=parseInt(n);
    let a=fishInv[s].fish.splice((Number(n)-1),1);  //물고기 뽑아오기
    fishInv[s].lock.push(a[0]);
    let lt=a[0].name.length-1;
    FS.write(path+s+'/inv.json', JSON.stringify(fishInv[s]));
    replier.reply('@'+s+' \n• '+a[0].name+'('+Div(a[0].size)+'Cm)'+
        (a[0].name[lt].normalize("NFD").length == 3 ? '을' : '를')+
        ' 잠금 완료했어요.');
    return;
}

/* 물고기 잠금해제 */
if(msg.startsWith(fishcmd.unlock+' ')){
    fishUser[s]=JSON.parse(FS.read(path+s+"/"+s+'.json'));
    if(fishUser[s]==null){
        replier.reply('@'+s+' \n• 낚시터 회원이 아니예요.\n• "'+fishcmd.join+'" 을 먼저 해주세요.');
        return;
    }
    fishInv[s]=JSON.parse(FS.read(path+s+'/inv.json'));
    if(fishInv[s].lock.length==0 && fishInv[s].fish.length==0){
        replier.reply('@'+s+' \n• 낚시통에 물고기가 없어요.');
        return;
    }
    if(fishInv[s].lock.length==0 && fishInv[s].fish.length>0){
        replier.reply('@'+s+' \n• 잠겨있는 물고기가 없어요.');
        return;
    }
    let n=msg.split(' ')[1];
    if(n.includes('-')&&!isNaN(n.split('-')[0])&&!isNaN(n.split('-')[1])){
        let x=Number(n.split('-')[0]);
        let z=Number(n.split('-')[1]);
        let num=z-x;
        if(num<0 || x<1 || z<1){
            replier.reply('@'+s+' \n• 입력값이 1 미만이거나, 순서가 바뀌었어요.');
            return;
        }
        if(fishInv[s].lock.length<z){
            replier.reply('@'+s+' \n• 입력범위를 벗어났어요.');
            return;
        }
        let box=[];
        for(let i=0; i<num+1; i++){
            let a=fishInv[s].lock.splice((x-1),1);  //물고기 뽑아오기
            fishInv[s].fish.push(a[0]);
            box.push(a[0]);
        }
        FS.write(path+s+'/inv.json', JSON.stringify(fishInv[s]));
        replier.reply([
            '@'+s+' ',
            '• 아래 물고기들을 잠금해제 했어요.'+more,li,
            box.map(e=>'• '+e.name+'('+Div(e.size)+'Cm)').join('\n')
        ].join('\n'));
        return;
    }
    if(n==undefined || isNaN(n)){
        replier.reply('@'+s+' \n• "'+fishcmd.unlock+' (숫자)" 형식으로 적어주세요.');
        return;
    }
    if(n<=0){
        replier.reply('@'+s+' \n• 숫자는 0보다 커야해요.');
        return;
    }
    if(n>fishInv[s].lock.length){
        replier.reply('@'+s+' \n• 선택범위를 벗어났어요.');
        return;
    }
    n=parseInt(n);
    let a=fishInv[s].lock.splice((Number(n)-1),1);  //물고기 뽑아오기
    fishInv[s].fish.push(a[0]);
    let lt=a[0].name.length-1;
    FS.write(path+s+'/inv.json', JSON.stringify(fishInv[s]));
    replier.reply('@'+s+' \n• '+a[0].name+'('+Div(a[0].size)+'Cm)'+
        (a[0].name[lt].normalize("NFD").length == 3 ? '을' : '를')+
        ' 잠금 해제 했어요.');
    return;
}

}