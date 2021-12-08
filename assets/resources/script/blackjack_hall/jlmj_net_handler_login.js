const Hall = require('jlmj_halldata');
var LoginData = require('jlmj_login_data');
var login_module = require('LoginModule');

var hanlder = {
    on_common_login_ack: function (msg) {
        cc.dd.NetWaitUtil.close();
        if (msg && msg.code != 0) {
            cc.log('服务器登陆错误码:code=' + msg.code);
            //用户验证失败,或者微信错误,则重新授权
            if (msg.code == 2 || msg.code > 100) {
                cc.log('用户验证失败,或者微信错误,则重新授权');
                LoginData.Instance().saveRefreshToken('');
                login_module.Instance().login();
                return;
            }
            var text = cc.dd.Text.TEXT_SYSTEM_8;
            switch (msg.code) {
                case 1:
                    text = cc.dd.Text.TEXT_SYSTEM_13;
                    break;
                case 2:
                    text = cc.dd.Text.TEXT_SYSTEM_14;
                    break;
                case 3:
                // text = cc.dd.Text.TEXT_SYSTEM_15;
                // break;
                case 4:
                    text = cc.dd.Text.TEXT_SYSTEM_16;
                    cc.dd.NetWaitUtil.close();
                    cc.dd.DialogBoxUtil.clear();
                    cc.dd.DialogBoxUtil.show(1, text, 'text31', null, function () {
                        cc.director.end();
                    }, null);
                    return;
                    break;
                case 5:
                    text = cc.dd.Text.TEXT_SYSTEM_17;
                    break;
                case 6:
                    text = cc.dd.Text.TEXT_SYSTEM_18;
                    break;
                case 7:
                    text = "绑定用户禁止游客登录!";
                    break;
                case 8:
                    text = "绑定用户失败";
                    break;
                case 9:
                    text = '服务器维护中，敬请期待';
                    break;
                case -1:
                    text = "不支持的登录方式";
                    break;
                default:
                    break;
            }
            // cc.dd.PromptBoxUtil.show(text);
            cc.dd.DialogBoxUtil.clear();
            cc.dd.DialogBoxUtil.show(0, text, 'text33', 'Cancel', function () {
                if (msg.code != 7 && msg.code != 8) {
                    login_module.Instance().reconnectWG();
                }
            }, null);
            cc.dd.NetWaitUtil.close();
        } else {
            Hall.HallED.notifyEvent(Hall.HallEvent.LOGING_USER, null);
            if (cc.OnWxShareFunc) {
                cc.OnWxShareFunc();
            }
        }
    },

    on_common_token_ack: function (msg) {
        LoginData.Instance().saveRefreshToken(msg.token);
        cc.wx_authing = false;
    },

    on_common_refresh_notify: function (msg) {
        LoginData.Instance().saveRefreshToken('');
        login_module.Instance().login();
    },
};

module.exports = hanlder;
