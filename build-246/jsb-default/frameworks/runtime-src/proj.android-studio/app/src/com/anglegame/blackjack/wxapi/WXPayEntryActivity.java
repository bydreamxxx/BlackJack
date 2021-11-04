package com.anglegame.blackjack.wxapi;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.anglegame.blackjack.AppActivity;

import android.app.Activity;
//import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler{

	private static final String TAG = "WXPay";

    private IWXAPI wxapi;
    private static String APP_ID;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

//        APP_ID = AppActivity.getMetaInfo("APP_ID");
		APP_ID = AppActivity.APP_ID;

        Log.v(TAG,"WXPayEntryActivity  onCreate ---------Get APP_ID="+APP_ID);

        // 注册到微信
        wxapi = WXAPIFactory.createWXAPI(this, APP_ID, true);
        wxapi.registerApp(APP_ID);

//        setContentView(R.layout.entry);
        wxapi.handleIntent(getIntent(), this);
    }

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		setIntent(intent);
		wxapi.handleIntent(intent, this);
	}

	@Override
	public void onReq(BaseReq req) {
	}

	@Override
	public void onResp(BaseResp resp) {
		Log.d(TAG, "onPayFinish, errCode = " + resp.errCode);

		//微信支付结果
        if(resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX){
        	WXJniHelper.WXPayCallback( ""+resp.errCode );

        	if( resp.errCode == 0 ) { //支付成功
            	Log.v("WeiChat","onWxPayFinish, 微信支付成功！");
        	} else if( resp.errCode == -2 ) { //用户取消
            	Log.v("WeiChat","onWxPayFinish, 用户取消微信支付!");
        	} else if( resp.errCode == -1 ) { //支付失败
            	Log.v("WeiChat","onWxPayFinish, 微信支付失败!");
        	}
        }

        finish(); //必须要有，用于点击返回游戏的时候不会留在微信
	}
}
