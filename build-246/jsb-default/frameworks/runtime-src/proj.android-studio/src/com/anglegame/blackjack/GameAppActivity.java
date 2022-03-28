/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package com.anglegame.blackjack;

import android.Manifest;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.content.ComponentName;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import android.content.Context;
import android.content.Intent;

import android.content.BroadcastReceiver;
import android.content.ContentUris;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.ParcelFileDescriptor;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.os.StrictMode;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v4.content.FileProvider;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.Toast;

import com.anglegame.blackjack.R;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.cocos2dx.lib.Utils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import static game.FtpUtil.uploadFile;

import game.FtpUtil;
import game.LoadingAnimation;
import game.PermissionsUtils;
import game.Preference;
import game.SystemTool;

import com.tencent.map.geolocation.TencentLocation;
import com.tencent.map.geolocation.TencentLocationListener;
import com.tencent.map.geolocation.TencentLocationManager;
import com.tencent.map.geolocation.TencentLocationRequest;
import com.tencent.mm.opensdk.openapi.IWXAPI;


import game.UploadUtil;

public class GameAppActivity implements TencentLocationListener, UploadUtil.OnUploadProcessListener {
    public static Cocos2dxActivity mainActive = null;
    public static GameAppActivity gameApp = null;
    private WakeLock mWakeLock;
    public static IWXAPI api;
    public static String APP_ID;
    public static float batteryLevel = 0.9f; //电量值

    public static ImageView splashImage;

    public LoadingAnimation loading_ani;
    public Handler handler = new Handler();

    static int count = 0;


    /**
     * 俱乐部相机，相册 begin
     */
    public final static int ALBUM_REQUEST_CODE = 1;
    public final static int CROP_REQUEST = 2;
    public final static int CAMERA_REQUEST_CODE = 3;
    private static final int PHOTO_RESOULT = 4;// 结果
    public static String SAVED_IMAGE_DIR_PATH =
            Environment.getExternalStorageDirectory().getPath();// 俱乐部图片存储路径
    TimerTask ppTask = null;

    protected static Uri photoUri;

    private static boolean gameStarted = false;
    public static boolean isAppStartResume = false;

    private TencentLocationRequest mlocationRequest;
    private TencentLocationManager mlocationManager;
    private TencentLocation locationInfo;

    private NetworkChangeRecevier networkChangeRecevier = null;

    public static String wxinvite = "";
    private static String upload_Data = "";
    private static String upload_URL = "";

    private Timer gpsTimer;
    private TimerTask gpsTimerTask;


