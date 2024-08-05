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
dvtBundle("android.wearable.EXTENSIONS");
      if (image != null) image = image.getParcelable("background");
      var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
      com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
      if (this.hasOwnProperty("responseFix")) {
        responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
      }
    }
}
const FS = FileStream;
const Path = '/sdcard/chatrank/';
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    if(!FS.read(Path + room + '.json')) FS.write(Path + room + '.json', JSON.stringify([], null, 4));
    let List = JSON.parse(FS.read(Path + room + '.json'));    
    if(msg.trim()){
        let index = List.findIndex((n) => n.Name === sender);
        if(index !== -1){
            List[index].Count++;
        }
        else{
            List.push({'Name' : sender, 'Count' : 1});
        }
        List.sort((a,b) => b.Count - a.Count);
        FS.write(Path + room + '.json', JSON.stringify(List, null, 4));
    }
    if(msg === '채팅순위'){
        let result = '[' + room + '방 채팅 순위]' + '\u200b'.repeat(500) + '\n\n';
        for(i in List){
            result += (i + 1) + '위 ' + List[i].Name + ' (채팅횟수 ' + List[i].Count + ')\n';
        }
        replier.reply(result);
    }
}