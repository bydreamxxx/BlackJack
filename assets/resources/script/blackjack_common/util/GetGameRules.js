const Define = require("Define");
var Text = cc.dd.Text;

let rule = {
    //获取各个游戏规则字符串
    getRuleStr(gameid, rule) {
        //记得在getPlayerNum和getJuShu添加响应的实现
        var str = [];
        switch (gameid) {
            case Define.GameType.JLMJ_FRIEND: //吉林麻将
            case Define.GameType.CCMJ_FRIEND:
            case Define.GameType.NAMJ_FRIEND:
            case Define.GameType.FXMJ_FRIEND:
            case Define.GameType.SYMJ_FRIEND:
            case Define.GameType.SYMJ_FRIEND_2:
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_FRIEND:
            case Define.GameType.SHMJ_FRIEND:
            case Define.GameType.JZMJ_FRIEND:
            case Define.GameType.HSMJ_FRIEND:
            case Define.GameType.TDHMJ_FRIEND:
            case Define.GameType.CFMJ_FRIEND:
            case Define.GameType.AHMJ_FRIEND:
            case Define.GameType.FZMJ_FRIEND:
            case Define.GameType.WDMJ_FRIEND:
            case Define.GameType.PZMJ_FRIEND:
            case Define.GameType.BCMJ_FRIEND:
            case Define.GameType.ACMJ_FRIEND:
            case Define.GameType.HLMJ_FRIEND:
                str = this._getMjRuleString(rule, gameid);
                break;
            case Define.GameType.DDZ_FRIEND: //斗地主
                str = this._getDDZRuleString(rule)
                break;
            case Define.GameType.DDZ_XYPYC:
                str = this._getXYDDZRuleString(rule);
                break;
            case Define.GameType.NN_FRIEND: //港式五张
                str = this._getNNRuleString(rule);
                break;
            case Define.GameType.SH_FRIEND: //港式五张
                str = this._getSHRuleInfo(rule);
                break;
            case Define.GameType.HBSL_JBL: //红包扫雷
                str = this._getHBSLRuleString(rule);
                break;
            case Define.GameType.TDK_FRIEND: //填大坑
            case Define.GameType.TDK_FRIEND_LIU:
                str = this._getTDKRuleString(rule);
                break;
            case Define.GameType.PAOYAO_FRIEND: //刨幺
                str = this._getPaoyaString(rule);
                break;
            case Define.GameType.NEW_DSZ_FRIEND: //斗三张
                str = this._getNewDszString(rule);
                break;
        }
        str = str.filter(function (s) {
            return s && s.trim(); // 注意：IE9以下的版本没有trim()方法
        });
        return str;
    },

    _getMjRuleString(Rule, gameType) {
        var txt_arr = [];

        switch (gameType) {
            case Define.GameType.JLMJ_FRIEND: //吉林麻将
                if(!Rule.reservedList || Rule.reservedList.length == 0){
                    switch(Rule.guangguotype){
                        case 0:
                            Rule.fengding = 16;
                            break;
                        case 1:
                        case 3:
                            Rule.fengding = 32;
                            break;
                        case 2:
                        case 4:
                            Rule.fengding = 64;
                            break;
                    }
                }else{
                    Rule.fengding = parseInt(Rule.reservedList[0]);
                }

                var RoomMgr = require("jlmj_room_mgr").RoomMgr.Instance();
                var guaguo = RoomMgr.getCoinByGuangGuo(Rule.guangguotype);
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_1.format([Rule.usercountlimit]));
                var juquan_txt = Rule.usercountlimit == 2 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(guaguo ? guaguo + Text.TEXT_PY_RULE_3 : Text.TEXT_PY_RULE_2);//锅底
                txt_arr.push(Text.TEXT_PY_RULE_4.format([Rule.fengding]));
                txt_arr.push(Rule.isuseyaojiu ? Text.TEXT_PY_RULE_5 : '');
                txt_arr.push(Rule.isxiaojifeidan ? Text.TEXT_PY_RULE_6 : '');
                txt_arr.push(Rule.iskuaibao ? Text.TEXT_PY_RULE_7 : '');
                txt_arr.push(Rule.isxiaojiwanneng ? Text.TEXT_PY_RULE_8 : '');
                txt_arr.push(Rule.isyaojiusanse ? Text.TEXT_PY_RULE_9 : '');
                break;
            case Define.GameType.CCMJ_FRIEND:
                Rule.ismingdanzhanli = Rule.reservedList[0] === 'true';
                Rule.islixiantuoguan = Rule.reservedList[1] === 'true' ? '45' : Rule.reservedList[1];

                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_20.format([Rule.usercountlimit]));
                var juquan_txt = Rule.usercountlimit == 2 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.isxiadanzhanli ? Text.TEXT_PY_RULE_14 : '');
                txt_arr.push(Rule.isxiaojifeidan ? Text.TEXT_PY_RULE_6 : '');
                txt_arr.push(Rule.issifenggang ? Text.TEXT_PY_RULE_18 : Text.TEXT_PY_RULE_17);
                txt_arr.push(Rule.isquemen ? Text.TEXT_PY_RULE_15 : '');
                txt_arr.push(Rule.istongbaofanfan ? Text.TEXT_PY_RULE_16 : '');
                txt_arr.push(Rule.isbujiabuhu ? Text.TEXT_PY_RULE_87 : '');
                txt_arr.push(Rule.pqsanse ? Text.TEXT_PY_RULE_19 : '');
                txt_arr.push(Rule.ishaoqifanbei ? Text.TEXT_PY_RULE_107 : '');
                txt_arr.push(Rule.isdianpaosanjia ? Text.TEXT_PY_RULE_108 : '');
                txt_arr.push(Rule.ismingdanzhanli ? Text.TEXT_PY_RULE_161 : '');
                txt_arr.push(Rule.islixiantuoguan !== '0' ? Text.TEXT_PY_RULE_162.format([Rule.islixiantuoguan]) : Text.TEXT_PY_RULE_163);
                break;
            case Define.GameType.NAMJ_FRIEND:
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_25.format([Rule.usercountlimit]));
                var juquan_txt = Rule.usercountlimit == 2 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.isqiduidaigu ? Text.TEXT_PY_RULE_21 : '');
                txt_arr.push(Rule.istongbaofanfan ? Text.TEXT_PY_RULE_16 : '');
                txt_arr.push(Rule.ispiaohudandiaofanfan ? Text.TEXT_PY_RULE_22 : '');
                txt_arr.push(Rule.isqiduiyaojiu ? Text.TEXT_PY_RULE_23 : '');
                txt_arr.push(Rule.isdianpaosanjia ? Text.TEXT_PY_RULE_24 : '');
                txt_arr.push(Rule.isuseyaojiu ? Text.TEXT_PY_RULE_5 : '');
                txt_arr.push(Rule.ismenqingfanbei ? Text.TEXT_PY_RULE_109 : '');
                break;
            case Define.GameType.FXMJ_FRIEND:
                var zf_txt = [Text.TEXT_PY_RULE_34, Text.TEXT_PY_RULE_35, Text.TEXT_PY_RULE_36];
                var gzf_txt = [Text.TEXT_PY_RULE_32, Text.TEXT_PY_RULE_37, Text.TEXT_PY_RULE_38];
                var gf_txt = [Text.TEXT_PY_RULE_40, Text.TEXT_PY_RULE_41];
                var fengding = [100, 200, 500];
                var fengding_txt = fengding[Rule.fengdingindex - 1];
                var jifentype = gf_txt[Rule.jifentypeindex - 1];

                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_33.format([Rule.usercountlimit]));
                var juquan_txt = Rule.usercountlimit == 2 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_39.format([fengding_txt]));
                txt_arr.push(jifentype);
                txt_arr.push(Rule.isjiehu ? Text.TEXT_PY_RULE_26 : '');
                txt_arr.push(Rule.isqidui ? Text.TEXT_PY_RULE_27 : '');
                txt_arr.push(Rule.issijia ? Text.TEXT_PY_RULE_42 : '');
                txt_arr.push(Rule.isgunjsj ? Text.TEXT_PY_RULE_28 : '');
                txt_arr.push(Rule.isqinyise ? Text.TEXT_PY_RULE_29 : '');
                txt_arr.push(Rule.isshoubayijiafan ? Text.TEXT_PY_RULE_30 : '');
                txt_arr.push(Rule.ischiting ? Text.TEXT_PY_RULE_31 : '');
                txt_arr.push(Rule.isshuipao ? Text.TEXT_PY_RULE_110 : '');
                txt_arr.push(Rule.genzysindex ? gzf_txt[Rule.genzysindex] : '');
                txt_arr.push(zf_txt[Rule.zha5or10]);
                break;
            case Define.GameType.SYMJ_FRIEND:
            case Define.GameType.SYMJ_FRIEND_2:
                var cc_txt = Rule.symjtype == 1 ? Text.TEXT_PY_RULE_45 : Text.TEXT_PY_RULE_44;
                txt_arr.push(cc_txt.format([Rule.usercountlimit]));
                var juquan_txt = Rule.usercountlimit == 2 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.is37jia ? Text.TEXT_PY_RULE_46 : '');
                txt_arr.push(Rule.issiqing ? Text.TEXT_PY_RULE_47 : '');
                txt_arr.push(Rule.iskuaibao ? Text.TEXT_PY_RULE_48 : '');
                txt_arr.push(Rule.iskandb ? Text.TEXT_PY_RULE_49 : '');
                txt_arr.push(Rule.isganghua ? Text.TEXT_PY_RULE_50 : '');
                txt_arr.push(Rule.istongbaofb ? Text.TEXT_PY_RULE_51 : '');
                txt_arr.push(Rule.isbujiabuhu ? Text.TEXT_PY_RULE_52 : '');
                txt_arr.push(Rule.iszhanlihu ? Text.TEXT_PY_RULE_71 : '');
                txt_arr.push(Rule.ispiaohuduan19 ? Text.TEXT_PY_RULE_72 : '');
                txt_arr.push(Rule.isqinyise ? Text.TEXT_PY_RULE_29 : '');
                txt_arr.push(Rule.isbutingdpbsj ? Text.TEXT_PY_RULE_53 : '');
                break;
            case Define.GameType.XZMJ_FRIEND:
                Rule.issanfang = Rule.reservedList[0] === 'true';
                Rule.isdiangangzimo = Rule.reservedList[1] === 'true';
                Rule.hujiaozhuanyizhuangen = Rule.reservedList[2] === 'true';
                Rule.duiduihu3fan = Rule.reservedList[3] === 'true';
                Rule.huan4zhang = Rule.reservedList[4] === 'true';
                Rule.jiaxinwu = Rule.reservedList[5] === 'true';
                Rule.yitiaolong = Rule.reservedList[6] === 'true';
            case Define.GameType.XLMJ_FRIEND:
                var _text = !Rule.isxueliu ? Text.TEXT_PY_RULE_69 : Text.TEXT_PY_RULE_70;
                txt_arr.push(_text.format([Rule.usercountlimit]));
                var juquan_txt = Text.TEXT_PY_RULE_10;
                var _text16 = Rule.isdiangangzimo ? Text.TEXT_PY_RULE_147 : Text.TEXT_PY_RULE_148;
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                var _text15 = '';
                if(!Rule.isxueliu){
                    if(Rule.usercountlimit == 3){
                        _text15 = Rule.issanfang ? Text.TEXT_PY_RULE_143 : Text.TEXT_PY_RULE_144
                        txt_arr.push(_text15);
                    }else if(Rule.usercountlimit == 2){
                        _text15 = Rule.issanfang ? Text.TEXT_PY_RULE_145 : Text.TEXT_PY_RULE_146
                        txt_arr.push(_text15);
                    }
                }
                txt_arr.push(Text.TEXT_PY_RULE_56.format([Rule.difen]));
                txt_arr.push(Rule.fengding == 0 ? Text.TEXT_PY_RULE_54 : Text.TEXT_PY_RULE_55.format([Rule.fengding]));
                txt_arr.push(Rule.zimotype == 0 ? Text.TEXT_PY_RULE_57 : Text.TEXT_PY_RULE_58);
                txt_arr.push(Rule.isshishiyu ? Text.TEXT_PY_RULE_59 : Text.TEXT_PY_RULE_60);
                txt_arr.push(!Rule.isxueliu ? _text16 : '');
                txt_arr.push(Rule.ishuan3zhang ? Text.TEXT_PY_RULE_61 : '');
                txt_arr.push(Rule.huan4zhang && !Rule.isxueliu ? Text.TEXT_PY_RULE_151 : '');
                txt_arr.push(Rule.ishujiaozhuanyi ? Text.TEXT_PY_RULE_62 : '');
                txt_arr.push(Rule.hujiaozhuanyizhuangen && !Rule.isxueliu ? Text.TEXT_PY_RULE_149 : '');
                txt_arr.push(Rule.isjingoudiao ? Text.TEXT_PY_RULE_63 : '');
                txt_arr.push(Rule.ishaidilao ? Text.TEXT_PY_RULE_64 : '');
                txt_arr.push(Rule.ishaidipao ? Text.TEXT_PY_RULE_65 : '');
                txt_arr.push(Rule.istiandihu ? Text.TEXT_PY_RULE_66 : '');
                txt_arr.push(Rule.ismenqingzz ? Text.TEXT_PY_RULE_67 : '');
                txt_arr.push(Rule.isxueliu ? Text.TEXT_PY_RULE_68 : '');
                txt_arr.push(Rule.is2fanqibu && !Rule.isxueliu ? Text.TEXT_PY_RULE_111 : '');
                txt_arr.push(Rule.duiduihu3fan && !Rule.isxueliu ? Text.TEXT_PY_RULE_150 : '');
                txt_arr.push(Rule.jiaxinwu && !Rule.isxueliu ? Text.TEXT_PY_RULE_152 : '');
                txt_arr.push(Rule.yitiaolong && !Rule.isxueliu ? Text.TEXT_PY_RULE_115 : '');
                break;
            case Define.GameType.SHMJ_FRIEND:
                Rule.isqingyise = Rule.reservedList[0] === 'true';
                Rule.ishaoqi = Rule.reservedList[1] === 'true';
                Rule.isqiduifeng = Rule.reservedList[2] === 'true';
                Rule.meting = Rule.reservedList[3] === 'true';

                var fengdingTxt = [Text.TEXT_PY_RULE_54, Text.TEXT_PY_RULE_39.format('64'), Text.TEXT_PY_RULE_39.format('128'), Text.TEXT_PY_RULE_39.format('256')]

                var juquan_txt = Rule.usercountlimit != 4 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                txt_arr.push(Text.TEXT_PY_RULE_73.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(fengdingTxt[Rule.fengdingtype]);
                // txt_arr.push(Rule.isbujiabuhu ? Text.TEXT_PY_RULE_52 : '');
                txt_arr.push(Rule.isduidaosuanjia ? Text.TEXT_PY_RULE_74 : '');
                txt_arr.push(Rule.is3or7jia ? Text.TEXT_PY_RULE_75 : '');
                // txt_arr.push(Rule.ishongzhongfei ? Text.TEXT_PY_RULE_76 : '');
                txt_arr.push(Rule.isloubao ? Text.TEXT_PY_RULE_77 : '');
                txt_arr.push(Rule.isshanggunbao ? Text.TEXT_PY_RULE_83 : '');
                // txt_arr.push(Rule.isanbao ? Text.TEXT_PY_RULE_85 : Text.TEXT_PY_RULE_86);
                txt_arr.push(Rule.iskaizhapai ? Text.TEXT_PY_RULE_78 : '');
                txt_arr.push(Rule.isgangjiafan ? Text.TEXT_PY_RULE_79 : '');
                txt_arr.push(Rule.isduan19 ? Text.TEXT_PY_RULE_84 : '');
                txt_arr.push(Rule.isliangzhangbao ? Text.TEXT_PY_RULE_80 : '');
                txt_arr.push(Rule.isqidui ? Text.TEXT_PY_RULE_27 : '');
                txt_arr.push(Rule.isguadafeng ? Text.TEXT_PY_RULE_81 : '');
                txt_arr.push(Rule.ismoyu ? Text.TEXT_PY_RULE_82 : '');
                txt_arr.push(Rule.ismenting ? Text.TEXT_PY_RULE_88 : '');
                txt_arr.push(Rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
                txt_arr.push(Rule.ishaoqi ? Text.TEXT_PY_RULE_169 : '');
                txt_arr.push(Rule.isqiduifeng ? Text.TEXT_PY_RULE_170 : '');
                txt_arr.push(Rule.meting ? Text.TEXT_PY_RULE_171 : '');
                break;
            case Define.GameType.JZMJ_FRIEND:
                var juquan_txt = Rule.usercountlimit != 4 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                var fd = [0, 100, 200, 300, 150];
                txt_arr.push(Text.TEXT_PY_RULE_89.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_39.format([fd[Rule.fengdingtype]]));
                txt_arr.push(Rule.isdaihun ? Text.TEXT_PY_RULE_90 : '');
                // txt_arr.push(Rule.isqionghujiafan ? Text.TEXT_PY_RULE_91 : '');
                txt_arr.push(Rule.isqidui ? Text.TEXT_PY_RULE_27 : '');
                txt_arr.push(Rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
                txt_arr.push(Rule.is3qing ? Text.TEXT_PY_RULE_92 : '');
                txt_arr.push(Rule.is4qing ? Text.TEXT_PY_RULE_93 : '');
                txt_arr.push(Rule.isjiehu ? Text.TEXT_PY_RULE_127 : '');
                break;
            case Define.GameType.HSMJ_FRIEND:
                var juquan_txt = Rule.usercountlimit != 4 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                var gangfen = [Text.TEXT_PY_RULE_95, Text.TEXT_PY_RULE_96];
                var fengding = [Text.TEXT_PY_RULE_54, Text.TEXT_PY_RULE_97, Text.TEXT_PY_RULE_98, Text.TEXT_PY_RULE_99, Text.TEXT_PY_RULE_100]

                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_94.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(gangfen[Rule.gangfentype]);
                txt_arr.push(fengding[Rule.fengdingtype]);
                txt_arr.push(Rule.isjihujiafan ? Text.TEXT_PY_RULE_101 : '');
                txt_arr.push(Rule.ishaidilao ? Text.TEXT_PY_RULE_64 : '');
                txt_arr.push(Rule.isguoquanhu ? Text.TEXT_PY_RULE_102 : '');
                txt_arr.push(Rule.ishavednxb ? Text.TEXT_PY_RULE_103 : '');
                txt_arr.push(Rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
                txt_arr.push(Rule.isdandiaojiahu ? Text.TEXT_PY_RULE_104 : '');
                txt_arr.push(Rule.isdumenjiafan ? Text.TEXT_PY_RULE_105 : '');
                txt_arr.push(Rule.isqidui ? Text.TEXT_PY_RULE_27 : '');
                txt_arr.push(Rule.isdanhu19jiahu ? Text.TEXT_PY_RULE_106 : '');
                break;
            case Define.GameType.TDHMJ_FRIEND:
                var juquan_txt = Rule.usercountlimit != 4 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_112.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.ispiaohu ? Text.TEXT_PY_RULE_113 : '');
                txt_arr.push(Rule.isliangxi ? Text.TEXT_PY_RULE_114 : '');
                txt_arr.push(Rule.isqidui ? Text.TEXT_PY_RULE_27 : '');
                txt_arr.push(Rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
                txt_arr.push(Rule.isyitiaolong ? Text.TEXT_PY_RULE_115 : '');
                txt_arr.push(Rule.isyipaoduoxiang ? Text.TEXT_PY_RULE_116 : '');
                txt_arr.push(Rule.iscanchi ? Text.TEXT_PY_RULE_117 : '');
                txt_arr.push(Rule.ispaofen ? Text.TEXT_PY_RULE_118 : '');
                txt_arr.push(!Rule.islianzhuang ? Text.TEXT_PY_RULE_119 : '');
                break;
            case Define.GameType.CFMJ_FRIEND:
                var juquan_txt = Rule.mode == 0 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_120.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.is37jia ? Text.TEXT_PY_RULE_121 : '');
                txt_arr.push(Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(Rule.paofen) : (Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123));
                break;
            case Define.GameType.AHMJ_FRIEND:
                var juquan_txt = Rule.mode == 0 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_125.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.is37jia ? Text.TEXT_PY_RULE_121 : '');
                txt_arr.push(Rule.isdandiaojiahu ? Text.TEXT_PY_RULE_126 : '');
                txt_arr.push(Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(Rule.paofen) : (Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123));
                break;
            case Define.GameType.FZMJ_FRIEND:
                Rule.isnormalxi = Rule.reservedList[0] === 'true';
                Rule.notong = Rule.reservedList[1] === 'true';
                Rule.isliangxikaimen = Rule.reservedList[2] === 'true';

                var juquan_txt = Text.TEXT_PY_RULE_10;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_136.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.fengdingtype == 0 ? Text.TEXT_PY_RULE_54 : Text.TEXT_PY_RULE_55.format([Rule.fengdingtype + 2]));
                txt_arr.push(Rule.isnormalxi ? Text.TEXT_PY_RULE_132 : Text.TEXT_PY_RULE_133);

                txt_arr.push(Rule.ismultliangxi ? Text.TEXT_PY_RULE_128 : '');
                txt_arr.push(Rule.isheipao3jia ? Text.TEXT_PY_RULE_129 : '');
                txt_arr.push(Rule.issdxtianhu ? Text.TEXT_PY_RULE_130 : '');
                txt_arr.push(Rule.isliangzhang ? Text.TEXT_PY_RULE_137 : '');
                txt_arr.push(Rule.notong ? Text.TEXT_PY_RULE_131 : '');
                txt_arr.push(Rule.isliangxikaimen ? Text.TEXT_PY_RULE_140 : '');
                break;
            case Define.GameType.WDMJ_FRIEND:
                var juquan_txt = Rule.mode == 0 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_141.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.is37jia ? Text.TEXT_PY_RULE_121 : '');
                txt_arr.push(Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(Rule.paofen) : (Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123));
                break;
            case Define.GameType.PZMJ_FRIEND:
                var juquan_txt = Rule.mode == 0 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_153.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.is37jia ? Text.TEXT_PY_RULE_121 : '');
                txt_arr.push(Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(Rule.paofen) : (Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123));
                break;
            case Define.GameType.BCMJ_FRIEND:
                Rule.iszangang = Rule.reservedList[0] === 'true';
                Rule.isgangjiafan = Rule.reservedList[1] === 'true';
                Rule.isxiaojifeidan = Rule.reservedList[2] === 'true';
                var _fengding = parseInt(Rule.reservedList[3]);
                Rule.fengding = cc.dd._.isNumber(_fengding) && !isNaN(_fengding) ? _fengding : 1;

                var juquan_txt = Text.TEXT_PY_RULE_11;
                var fengdingType = [Text.TEXT_PY_RULE_54, Text.TEXT_PY_RULE_39.format(128), Text.TEXT_PY_RULE_39.format(256)];
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_155.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(fengdingType[Rule.fengding]);
                txt_arr.push(Rule.isjia5 ? Text.TEXT_PY_RULE_156 : '');
                txt_arr.push(Rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
                txt_arr.push(Rule.isjihujipiao ? Text.TEXT_PY_RULE_157 : '');
                txt_arr.push(Rule.iszangang ? Text.TEXT_PY_RULE_158 : '');
                txt_arr.push(Rule.isshoubayi ? Text.TEXT_PY_RULE_30 : '');
                txt_arr.push(Rule.isbeikaobei ? Text.TEXT_PY_RULE_159 : '');
                txt_arr.push(Rule.iszerenzhi ? Text.TEXT_PY_RULE_160 : '');
                txt_arr.push(Rule.isgangjiafan ? Text.TEXT_PY_RULE_79 : '');
                txt_arr.push(Rule.isxiaojifeidan ? Text.TEXT_PY_RULE_6 : '');
                break;
            case Define.GameType.ACMJ_FRIEND:
                Rule.ishongzhongmaitianfei = Rule.reservedList[0] === 'true';
                Rule.isguadafeng = Rule.reservedList[1] === 'true';
                Rule.isduibao = Rule.reservedList[2] === 'true';
                Rule.iskaipaizha = Rule.reservedList[3] === 'true';

                var juquan_txt = Rule.usercountlimit != 2 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_164.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                txt_arr.push(Rule.ishongzhongmaitianfei ? Text.TEXT_PY_RULE_76 : '');
                txt_arr.push(Rule.isguadafeng ? Text.TEXT_PY_RULE_81 : '');
                txt_arr.push(Rule.isduibao ? Text.TEXT_PY_RULE_165 : '');
                txt_arr.push(Rule.iskaipaizha ? Text.TEXT_PY_RULE_78 : '');
                break;
            case Define.GameType.HLMJ_FRIEND:
                var juquan_txt = Text.TEXT_PY_RULE_10;
                txt_arr.push(cc.dd.Text.TEXT_PY_RULE_166.format([Rule.usercountlimit]));
                txt_arr.push(juquan_txt.format([Rule.boardscout]));
                // txt_arr.push(Rule.feigangafterting ? Text.TEXT_PY_RULE_167 : '');
                txt_arr.push(Rule.yipaoduoxiang ? Text.TEXT_PY_RULE_116 : '');
                // txt_arr.push(Rule.pihu ? Text.TEXT_PY_RULE_168 : '');
                txt_arr.push(Rule.haidilao ? Text.TEXT_PY_RULE_64 : '');
                break;
        }

        // var idx = 1;
        // var str = '';
        // for (var id in txt_arr) {
        //     var txt = txt_arr[id];
        //     if (txt.length) {
        //         str = str + txt + ' ';
        //     }
        // }
        return txt_arr;
    },

    //红包扫雷
    _getHBSLRuleString(Rule) {
        var str = [];
        if (!Rule) return str;
        switch (Rule.zhuangType) {
            case 1:
                str.push('轮庄');
                break;
            case 2:
                str.push('最佳手气');
                break;
            case 3:
                str.push('最差手气');
                break;
            case 4:
                str.push('抢庄');
                break;
            case 5:
                str.push('固定庄');
                break;
        }
        str.push('最大' + Rule.maxRate + '倍');
        str.push('最低埋雷数 ' + Rule.mailei / 10000);
        var model = Rule.model ? '必抢' : '选抢'
        str.push(model);
        return str;
    },

    //刨幺
    _getPaoyaString: function (Rule) {
        var str = [];
        if (!Rule) return str;

        var PY_EnumData = require("paoyao_type").EnumData.Instance();
        var PY_Enum = require("paoyao_type");

        var play = Rule.isMing;
        if (play)
            str.push('明幺');
        else
            str.push('暗幺');
        var isDui = Rule.isDui;
        var hasSan = Rule.hasSan;
        var issan = Rule.isSan;
        if (!isDui)
            str.push('规则: ' + PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.TRUN_YAO));
        else if (hasSan) {
            if (issan)
                str.push('规则: ' + PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.HAVE_3));
            else
                str.push('规则: ' + PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.SMALL_3));
        } else
            str.push('规则: ' + PY_EnumData.GetRuleEnumStr(PY_Enum.RuleEnum.NOHAVE_3));

        return str
    },

    //干瞪眼
    _getTDKRuleString: function (Rule) {
        var str = [];
        if (!Rule) return str;

        var TDkCDeskData = require('tdk_coin_desk_data');
        var CDeskData = TDkCDeskData.TdkCDeskData;

        str.push(CDeskData.Instance().getPlayTypeStr(Rule.playType));
        if (Rule.hasJoker)
            str.push('有王');
        if (Rule.jokerPao)
            str.push('王中炮');
        if (Rule.aPao)
            str.push('抓A必炮');
        str.push(Rule.shareType ? ',公张随豹' : ',公张随点');
        if (Rule.lanDouble)
            str.push('烂锅加倍');
        if (Rule.genfu)
            str.push('跟服');
        if (Rule.isOpen)
            str.push('亮底');
        str.push(Rule.bati ? ',把踢' : ',末踢');
        return str;
    },

    //斗地主规则
    _getXYDDZRuleString(rules) {
        var str = [];
        str.push('共' + rules.circleNum + '局');
        str.push('封顶:' + rules.maxTimes.toString() + '倍');
        if (rules.cardHolder == true) {
            str.push('记牌器');
        }
        if (rules.beenCallScore == true) {
            str.push('好牌必叫');
        }
        return str;
    },


    //斗地主规则
    _getDDZRuleString(rules) {
        var str = [];
        str.push('共' + rules.circleNum + '局');
        str.push('封顶:' + (rules.maxScore == 0x7FFFFFFF ? '不封顶' : rules.maxScore.toString() + '分'));
        if (rules.doubleScore == 1) {
            str.push('自由加倍');
        }
        else if (rules.doubleScore == 2) {
            str.push('农民优先加倍');
        }
        else {
            str.push('不能加倍');
        }
        if (rules.beenCallScore == true) {
            str.push('双王四个2必叫');
        }
        if (rules.canDaiExtra2 == false) {
            str.push('不能4带2');
        }
        if (rules.stackGenPoker == true) {
            str.push('分摞发牌');
        }
        if (rules.exchangePoker == true) {
            str.push('换三张');
        }
        if (rules.bottomPokerDouble == true) {
            str.push('底牌加番');
        }
        return str;
    },

    //牛牛规则
    _getNNRuleString(rules) {
        var str = [];
        if (rules.gameType == 1) {
            str.push('抢庄');
        }
        else if (rules.gameType == 2) {
            str.push('通比');
        }
        if (rules.showType == 1) {
            str.push('扣一张');
        }
        else {
            str.push('全扣');
        }
        if (rules.cardTypeThree == 1) {
            str.push('三条');
        }
        if (rules.cardTypeStraight == 1) {
            str.push('顺子');
        }
        if (rules.cardTypeFlush == 1) {
            str.push('同花');
        }
        if (rules.cardTypeFullHouse == 1) {
            str.push('葫芦');
        }
        if (rules.cardTypeFive == 1) {
            str.push('五小牛');
        }
        if (rules.cardTypeFlushStraight == 1) {
            str.push('同花顺');
        }
        return str;
    },

    //梭哈规则
    _getSHRuleInfo(rules) {
        var maxScoreConvert = [0, 50, 100, 200, 300, 400, 500, 100000000]
        var str = [];
        str.push(rules.playerNum + '人房');
        str.push('共' + rules.circleNum + '局');
        str.push('' + maxScoreConvert[rules.maxScore] + '封顶');
        if (rules.giveUp) {
            str.push('超时弃牌');
        }
        if (rules.showCard) {
            str.push('亮底牌');
        }
        return str;
    },


    //斗三张规则
    _getNewDszString: function (rule) {
        var playmodel = rule.playMod //游戏模式
        var luckyType = rule.luckyType //喜分类型
        var ruleList = rule.playRuleList; //玩法
        var ruleStr = [];
        switch (rule.limitCmp) {
            case 1:
                ruleStr.push('最大加注:5  ');
                break;
            case 2:
                ruleStr.push('最大加注:10  ');
                break;
            case 3:
                ruleStr.push('最大加注:20  ');
                break;
            case 4:
                break;
        }
        ruleStr.push(rule.roleNum + '人  ');
        ruleStr.push(rule.boardsCout + '局  ');
        ruleStr.push('每局' + rule.circleNum + '轮  ');
        ruleStr.push(playmodel == 1 ? '标准模式  ' : '大牌模式(无2-8)  ');

        switch (luckyType) {
            case 1:
                ruleStr.push('闷吃喜分  ');
                break;
            case 2:
                ruleStr.push('都吃喜分  ');
                break;
            case 3:
                ruleStr.push('赢吃喜分  ');
                break;
            case 4:
                break;
        }

        rule.luckyPokersList.forEach(function(type){
            switch(type){
                case 1:
                    ruleStr.push('喜分牌型:豹子  ');
                    break;
                case 2:
                    ruleStr.push('喜分牌型:顺金  ');
                    break;
            }
        })


        switch(rule.luckyPay){
            case 1:
                ruleStr.push('喜分得分：10 / 5  ');
                break;
            case 2:
                ruleStr.push('喜分得分：20 / 10  ');
                break;
            case 3:
                ruleStr.push('喜分得分：30 / 15  ');
                break;
            case 4:
                break;
        }

        switch(rule.limitWatch){
            case 0:
                ruleStr.push('不闷牌  ');
                break;
            case 2:
                ruleStr.push('必闷一轮  ');
                break;
            case 3:
                ruleStr.push('必闷两轮  ');
                break;
            case 4:
                ruleStr.push('必闷三轮  ');
                break;
                
        }


        ruleList.forEach(function (rule) {
            switch (rule) {
                case 1:
                    ruleStr.push('必闷三轮')
                    break;
                case 2:
                    ruleStr.push('癞子玩法');
                    break;
                case 3:
                    ruleStr.push('双倍比牌');
                    break;
                case 4:
                    ruleStr.push('亮底牌');
                    break;
            }
        });

        return ruleStr;
    },

    //玩家人数
    getPlayerNum(Rule, gameType) {
        switch (gameType) {
            case Define.GameType.JLMJ_FRIEND: //吉林麻将
            case Define.GameType.CCMJ_FRIEND:
            case Define.GameType.NAMJ_FRIEND:
            case Define.GameType.FXMJ_FRIEND:
            case Define.GameType.SYMJ_FRIEND:
            case Define.GameType.SYMJ_FRIEND_2:
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_FRIEND:
            case Define.GameType.SHMJ_FRIEND:
            case Define.GameType.JZMJ_FRIEND:
            case Define.GameType.HSMJ_FRIEND:
            case Define.GameType.TDHMJ_FRIEND:
            case Define.GameType.CFMJ_FRIEND:
            case Define.GameType.AHMJ_FRIEND:
            case Define.GameType.FZMJ_FRIEND:
            case Define.GameType.WDMJ_FRIEND:
            case Define.GameType.PZMJ_FRIEND:
            case Define.GameType.BCMJ_FRIEND:
            case Define.GameType.ACMJ_FRIEND:
            case Define.GameType.HLMJ_FRIEND:
                return Rule.usercountlimit;
            case Define.GameType.DDZ_FRIEND: //斗地主
                // let DDZ_Data = require('ddz_data').DDZ_Data;
                return 3;
            case Define.GameType.NN_FRIEND: //逗双十
                // let nn_data = require('nn_data');
                return 9;//nn_data.Instance().getPlayerList().length;
            case Define.GameType.SH_FRIEND: //港式五张
                return Rule.playerNum;
            case Define.GameType.HBSL_JBL: //红包扫雷
                return Rule.maxBaonum;
            case Define.GameType.TDK_FRIEND: //填大坑
            case Define.GameType.TDK_FRIEND_LIU: //方正填大坑
                // var TDkCDeskData = require('tdk_coin_desk_data');
                // var CDeskData = TDkCDeskData.TdkCDeskData;
                // return CDeskData.Instance().playerCnt;
                return Rule.roleCount;
            case Define.GameType.PAOYAO_FRIEND: //刨幺
                return 4;
            case Define.GameType.NEW_DSZ_FRIEND:
                return Rule.roleNum;
            default:
                return 4;

        }
    },

    //玩法局数
    getJuShu(Rule, gameType) {

        let jushutitle = '局数';

        switch (gameType) {
            case Define.GameType.JLMJ_FRIEND: //吉林麻将
            case Define.GameType.CCMJ_FRIEND:
            case Define.GameType.NAMJ_FRIEND:
            case Define.GameType.FXMJ_FRIEND:
            case Define.GameType.SYMJ_FRIEND:
            case Define.GameType.SYMJ_FRIEND_2:
            case Define.GameType.ACMJ_FRIEND:
                return [Rule.boardscout, Rule.usercountlimit == 2 ? jushutitle : '圈数'];
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_FRIEND:
            case Define.GameType.FZMJ_FRIEND:
            case Define.GameType.HLMJ_FRIEND:
                return [Rule.boardscout, jushutitle];
            case Define.GameType.SHMJ_FRIEND:
            case Define.GameType.JZMJ_FRIEND:
            case Define.GameType.HSMJ_FRIEND:
            case Define.GameType.TDHMJ_FRIEND:
                return [Rule.boardscout, Rule.usercountlimit == 4 ? '圈数' : jushutitle];
            case Define.GameType.CFMJ_FRIEND:
            case Define.GameType.AHMJ_FRIEND:
            case Define.GameType.WDMJ_FRIEND:
            case Define.GameType.PZMJ_FRIEND:
                if(Rule.hasOwnProperty('mode')){
                    return [Rule.boardscout, Rule.mode == 0 ? '圈数' : jushutitle];
                }else{
                    return [Rule.boardscout, Rule.boardscout < 10 ? '圈数' : jushutitle];
                }
            case Define.GameType.BCMJ_FRIEND:
                return [Rule.boardscout, '圈数'];
            case Define.GameType.DDZ_FRIEND: //斗地主
                return [Rule.circleNum, jushutitle]
            case Define.GameType.NN_FRIEND: //港式五张
                return [Rule.circleNum, jushutitle];
            case Define.GameType.SH_FRIEND: //港式五张
                return [Rule.circleNum, jushutitle];
            case Define.GameType.HBSL_JBL: //红包扫雷
                return [Rule.roleCount, Rule.zhuangType == 1 ? '轮数' : jushutitle];
            case Define.GameType.TDK_FRIEND: //填大坑
            case Define.GameType.TDK_FRIEND_LIU: //方正填大坑
                return [Rule.roundCount, jushutitle];
            case Define.GameType.PAOYAO_FRIEND: //刨幺
                return [Rule.circleNum, jushutitle];
            default:
                return [4, jushutitle];
        }
    },
};

module.exports = rule;