    public class NetworkChangeRecevier extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (!gameStarted) {
                return;
            }
            ConnectivityManager manager = (ConnectivityManager) mainActive.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo activeInfo = manager.getActiveNetworkInfo();
            //未连接=0,已连接=1
            int connectType = 0;
            if (activeInfo != null && activeInfo.isAvailable()) {
                connectType = 1;
            }
            final String jsCallStr = String.format("cc.networkChanged(\"%d\");", connectType);
            mainActive.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                }
            });
        }
    }

    class BatteryBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (Intent.ACTION_BATTERY_CHANGED.equals(intent.getAction())) {
                int level = intent.getIntExtra("level", 0);
                int scale = intent.getIntExtra("scale", 100);
                batteryLevel = (float) level / (float) scale;
            }
        }
    }

    public void onCreate(Cocos2dxActivity context) {
        //Fabric.with(this, new Crashlytics());
        mainActive = context;

        if (gpsTimer == null) {
            gpsTimer = new Timer();
            gpsTimerTask = new TimerTask() {
                @Override
                public void run() {
                    handler.post(new Runnable() {
                        public void run() {
                            createLocation();
                        }
                    });
                }
            };
        }

        Intent i_getvalue = mainActive.getIntent();
        String action = i_getvalue.getAction();
        if (Intent.ACTION_VIEW.equals(action)) {
            Uri uri = i_getvalue.getData();
            if (uri != null) {
                wxinvite = uri.getQuery();// uri.getQueryParameter("room_id");
                if (wxinvite == null) {
                    wxinvite = "";
                }
            }
        }

//        SDKWrapper.getInstance().init(this);

//        if(Build.VERSION.SDK_INT >= 30){
//            if(!Environment.isExternalStorageManager()){
//                Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
//                intent.setData(Uri.parse("package:"+mainActive.getPackageName()));
//                startActivityForResult(intent, 100);
//            }
//        }

        splashImage = new ImageView(mainActive);
        splashImage.setImageResource(R.mipmap.splash);
        splashImage.setScaleType(ImageView.ScaleType.FIT_XY);
        mainActive.addContentView(splashImage,
                new WindowManager.LayoutParams(
                        WindowManager.LayoutParams.FILL_PARENT,
                        WindowManager.LayoutParams.FILL_PARENT));

        gameApp = this;
        isAppStartResume = true;
        this.appInit();
        //设置竖屏
//        SetLandscape();
        mainActive.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
//        showBar();

        Preference.setActivity(this);

        final View view = mainActive.getCurrentFocus();
        if (view != null) {
            view.setBackgroundColor(0xFFFFFFFF);
        }

        Preference.setContext(mainActive);

        SAVED_IMAGE_DIR_PATH = Build.VERSION.SDK_INT >= Build.VERSION_CODES.N ? (mainActive.getExternalFilesDir(Environment.DIRECTORY_PICTURES).getAbsolutePath()+"/") : SAVED_IMAGE_DIR_PATH + "/" + mainActive.getPackageName() + "/club/";
        System.out.println("俱乐部图片缓存路径：" + SAVED_IMAGE_DIR_PATH);
        File dir = new File(SAVED_IMAGE_DIR_PATH);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        //this.createLocation();
        gpsTimer.schedule(gpsTimerTask, 0, 30 * 1000);


//        int ret = GameShield.init("15c3e8f1bffb57278edc744ddb58f24b231949cb6f409955c5daf3f5be40eaa6");
//        if (ret != 0)
//            Log.e("HWurl init", "初始化gameshield失败 错误码" + ret);
//        else
//            Log.i("HWurl init", "初始化gameshield成功");

        Intent intent = mainActive.getIntent();
        String roomId = intent.getStringExtra("roomId");
        if (roomId != null && !roomId.isEmpty()) {
            wxinvite = roomId;
        }

        // android 7.0系统解决拍照的问题
        StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
        StrictMode.setVmPolicy(builder.build());
        builder.detectFileUriExposure();
    }

    public static void closeSplash() {
        mainActive.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                splashImage.setVisibility(View.GONE);

                final View view = mainActive.getCurrentFocus();
                if (view != null) {
                    view.setBackgroundColor(0x00000000);
                }
            }
        });
    }

    /**
     * 显示底部导航条
     */
    public static void showBar() {
//        try {
//            Process proc = Runtime.getRuntime().exec(
//                    new String[]{"am", "startservice", "-n",
//                            "com.android.systemui/.SystemUIService"});
//            proc.waitFor();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

        View decorView = mainActive.getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        decorView.setSystemUiVisibility(uiOptions);
    }


    public static String getScreenSize() {
        WindowManager wm = mainActive.getWindowManager();
        int width = wm.getDefaultDisplay().getWidth();
        int height = wm.getDefaultDisplay().getHeight();
        return String.format("%d,%d", width, height);
    }

    public static void hideBar() {
        try {
            // 需要root 权限
            Build.VERSION_CODES vc = new Build.VERSION_CODES();
            Build.VERSION vr = new Build.VERSION();
            String ProcID = "79";
            if (vr.SDK_INT >= vc.ICE_CREAM_SANDWICH) {
                ProcID = "42"; // ICS AND NEWER
            }
            // 需要root 权限
            Process proc = Runtime.getRuntime().exec(
                    new String[]{
                            "su",
                            "-c",
                            "service call activity " + ProcID
                                    + " s16 com.android.systemui"}); // WAS 79
            proc.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void closeNavigationBar() {
        mainActive.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                View decorView = mainActive.getWindow().getDecorView();
                int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
                decorView.setSystemUiVisibility(uiOptions);
            }
        });
    }

    public static String getInnerSDCardPath() {

        if(Build.VERSION.SDK_INT >= 24){
//            return org.cocos2dx.lib.Cocos2dxHelper.getWritablePath();
//        }else if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.N){
            return mainActive.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath()+"/";
        }else{
            return Environment.getExternalStorageDirectory().getPath();
        }
    }

    public void onResume() {
        Log.v("gameStarted", "系统恢复");
        if (gameStarted) {
            final String jsCallStr = String.format("cc.SystemOnResume();cc.dealWithWXInviteInfo(\"%s\");cc.loginWithWX()", wxinvite);
            wxinvite = "";
            mainActive.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                }
            });
            Log.v("gameStarted", "执行JS");
        } else {
            Log.v("gameStarted", "不执行JS");
        }
    }

    public void onPause() {
        Log.v("gameStarted", "系统暂停");
        if (gameStarted) {
            final String jsCallStr = String.format("cc.SystemOnPause();");
            mainActive.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                }
            });
            Log.v("gameStarted", "执行JS");
        } else {
            Log.v("gameStarted", "不执行JS");
        }
    }

    public void onDestroy() {
        if (networkChangeRecevier != null) {
            mainActive.unregisterReceiver(networkChangeRecevier);
        }
        if (gpsTimer != null)
            gpsTimer.cancel();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == mainActive.RESULT_OK) { // 如果返回码是可以用的
            switch (requestCode) {
                case ALBUM_REQUEST_CODE:
//                    Log.e("MySelf", "ALBUM_REQUEST_CODE");
                    startPhotoZoom(data.getData(), 0); // 开始对图片进行裁剪处理
                    break;
                case CAMERA_REQUEST_CODE:
//                    Log.e("MySelf", "CAMERA_REQUEST_CODE");
                    //处理部分手机拍完照后图片会被旋转
                    int degree = 0;
                    try {
                        ExifInterface exifInterface = new ExifInterface(photoUri.getPath());
                        int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
                        switch (orientation) {
                            case ExifInterface.ORIENTATION_ROTATE_90:
                                degree = 90;
                                break;
                            case ExifInterface.ORIENTATION_ROTATE_180:
                                degree = 180;
                                break;
                            case ExifInterface.ORIENTATION_ROTATE_270:
                                degree = 270;
                                break;
                        }
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }

                    startPhotoZoom(photoUri, degree); // 开始对图片进行裁剪处理
                    break;
                case PHOTO_RESOULT:
//                    Log.e("MySelf", "PHOTO_RESOULT");
                    if (data != null) {
                        setImageToView(data); // 让刚才选择裁剪得到的图片显示在界面上
                    }
                    break;
            }
        }
    }

    public void onNewIntent(Intent intent) {
        mainActive.setIntent(intent);
    }

    public void gameStart() {
        gameStarted = true;
    }

    /**
     * App初始化
     */
    @SuppressLint("InvalidWakeLockTag")
    public void appInit() {
        //设置屏幕常亮
        PowerManager pm = (PowerManager) mainActive.getSystemService(Context.POWER_SERVICE);
        mWakeLock = pm.newWakeLock(PowerManager.SCREEN_BRIGHT_WAKE_LOCK
                | PowerManager.ON_AFTER_RELEASE, "DonDeen");
        try {
            mWakeLock.acquire();
        } catch (final SecurityException e) {
            Log.v("MainActivity", "Please add \"android.permission.WAKE_LOCK\" to AndroidManifest.xml!", e);
        }
        //微信SDK初始化
//        APP_ID = AppActivity.getMetaInfo("APP_ID"); //读取微信AppId
//        APP_ID = "wx25b71c6d0cb9e6b6";    //巷乐吉林麻将
        try {
            ApplicationInfo appInfo = mainActive.getPackageManager().getApplicationInfo(mainActive.getPackageName(), PackageManager.GET_META_DATA);
            APP_ID = appInfo.metaData.getString("APP_ID");
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
//        Log.v("注册到微信APP_ID", APP_ID);
//        api = WXAPIFactory.createWXAPI(this, APP_ID, false);
//        api.registerApp(APP_ID);

        //注册监听获取电量
        BatteryBroadcastReceiver receiver = new BatteryBroadcastReceiver();
        IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        mainActive.registerReceiver(receiver, filter);

        loading_ani = new LoadingAnimation(mainActive);
        loading_ani.stopLoadingAni();
        mainActive.addContentView(loading_ani.getContent(),
                new WindowManager.LayoutParams(
                        WindowManager.LayoutParams.FILL_PARENT,
                        WindowManager.LayoutParams.FILL_PARENT));

        networkChangeRecevier = new NetworkChangeRecevier();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.net.conn.CONNECTIVITY_CHANGE");
        mainActive.registerReceiver(networkChangeRecevier, intentFilter);

//        CrashReport.initCrashReport(getApplicationContext(), "c85404f09d", false);
    }

    /**
     * test
     */
    public void uploadHead() {
        try {
            FileInputStream in = new FileInputStream(new File(SAVED_IMAGE_DIR_PATH + "1.jpg"));
            boolean flag = uploadFile("192.168.2.217", 21, "shen", "123321", "jlmj_club/head", "1.jpg", in);
            System.out.println(flag);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    public void downloadHead() {
        FtpUtil.downFile("192.168.2.217", 21, "shen", "123321", "jlmj_club/head", "1.jpg", SAVED_IMAGE_DIR_PATH + "download");
        System.out.println("downloadHead");
    }

    /**
     * 打开相册
     */
    public void openAlbum(String jsonData, String uploadURL) {
        upload_Data = jsonData;
        upload_URL = uploadURL;

        PermissionsUtils.IPermissionsResult permissionsResult = new PermissionsUtils.IPermissionsResult() {
            @Override
            public void passPermissions() {

                Intent intent = new Intent(Intent.ACTION_PICK, null);
                intent.setType("image/*");
//                intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
//                intent.setAction(Intent.ACTION_GET_CONTENT);
                mainActive.startActivityForResult(intent, ALBUM_REQUEST_CODE);

            }

            @Override
            public void forbitPermissions() {

            }
        };

        if (Build.VERSION.SDK_INT >= 29) {
            PermissionsUtils.getInstance().checkPermissions(mainActive, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, permissionsResult);
        }else {
            PermissionsUtils.getInstance().checkPermissions(mainActive, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE}, permissionsResult);
        }
    }

    /**
     * 拍照
     */
    public void takePhoto(String jsonData, String uploadURL) {
        upload_Data = jsonData;
        upload_URL = uploadURL;

        PermissionsUtils.IPermissionsResult permissionsResult = new PermissionsUtils.IPermissionsResult() {
            @Override
            public void passPermissions() {

                // 指定相机拍摄照片保存地址
                String state = Environment.getExternalStorageState();
                if (state.equals(Environment.MEDIA_MOUNTED)) {
                    Intent intent = new Intent();
                    // 指定开启系统相机的Action
                    intent.setAction(MediaStore.ACTION_IMAGE_CAPTURE);

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                        // Android 7.0 "file://" uri权限适配
                        //		获取图片沙盒文件夹
                        photoUri = FileProvider.getUriForFile(mainActive, "com.anglegame.blackjack.provider", new File(SAVED_IMAGE_DIR_PATH+"head_" + System.currentTimeMillis() + ".jpg"));
                    } else {
                        photoUri = Uri.fromFile(new File(SAVED_IMAGE_DIR_PATH+"head_" + System.currentTimeMillis() + ".jpg"));
                    }

                    // 设置系统相机拍摄照片完成后图片文件的存放地址
                    intent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
                    mainActive.startActivityForResult(intent, CAMERA_REQUEST_CODE);
                } else {
                    Toast.makeText(mainActive, "请确认已经插入SD卡",
                            Toast.LENGTH_LONG).show();
                }

            }

            @Override
            public void forbitPermissions() {

            }
        };

        if (Build.VERSION.SDK_INT >= 29){
            PermissionsUtils.getInstance().checkPermissions(mainActive, new String[]{Manifest.permission.CAMERA}, permissionsResult);
        }else{
            PermissionsUtils.getInstance().checkPermissions(mainActive, new String[]{Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE}, permissionsResult);

        }
    }

    public String getAbsolutePath(final Context context, final Uri fileUri) {
        if (context == null || fileUri == null)
            return null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT && DocumentsContract.isDocumentUri(context, fileUri)) {
            if (isExternalStorageDocument(fileUri)) {
                String docId = DocumentsContract.getDocumentId(fileUri);
                String[] split = docId.split(":");
                String type = split[0];
                if ("primary".equalsIgnoreCase(type)) {
                    return Environment.getExternalStorageDirectory() + "/" + split[1];
                }
            } else if (isDownloadsDocument(fileUri)) {
                String id = DocumentsContract.getDocumentId(fileUri);
                Uri contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));
                return getDataColumn(context, contentUri, null, null);
            } else if (isMediaDocument(fileUri)) {
                String docId = DocumentsContract.getDocumentId(fileUri);
                String[] split = docId.split(":");
                String type = split[0];
                Uri contentUri = null;
                if ("image".equals(type)) {
                    contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video".equals(type)) {
                    contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio".equals(type)) {
                    contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }
                String selection = MediaStore.Images.Media._ID + "=?";
                String[] selectionArgs = new String[]{split[1]};
                return getDataColumn(context, contentUri, selection, selectionArgs);
            }
        } // MediaStore (and general)
        else if ("content".equalsIgnoreCase(fileUri.getScheme())) {
            // Return the remote address
            if (isGooglePhotosUri(fileUri))
                return fileUri.getLastPathSegment();
            return getDataColumn(context, fileUri, null, null);
        }
        // File
        else if ("file".equalsIgnoreCase(fileUri.getScheme())) {
            return fileUri.getPath();
        }
        return null;
    }

    public String getDataColumn(Context context, Uri uri, String selection, String[] selectionArgs) {
        Cursor cursor = null;
        String[] projection = {MediaStore.Images.Media.DATA};
        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs, null);
            if (cursor != null && cursor.moveToFirst()) {
                int index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                return cursor.getString(index);
            }
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return null;
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is ExternalStorageProvider.
     */
    public boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is DownloadsProvider.
     */
    public boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is MediaProvider.
     */
    public boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is Google Photos.
     */
    public boolean isGooglePhotosUri(Uri uri) {
        return "com.google.android.apps.photos.content".equals(uri.getAuthority());
    }

    public void startLoadingAni(final String content) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                loading_ani.startLoadingAni(content);
            }
        });
    }

    public void stopLoadingAni() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                loading_ani.stopLoadingAni();
            }
        });
    }

    public void setLoadingAniTips(final String content) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                loading_ani.setTips(content);
            }
        });
    }

    public void onWindowFocusChanged(boolean hasFocus) {

        if (!gameStarted) {
            return;
        }

        if (hasFocus) {
            Utils.hideVirtualButton();
            //final String jsCallStr = String.format("cc.SystemOnResume();");
            //runOnGLThread(new Runnable() {
            //    @Override
            //    public void run() {
            //        Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
            //    }
            //});
        } else {
            //final String jsCallStr = String.format("cc.SystemOnPause();");
            //runOnGLThread(new Runnable() {
            //    @Override
            //    public void run() {
            //        Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
            //    }
            //});
        }
    }

    public void onKeyDown() {
        final Handler mHandler = new Handler();
        Runnable r = new Runnable() {

            @Override
            public void run() {
                Utils.hideVirtualButton();
            }
        };

        mHandler.postDelayed(r, 3000);
    }

    @Override
    public void onLocationChanged(TencentLocation location, int error, String reason) {
        if (TencentLocation.ERROR_OK == error) {
            this.locationInfo = location;
        }
        this.destroyLocManager();
    }

    @Override
    public void onStatusUpdate(String name, int status, String desc) {
//        Log.e("name:", name);
//        Log.e("status:", ""+status);
//        Log.e("desc:", desc);
    }

    public void createLocation() {
        if(this.mlocationRequest == null) {
            this.mlocationRequest = TencentLocationRequest.create();
            this.mlocationRequest.setInterval(10000);
            this.mlocationRequest.setRequestLevel(TencentLocationRequest.REQUEST_LEVEL_NAME);
            this.mlocationRequest.setAllowCache(true);
        }
        this.mlocationManager = TencentLocationManager.getInstance(mainActive);
        int error = this.mlocationManager.requestLocationUpdates(this.mlocationRequest, this);
        if (error == 0) {

            Log.e("监听状态:", "监听成功!");

        } else if (error == 1) {

            Log.e("监听状态:", "设备缺少使用腾讯定位SDK须要的基本条件");

        } else if (error == 2) {

            Log.e("监听状态:", "配置的 key 不对");

        }

    }

    public void destroyLocManager() {
        if (this.mlocationManager != null)
            this.mlocationManager.removeUpdates(this);
        this.mlocationManager = null;
    }

    public String getAdress() {
        String adress = this.locationInfo.getAddress();
        if (adress == null)
            return " ";
        return adress;
    }

    public float getLatitude() {
        float latitude = (float) this.locationInfo.getLatitude();
        Log.e("定位信息:", "纬度==============================" + latitude);

        return latitude;
    }

    public float getLongitude() {
        float longitude = (float) this.locationInfo.getLongitude();
        Log.e("定位信息:", "经度==============================" + longitude);

        return longitude;
    }

    public static void getWXRoomID() {
        final String jsCallStr = String.format("cc.dealWithWXInviteInfo(\"%s\");", wxinvite);
        System.out.println(jsCallStr);
        wxinvite = "";
        mainActive.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
            }
        });
    }

    public static void callWX() {
        if (api.isWXAppInstalled()) {
            Intent intent = new Intent(Intent.ACTION_MAIN);
            ComponentName cmp = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.LauncherUI");
            intent.addCategory(Intent.CATEGORY_LAUNCHER);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setComponent(cmp);
            mainActive.startActivity(intent);
        } else {
            Toast.makeText(mainActive, "微信未安装", Toast.LENGTH_SHORT).show();
        }
    }

    @TargetApi(Build.VERSION_CODES.KITKAT)
    private File saveBitmap(Bitmap bitmap) throws IOException {
        String cameraPath = SAVED_IMAGE_DIR_PATH + "head_" + System.currentTimeMillis() + ".jpg";
        File file = new File(cameraPath);
        if (!file.exists()) file.createNewFile();
        try (OutputStream out = new FileOutputStream(file)) {
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out);
        }
        return file;
    }

    private Bitmap getBitmap(Uri uri) {
        Bitmap image = null;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            try {
                ParcelFileDescriptor parcelFileDescriptor = mainActive.getContentResolver().openFileDescriptor(uri, "r");
                FileDescriptor fileDescriptor = parcelFileDescriptor.getFileDescriptor();
                image = BitmapFactory.decodeFileDescriptor(fileDescriptor);
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        } else {
            String path = uri.getPath();
            image = BitmapFactory.decodeFile(path);
        }
        return image;
    }

    /**
     * 裁剪图片方法实现
     *
     * @param uri
     */
    protected void startPhotoZoom(Uri uri, int degree) {
        if (uri == null) {
            Log.i("StartPhotoZoom", "The uri is not exist.");
            return;
        }
        Uri tempUri;
        Bitmap bm = getBitmap(uri);

        if (bm == null) {
            Log.i("StartPhotoZoom", "The uri bitmap is not exist.");
            return;
        }

        //修正可能存在的角度旋转
        if (degree != 0) {
            // 根据旋转角度，生成旋转矩阵
            Matrix matrix = new Matrix();
            matrix.postRotate(degree);
            try {
                // 将原始图片按照旋转矩阵进行旋转，并得到新的图片
                bm = Bitmap.createBitmap(bm, 0, 0, bm.getWidth(), bm.getHeight(), matrix, true);
            } catch (OutOfMemoryError e) {
            }
        }

        if (bm == null) {
            Log.i("StartPhotoZoom", "The uri bitmap is not exist.");
            return;
        }

        File faceFile = null;
        try {
            faceFile = saveBitmap(bm);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (faceFile == null) {
            Log.i("StartPhotoZoom", "The uri file is not exist.");
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            // Android 7.0 "file://" uri权限适配
            tempUri = FileProvider.getUriForFile(mainActive, "com.anglegame.blackjack.provider", faceFile);
            //		获取图片沙盒文件夹
            photoUri = FileProvider.getUriForFile(mainActive, "com.anglegame.blackjack.provider", new File(SAVED_IMAGE_DIR_PATH+ "cut_" + System.currentTimeMillis() + ".jpg"));
        } else {
            tempUri = Uri.fromFile(faceFile);
            photoUri = Uri.fromFile(new File(SAVED_IMAGE_DIR_PATH + "cut_" + System.currentTimeMillis() + ".jpg"));
        }

        Intent intent = new Intent("com.android.camera.action.CROP");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        intent.setDataAndType(tempUri, "image/*");
        // 设置裁剪
        intent.putExtra("crop", "true");
        // aspectX aspectY 是宽高的比例
        intent.putExtra("aspectX", 1);
        intent.putExtra("aspectY", 1);
        // outputX outputY 是裁剪图片宽高
        intent.putExtra("outputX", 132);
        intent.putExtra("outputY", 132);
        intent.putExtra("return-data", false);
        intent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
        intent.putExtra("outputFormat", Bitmap.CompressFormat.JPEG.toString());

        //给裁剪应用赋权
        List<ResolveInfo> resInfoList = mainActive.getPackageManager().queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
        for(ResolveInfo resolveInfo : resInfoList){
            String packageName = resolveInfo.activityInfo.packageName;
            mainActive.grantUriPermission(packageName, tempUri, Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            mainActive.grantUriPermission(packageName, photoUri, Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }

        mainActive.startActivityForResult(intent, PHOTO_RESOULT);
    }

    /**
     * 保存裁剪之后的图片数据
     *
     * @param data
     */
    protected void setImageToView(Intent data) {
        if(!SystemTool.isNetAvailable()){
            Log.e("UploadUtil error", "connection error 上传失败：无网络连接");
            final String jsCallStrError = String.format("cc.error(\"Android UploadUtil error connection error 上传失败：无网络连接\");");
            mainActive.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStrError);
                }
            });
            return;
        }
