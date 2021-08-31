var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        richText: cc.RichText
    },

    initChatInfo(data){
        this.data = data;

        let info = this.data.data;


        if(this.data.isFromDesk){
            this.richText.string = '<color=#068ea2>系统提示:'+info.chat+'</color>  ' + '<color=#f05d1d click=\'jumpHandler\'><u>立即加入</u></color>';
        }else{
            let list = info.chat.split('#');

            let color = '#83592e';
            if(info.sendId == cc.dd.user.id){
                color = '#a54f2f'
            }

            let name = info.sendName;
            let len = cc.dd.Utils.getRealLen(name)
            // cc.error(len % 34)
            if(len % 34 > 24){
                name += ':\n';
            }else{
                name += ':'
            }

            let str = '<color='+color+'>'+name + list[0]+'</color>';

            for(let i = 1; i < list.length; i++){
                let emoji_str = this.getAnima(list[i].substring(0, 1));
                str += '<img src=\'E0'+emoji_str+'\' />'

                str += '<color='+color+'>'+list[i].substring(1)+'</color>';
            }

            this.richText.string = str;
        }
        return this.richText.node.height;
    },

    jumpHandler(){
        cc.back_to_club = clubMgr.getSelectClubId();
        cc.sys.localStorage.setItem('club_game_wafanum', clubMgr.getLastRoomID());
        let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
        msg.setRoomId(this.data.data.roomId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req',true);
    },

    getAnima(emoji_str){
        switch(emoji_str){
            case '1':
                return '01';//0;
            case '2':
                return '02';//1;
            case '3':
                return '03';//2;
            case '4':
                return '04';//3;
            case '5':
                return '05';//4;
            case '6':
                return '06';//5;
            case '7':
                return '07';//6;
            case '8':
                return '08';//7;
            case '9':
                return '09';//8;
            case 'a':
                return '10';//9;
            case 'b':
                return '11';//10;
            case 'c':
                return '12';//11;
            case 'd':
                return '13';//12;
            case 'e':
                return '14';//13;
            case 'f':
                return '15';//14;
            case 'g':
                return '16';//15;
            case 'h':
                return '17';//16;
            case 'i':
                return '18';//17;
            case 'j':
                return '19';//18;
            case 'k':
                return '20';//19;
            case 'l':
                return '21';//20;
            case 'm':
                return '22';//21;
            case 'n':
                return '23';//22;
            case 'o':
                return '24';//23;
            case 'p':
                return '25';//24;
            case 'q':
                return '26';//25;
            case 'r':
                return '27';//26;
            default:
                return null;
        }
    }
});
