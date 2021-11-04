package game;

//import com.huawei.cloudsecurity.GameShield;
//import com.crashlytics.android.Crashlytics;
//import com.tencent.bugly.crashreport.CrashReport;
import com.tencent.map.geolocation.TencentLocationUtils;
import com.anglegame.blackjack.AppActivity;
import com.anglegame.blackjack.R;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Point;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.io.File;
import java.io.FileInputStream;
import java.lang.reflect.Method;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.List;

/**
 * Created by yons on 2018/1/11.
 */

public class SystemTool {

    private final static String TAG = Cocos2dxActivity.class.getSimpleName();

    public static boolean SetLandscape() {
        if (AppActivity.app.getRequestedOrientation() != ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE) {
            Log.i("横竖屏切换", "设置横屏");
            AppActivity.app.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
            return true;
        } else {
            Log.i("横竖屏切换", "已经是横屏");
            return false;
        }
    }

    public static boolean SetPortrait() {
        if (AppActivity.app.getRequestedOrientation() != ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
            Log.i("横竖屏切换", "设置竖屏");
            AppActivity.app.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            return true;
        } else {
            Log.i("横竖屏切换", "已经是竖屏");
            return false;
        }
    }

    public static String getScreenRatio() {
        Log.d(TAG, "获取屏幕分辨率");
        float screen_width = 0.0f;
        float screen_height = 0.0f;

        int ver = Build.VERSION.SDK_INT;
        Log.d(TAG, "安卓系统版本 " + ver);
        if (ver >= 17) {
            Display display = AppActivity.app.getWindowManager().getDefaultDisplay();
            DisplayMetrics dm = new DisplayMetrics();
            Class c;
            try {
                c = Class.forName("android.view.Display");
                Method method = c.getMethod("getRealMetrics", DisplayMetrics.class);
                method.invoke(display, dm);
            } catch (Exception e) {
                e.printStackTrace();
            }
            Log.d(TAG, "屏幕分辨率 " + dm.toString());
            screen_width = dm.widthPixels;
            screen_height = dm.heightPixels;
        } else {
            Point point = new Point();
            AppActivity.app.getWindowManager().getDefaultDisplay().getSize(point);
            Log.d(TAG, "屏幕分辨率 " + point.toString());
            screen_width = point.x;
            screen_height = point.y;
        }

        return String.format("%f,%f", screen_width, screen_height);
    }

    public static boolean is3GAvailable() {
        ConnectivityManager mgr = (ConnectivityManager) AppActivity.app.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo info = mgr.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
        if (info != null) {
            return info.isAvailable();
        }
        return false;
    }

    public static boolean isWifiAvailable() {
        ConnectivityManager mgr = (ConnectivityManager) AppActivity.app.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo info = mgr.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        if (info != null) {
            return info.isAvailable();
        }
        return false;
    }

    public static boolean isNetAvailable() {
//        Log.i("MainActivity", "isNetAvailable in java called");
        ConnectivityManager manager = (ConnectivityManager) AppActivity.app.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeInfo = manager.getActiveNetworkInfo();
        if (activeInfo != null) {
            return activeInfo.isAvailable();
        }
        return false;
    }

    public static String getChannelID() {
        String channel = "default";
        try {
            String packageName = AppActivity.app.getPackageName();
            PackageManager mgr = AppActivity.app.getPackageManager();
            ApplicationInfo info = mgr.getApplicationInfo(packageName,
                    PackageManager.GET_META_DATA);
            Object value = info.metaData.get("CHANNEL_ID");
            if (value != null) {
                channel = value.toString();
            }
        } catch (Exception e) {
            Log.e("MainActivity", "Can't get META-DATA: CHANNEL_ID");
        }
        return channel;
    }

    public static void OpenUrl(String url) {
        final Uri uri = Uri.parse(url);
        final Intent it = new Intent(Intent.ACTION_VIEW, uri);
        AppActivity.app.startActivity(it);
    }

    static String tempStr;

