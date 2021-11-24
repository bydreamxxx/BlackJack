
package com.anglegame.blackjack.wxapi;

public class WXJniHelper {
    public static native void WXAuthCallback(String code);
    public static native void WXShareCallback(String type, String errcode); //微信分享
    public static native void WXShareAppCallback(String cmdUrl);
    public static native void WXPayCallback(String errcode);
}