//        Bundle extras = data.getExtras();
//        if (extras != null) {
////            Bitmap photo = extras.getParcelable("data");
//            Uri uri = extras.getParcelable(MediaStore.EXTRA_OUTPUT);
//            Log.e("MySelf", String.valueOf(uri));
//            Bitmap photo = getBitmap(uri);
////            uploadPic(photo);
//        }
        Log.i("setImageToView", String.valueOf(photoUri));
        Bitmap photo = getBitmap(photoUri);
        uploadPic(photo);
    }

    private void uploadPic(Bitmap bitmap) {
        // 上传至服务器
        File imagePath = null;
        try {
            imagePath = UploadUtil.saveFile(bitmap, SAVED_IMAGE_DIR_PATH, String
                    .valueOf(System.currentTimeMillis()) + ".jpg");
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (imagePath != null) {
//            pd = ProgressDialog.show(this, "", "正在上传文件...");
//            pd.show();
            String fileKey = "image";
            UploadUtil uploadUtil = UploadUtil.getInstance();
            uploadUtil.setOnUploadProcessListener(GameAppActivity.this); //设置监听器监听上传状态

            Map<String, String> params = new HashMap<String, String>();//上传map对象
            params.put("data", upload_Data);
            uploadUtil.uploadFile(imagePath, fileKey, upload_URL, params);
//            Toast.makeText(this, "上传成功", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onUploadDone(int responseCode, String message) {
//        pd.dismiss();
//        Message msg = Message.obtain();
//        msg.what = UPLOAD_FILE_DONE;
//        msg.arg1 = responseCode;
//        msg.obj = message;

        switch (responseCode) {
            case UploadUtil.UPLOAD_SUCCESS_CODE:
                try {
                    JSONObject json = new JSONObject(message);
                    String code = json.getString("code");
                    String msg = json.getString("msg");
//                    String data = json.getString("data");
                    final String jsCallStr = String.format("cc.onChangeHeadCallBack(\"%s\",\"%s\");", code, msg);
                    mainActive.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                        }
                    });
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case UploadUtil.UPLOAD_FILE_NOT_EXISTS_CODE:
            case UploadUtil.UPLOAD_SERVER_ERROR_CODE:
            case UploadUtil.UPLOAD_URL_ERROR_CODE:
            case UploadUtil.UPLOAD_IO_ERROR_CODE:
//                Toast.makeText(this, message, Toast.LENGTH_LONG).show();
                Log.e("UploadUtil error", message);
                final String jsCallStrError = String.format("cc.error(\"Android UploadUtil error %s\");", message);
                mainActive.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString(jsCallStrError);
                    }
                });
                break;
        }
    }

    @Override
    public void onUploadProcess(int uploadSize) {
//        Message msg = Message.obtain();
//        msg.what = UPLOAD_IN_PROCESS;
//        msg.arg1 = uploadSize;
    }

    @Override
    public void initUpload(int fileSize) {
//        Message msg = Message.obtain();
//        msg.what = UPLOAD_INIT_PROCESS;
//        msg.arg1 = fileSize;
    }

    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults){
        PermissionsUtils.getInstance().onRequestPermissionsResult(mainActive, requestCode, permissions, grantResults);
    }
}