    public static String GetClipBoardContent() {
        tempStr = "";
        AppActivity.app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                int sdk = android.os.Build.VERSION.SDK_INT;
                if (sdk < 11) { // API=11ä»¥ä¸: android.os.Build.VERSION_CODES.HONEYCOMB
                    android.text.ClipboardManager clipboard = (android.text.ClipboardManager) AppActivity.app
                            .getSystemService(Context.CLIPBOARD_SERVICE);
                    tempStr = clipboard.getText().toString();
                } else {
                    android.content.ClipboardManager clipboard = (android.content.ClipboardManager) AppActivity.app
                            .getSystemService(Context.CLIPBOARD_SERVICE);
                    if (clipboard != null && clipboard.getText() != null) {
                        tempStr = clipboard.getText().toString();
                    }
                }
            }
        });
        return tempStr;
    }

    public static void SetClipBoardContent(String content) {
        tempStr = content;
        AppActivity.app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                int sdk = android.os.Build.VERSION.SDK_INT;
                if (sdk < android.os.Build.VERSION_CODES.DONUT) { // API=11ä»¥ä¸
                    android.text.ClipboardManager clipboard = (android.text.ClipboardManager) AppActivity.app
                            .getSystemService(Context.CLIPBOARD_SERVICE);
                    clipboard.setText(tempStr);
                } else {
                    android.content.ClipboardManager clipboard = (android.content.ClipboardManager) AppActivity.app
                            .getSystemService(Context.CLIPBOARD_SERVICE);
                    if (clipboard != null) {
                        android.content.ClipData clip = android.content.ClipData
                                .newPlainText("text label", tempStr);
                        clipboard.setPrimaryClip(clip);
                    }
                }
            }
        });
    }


    public static float getBatteryLevel() {
        return AppActivity.batteryLevel;
    }

    public static void StartLoadingAni(final String content) {
        AppActivity.app.startLoadingAni(content);
    }

    public static void StopLoadingAni() {
        AppActivity.app.stopLoadingAni();
    }

    public static void SetLoadingAniTips(final String content) {
        AppActivity.app.setLoadingAniTips(content);
    }

    public static String getMD5ByFile(final String path) {
        File file = new File(path);
        if (!file.isFile()) {
            return "";
        }
        MessageDigest digest = null;
        FileInputStream in = null;
        byte buffer[] = new byte[1024];
        int len;
        try {
            digest = MessageDigest.getInstance("MD5");
            in = new FileInputStream(file);
            while ((len = in.read(buffer, 0, 1024)) != -1) {
                digest.update(buffer, 0, len);
            }
            in.close();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
        BigInteger bigInt = new BigInteger(1, digest.digest());
        return bigInt.toString(16);
    }

    public static void gameStart() {
        AppActivity.app.gameStart();
    }

    /**********************************以下接口未使用*************************************/

    public static void installApp(String fileName) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(Uri.fromFile(new File(fileName)), "application/vnd.android.package-archive");
        AppActivity.app.startActivity(intent);
    }

    public static String GetGPSLocation() {
        //è·åå®ä½æå¡
        LocationManager locationManager = (LocationManager) AppActivity.app.getSystemService(Context.LOCATION_SERVICE);
        //è·åå½åå¯ç¨çä½ç½®æ§å¶å¨
        List<String> list = locationManager.getProviders(true);

        String locationVal = "";
        String provider;

        if (list.contains(LocationManager.GPS_PROVIDER)) {
            //æ¯å¦ä¸ºGPSä½ç½®æ§å¶å¨
            provider = LocationManager.GPS_PROVIDER;
        } else if (list.contains(LocationManager.NETWORK_PROVIDER)) {
            //æ¯å¦ä¸ºç½ç»ä½ç½®æ§å¶å¨
            provider = LocationManager.NETWORK_PROVIDER;
        } else {
            Log.v("MainActivity", "è¯·æ£æ¥ç½ç»æGPSæ¯å¦æå¼");
            return locationVal;
        }

        Location location = locationManager.getLastKnownLocation(provider);
        if (location != null) {
            //è·åå½åä½ç½®: ç»åº¦,çº¬åº¦
            locationVal = location.getLongitude() + "," + location.getLatitude();
            Log.v("MainActivity", "æåè·åå°ç»çº¬åº¦ï¼" + locationVal);
        } else {
            Log.v("MainActivity", "GPS: getLastKnownLocation()è¿ånull");
        }

        return locationVal;
    }

    public static String getInnerSDCardPath() { return AppActivity.app.getInnerSDCardPath(); }

    public static void closeSplash() {
        AppActivity.closeSplash();
    }

    public static float getDistanceBetwwen(float start_Lat, float end_lat, float start_long, float end_long) {
        return (float) TencentLocationUtils.distanceBetween((double) start_Lat, (double) start_long, (double) end_lat, (double) end_long);
    }

    public static String getAdress() {
        Log.e("详细地址： 调用函数：", "getAdress");
        return AppActivity.app.getAdress();
    }

    public static float getLatitude() {
        Log.e("详细纬度：", "调用getlatitude");
        float latitude = AppActivity.app.getLatitude();
        return latitude;
    }

    public static float getLongitude() {
        Log.e("详细经度：", "调用getLongitude");
        float longitude = AppActivity.app.getLongitude();
        return longitude;
    }

    public static String getDeviceInfo() {
        // 设备厂商
        String brand = Build.BRAND;
        // 设备名称
        String model = Build.MODEL;
        // SDK版本
        int sdk_int = Build.VERSION.SDK_INT;
        return "厂商:" + brand + " " + "设备:" + model + " " + "sdk版本:" + sdk_int;
    }

    public static String getHWUrl(String group, int port, String originIp) {
//        int ret = GameShield.getServerIPAndPort(group, port, GameShield.IPPROTO_TCP);
//        String url;
//        if (ret == 0) {
//            url = GameShield.ServerIP + ":" + GameShield.ServerPort;
//            Log.e("getHWUrl","获取url成功 url:"+url);
//        } else {
//            Log.e("getHWUrl","获取url失败 错误码:"+ret);
//            url = originIp + ":" + port;
//        }
//        return url;
        return (originIp + ":" + port);
    }

    public static void getWXRoomID() {
        final String jsCallStr = String.format("cc.dealWithWXInviteInfo(\"%s\");", AppActivity.wxinvite);
        System.out.println(jsCallStr);
        AppActivity.wxinvite = "";
        AppActivity.app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
            }
        });
    }
}
