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

//let List = [];

//function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    /*
    if(msg.trim()){
        let i = List.findIndex(function(n){
            return n.Name === sender;
        });

        if(i !== -1){
            List[i].Count++
        }

        else{
            List.push({'Name' : sender, 'Count' : 1});
        }

        List = List.sort((a, b) => b.Count - a.Count);
    
    }

    if(msg === '채팅순위'){

        let res = '';

        for(i in List){

            res += '[' + rank(i + 1) + ']' + List[i].Name + ' : ' + List[i].Count + '\n\n';

        }

        replier.reply('전체 채팅순위' + '\u200b'.repeat(500) + List.join('\n\n'));

    }
    function rank(num){
        switch(num){
          case 1:
          return '🥇';
          case 2:
          return '🥈';
          case 3: 
          return '🥉';
        }
        return num + '위';
      }
*/

const Path = '/sdcard/출석데이터.json';

const FS = FileStream;

if(!FS.read(Path)) FS.write(Path, JSON.stringify([], null, 4));

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){

    let Today = String(new Date().getFullYear()) + '/' + String(new Date().getMonth()) + '/' + String(new Date().getDate());
    
    let Time = String(new Date().getHours()) + '시 ' + String(new Date().getMinutes()) + '분 ' + String(new Date().getSeconds());

    let list = JSON.parse(FS.read(Path));

    if(msg === '출석'){

        if(list.find(n => n.Day === Today && n.Room === room && n.Name === sender)){

            replier.reply('이미 출석하셨습니다.');

            return;

        }

        list.push({'Name' : sender, 'Day' : Today, 'Room' : room, 'More' : Time});

        FS.write(Path, JSON.stringify(list, null, 4));
        
        let i = list.filter(n => n.Day === Today && n.Room === room).findIndex(n => n.Name === sender);
        
        replier.reply('[' + sender + '] 님께서 ' + (i + 1) + '번째로 출석하셨습니다.');

    }

    if(msg === '출석목록'){

        let locate = list.some(function(n){

            return n.Room === room;

          });

        if(!locate){ replier.reply('출석한 사용자가 없습니다.'); return; }

        let res = '[' + room + ']출석목록' + '\u200b'.repeat(500) + '\n\n';
        
        let count = 0;

        for(n in list){

            if(list[n].Room === room && list[n].Day === Today){

                count++

                res += '[' + rank(count) + '] ' + list[n].Name + ' (' + list[n].More + ')' + '\n\n';

            }

        }

        replier.reply(res);

    }

    function rank(num){

        switch(num){

          case 1 :

          return '🥇';

          case 2 :

          return '🥈';

          case 3 : 

          return '🥉';

        }

        return num + '위';

    }






}