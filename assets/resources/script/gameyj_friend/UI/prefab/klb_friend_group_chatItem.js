cc.Class({
    extends: cc.Component,

    properties:{
        labelList:{
            default: [],
        },

        emojiList:{
            default: [],
        },
    },

    onLoad(){
    },

    bindFunc(createLabelFunc, createEmojiFunc, removeLabelFunc, removeEmojiFunc){
        this._createLabelFunc = createLabelFunc;
        this._createEmojiFunc = createEmojiFunc;
        this._removeLabelFunc = removeLabelFunc;
        this._removeEmojiFunc = removeEmojiFunc;
    },

    createLabel(){
        let label = null;
        if(this._createLabelFunc){
            label = this._createLabelFunc()
        }

        if(label){
            this.labelList.push(label);
        }

        return label;
    },

    createEmoji(){
        let emoji = null;
        if (this._createEmojiFunc) {
            emoji = this._createEmojiFunc()
        }

        if(emoji){
            this.emojiList.push(emoji);
        }
        return emoji;
    },

    removLabel(label){
        if(this._removeLabelFunc){
            this._removeLabelFunc(label);
        }
    },

    removeEmoji(emoji){
        if(this._removeEmojiFunc){
            this._removeEmojiFunc(emoji);
        }
    },

    initChatInfo(data){
        this.data = data;

        let info = this.data.data;

        for(let i = this.labelList.length - 1; i >= 0; i--){
            this.removLabel(this.labelList[i]);
            this.labelList.pop();
        }
        this.labelList = [];
        for(let i = this.emojiList.length - 1; i >= 0; i--){
            this.removeEmoji(this.emojiList[i]);
            this.emojiList.pop();
        }
        this.emojiList = [];

        if(this.data.isFromDesk){
            let label = this.createLabel();
            label.getComponent(cc.RichText).string = '<color=#068ea2>系统提示:'+info.chat+'</color>' + '<color=#f05d1d><u> 立即加入</u></color>';
            this.node.addChild(label);
        }else{
            let list = info.chat.split('#');

            let label = this.createLabel();
            let color = '#83592e';
            if(info.sendId == cc.dd.user.id){
                color = '#a54f2f'
            }
            label.getComponent(cc.RichText).string = '<color='+color+'>'+info.sendName + ':' + list[0]+'</color>';
            this.node.addChild(label);

            for(let i = 1; i < list.length; i++){
                let emoji_str = this.getAnima(list[i].substring(0, 1));
                if(cc.dd._.isNull(emoji_str)){
                    let label = this.createLabel();
                    label.getComponent(cc.RichText).string = '<color='+color+'>'+'#'+emoji_str+'</color>';
                    this.node.addChild(label);
                }else{
                    let emoji = this.createEmoji();
                    let anim = emoji.getComponent(cc.Animation);
                    let state = anim.play("em"+emoji_str);
                    state.wrapMode = cc.WrapMode.Loop;
                    state.repeatCount = Infinity;
                    this.node.addChild(emoji);
                }


                let str = list[i].substring(1);
                if(cc.dd._.isString(str) && str.length > 0){
                    let label = this.createLabel();
                    label.getComponent(cc.RichText).string = '<color='+color+'>'+str+'</color>';
                    this.node.addChild(label);
                }
            }

        }
    },

    getAnima(emoji_str){
      switch(emoji_str){
          case '1':
              return 0;
          case '2':
              return 1;
          case '3':
              return 2;
          case '4':
              return 3;
          case '5':
              return 4;
          case '6':
              return 5;
          case '7':
              return 6;
          case '8':
              return 7;
          case '9':
              return 8;
          case 'a':
              return 9;
          case 'b':
              return 10;
          case 'c':
              return 11;
          case 'd':
              return 12;
          case 'e':
              return 13;
          case 'f':
              return 14;
          case 'g':
              return 15;
          case 'h':
              return 16;
          case 'i':
              return 17;
          case 'j':
              return 18;
          case 'k':
              return 19;
          case 'l':
              return 20;
          case 'm':
              return 21;
          case 'n':
              return 22;
          case 'o':
              return 23;
          case 'p':
              return 24;
          case 'q':
              return 25;
          case 'r':
              return 26;
          default:
              return null;
      }
    }
});
