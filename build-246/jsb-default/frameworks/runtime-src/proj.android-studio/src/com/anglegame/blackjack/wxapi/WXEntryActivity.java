package com.anglegame.blackjack.wxapi;

import com.anglegame.blackjack.GameAppActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

//微信SDK相关
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelmsg.ShowMessageFromWX;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.tencent.mm.opensdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.SendAuth;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import static org.cocos2dx.lib.Cocos2dxHelper.runOnGLThread;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    public static IWXAPI wxapi;
    private static String APP_ID;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        APP_ID = AppActivity.getMetaInfo("APP_ID");
        APP_ID = GameAppActivity.APP_ID;

        Log.v("WeiChatLogin","WXEntryActivity  onCreate ---------Get APP_ID="+APP_ID);

        // 注册到微信
        Log.v("注册到微信APP_ID", APP_ID);
        wxapi = WXAPIFactory.createWXAPI(this, APP_ID, true);
        wxapi.registerApp(APP_ID);
//        setContentView(R.layout.entry);
        wxapi.handleIntent(getIntent(), this);
    }

	// IWXAPIEventHandler
	@Override
    public void onReq(BaseReq req) {
        Log.v("WeiChatLogin", "onReq++++++++++++");

//		Toast.makeText(this, "WXEntry onReq+++", Toast.LENGTH_LONG).show();

		if( req.getType()==ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX ) {
			//从微信过来的请求，传递给App
			goToShowMsg((ShowMessageFromWX.Req) req);
		}

		finish();
    }

	private void goToShowMsg(ShowMessageFromWX.Req showReq) {
		WXMediaMessage wxMsg = showReq.message;
		WXAppExtendObject obj = (WXAppExtendObject) wxMsg.mediaObject;

//		StringBuffer msg = new StringBuffer(); // 组织一个待显示的消息内容
//		msg.append("微信传来的extInfo: ");
//		msg.append(obj.extInfo);
//		Toast.makeText(this, msg, Toast.LENGTH_LONG).show();

        Log.v("WeiChat", "微信一键进房 >>> extInfo:"+obj.extInfo);

		Intent intent = new Intent(this, GameAppActivity.class);
		intent.putExtra("wxLaunchExtInfo", obj.extInfo);
		startActivity(intent);
        Log.v("WeiChat", "微信一键进房 >>> after startActivity( mainActivity )");

		//将参数传递给native层,(PS: 此处调用native会未定义；延迟到mainActivity的onCreate中调用）
//        WXJniHelper.WXShareAppCallback( obj.extInfo );

	}

    @Override
    public void onResp(BaseResp resp) {
        try {
            final int resp_type = resp.getType();
            final int resp_errcode = resp.errCode;
            Log.v("WeiChat", "onResp type = " + resp_type + "errCode = " + resp_errcode);
            switch (resp_type) {
                case ConstantsAPI.COMMAND_SENDAUTH:
                    onAuthResp(resp);
                    break;
                case ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX:
                    onShareResp(resp);
                    break;
                default:
                    break;
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
        }
    }

    /**
     * ææè¿å
     */
    public void onAuthResp(BaseResp resp){
        try {
            final int resp_type = resp.getType();
            final int resp_errcode = resp.errCode;
            Log.v("WeiChat","微信返回code="+resp_errcode);

             String token = String.valueOf(resp_errcode);
            switch (resp_errcode) {
                case BaseResp.ErrCode.ERR_OK:
                    SendAuth.Resp authResp = (SendAuth.Resp) resp;
                    token = authResp.code;
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    break;
                case BaseResp.ErrCode.ERR_AUTH_DENIED:
                    break;
                case BaseResp.ErrCode.ERR_UNSUPPORT:
                    break;
                default:
                    break;
            }
            final String finalToken = token;
            Log.v("WeiChat", "code = "+ finalToken);
            final String jsCallStr = String.format("cc.onResponseWxCode(\"%d\",\"%s\");", resp_errcode,finalToken);
            runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                }
            });
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finish();
        }
    }

    /**
     * åäº«è¿å
     */
    public void onShareResp(BaseResp resp){
        try {
            final int resp_type = resp.getType();
            final int resp_errcode = resp.errCode;
            switch (resp_errcode) {
                case BaseResp.ErrCode.ERR_OK:
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    break;
                case BaseResp.ErrCode.ERR_AUTH_DENIED:
                    break;
                case BaseResp.ErrCode.ERR_UNSUPPORT:
                    break;
                default:
                    break;
            }
            final String jsCallStr = String.format("cc.WeixinShareCallback(\"%d\");", resp_errcode);
            runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                }
            });
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finish();
        }
    }
}
