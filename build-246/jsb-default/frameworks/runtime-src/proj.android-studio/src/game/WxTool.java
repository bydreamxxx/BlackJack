package game;

import android.content.Context;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;

import com.anglegame.blackjack.GameAppActivity;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;

//import com.tencent.mm.opensdk.modelmsg.SendAuth;
//import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
//import com.tencent.mm.opensdk.modelmsg.WXAppExtendObject;
//import com.tencent.mm.opensdk.modelmsg.WXImageObject;
//import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
//import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
//import com.tencent.mm.opensdk.modelpay.PayReq;


/**
 * Created by yons on 2018/1/12.
 */

public class WxTool {


    public static void SendWXAuthReq() {
//        Log.v("WX", "SendWXAuthReq");
//        final SendAuth.Req req = new SendAuth.Req();
//        req.scope = "snsapi_userinfo";
//        req.state = "laiyiquanyx";
//        boolean result = GameAppActivity.api.sendReq(req);
//        Log.v("WX", "wxapi.sendReq end. result=" + result);
    }

    public static void SendWXAppContent(String info, String title, String content) {
//        Log.v("WX", "info: " + info);
//        Log.v("WX", "title: " + title);
//        Log.v("WX", "content:" + content);
//
//        // send appdata with no attachment
//        WXAppExtendObject appdata = new WXAppExtendObject();
//        appdata.extInfo = info;
//        appdata.filePath = "/sdcard/role.png";
//
////		appdata.url = url;
////		appdata.fileData = new byte[2];
////		appdata.fileData[0] = 0;
////		appdata.fileData[1] = 0;
//
//        Log.v("WX", "appdata.checkArgs=" + appdata.checkArgs() + " appdata.type()=" + appdata.type());
//
//        final WXMediaMessage msg = new WXMediaMessage();
//        msg.title = title;
//        msg.description = content;
//        msg.mediaObject = appdata;
////		msg.messageExt = "";
////		msg.messageAction = "<action>dotaliTest</action>";
//
//        Log.v("WX", " msg.getType()=" + msg.getType());
//
//        SendMessageToWX.Req req = new SendMessageToWX.Req();
//        req.transaction = "appdata" + System.currentTimeMillis();
//        req.message = msg;
//        req.scene = SendMessageToWX.Req.WXSceneSession;
//
//        Log.v("WX", "SendMessageToWX >>> checkArgs=" + req.checkArgs() + " req.getType()=" + req.getType());
//
//        boolean result = GameAppActivity.api.sendReq(req);
//        Log.v("WX", "wxapi.sendReq end. result=" + result);
    }

    public static void SendLinkUrl(String url, String title, String content) {
//        WXWebpageObject webpage = new WXWebpageObject();
//        webpage.webpageUrl = url;
//        WXMediaMessage msg = new WXMediaMessage(webpage);
//        msg.title = title;
//        msg.description = content;
//        Bitmap bmp = BitmapFactory.decodeResource(GameAppActivity.mainActive.getResources(), R.mipmap.ic_launcher);
////		Bitmap thumb = BitmapFactory.decodeResource(app.getResources(), R.drawable.icon);
//        msg.thumbData = Util.bmpToByteArray(bmp, true);
//
//        SendMessageToWX.Req req = new SendMessageToWX.Req();
//        req.transaction = "" + System.currentTimeMillis();
//        req.message = msg;
//        req.scene = SendMessageToWX.Req.WXSceneSession;
//        GameAppActivity.api.sendReq(req);
    }

    public static void ShareLinkTimeline(String url, String title, String content) {
//        WXWebpageObject webpage = new WXWebpageObject();
//        webpage.webpageUrl = url;
//        WXMediaMessage msg = new WXMediaMessage(webpage);
//        msg.title = title;
//        msg.description = content;
//        Bitmap thumb = BitmapFactory.decodeResource(GameAppActivity.mainActive.getResources(), R.mipmap.ic_launcher);
//        // è¿éæ¿æ¢ä¸å¼ èªå·±å·¥ç¨éçå¾çèµæº
//        msg.setThumbImage(thumb);
//        SendMessageToWX.Req req = new SendMessageToWX.Req();
//        req.transaction = "" + System.currentTimeMillis();
//        req.message = msg;
//        req.scene = SendMessageToWX.Req.WXSceneTimeline;
//        GameAppActivity.api.sendReq(req);
    }

    public static void SendWXScreenshot(String imagePath, int where) {

//        try {
//            if (where < 0 || where > 1) {
//                Log.e("WX", "åäº«å¾çï¼0=å¥½åï¼ 1=æåå");
//                return;
//            }
//            //åå§å WXImageObject å WXImageObject å¯¹è±¡
//            BitmapFactory.Options options = new BitmapFactory.Options();
//            options.inSampleSize = 1;
////            options.inPreferredConfig = Bitmap.Config.RGB_565;
//            Bitmap bmp = BitmapFactory.decodeFile(imagePath, options);
//            WXImageObject imgObj = new WXImageObject(bmp);
//            WXMediaMessage msg = new WXMediaMessage();
//            msg.mediaObject = imgObj;
//
//
//
//            //è®¾ç½®ç¼©ç¥å¾
//            Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 150, 85, true);
//            bmp.recycle();
//
//            //压缩
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            thumbBmp.compress(Bitmap.CompressFormat.PNG, 100, baos);
//            int tmpOptions = 100;
//            while ( baos.toByteArray().length / 1024 > 32) {
//                baos.reset();
//                thumbBmp.compress(Bitmap.CompressFormat.JPEG, tmpOptions, baos);
//                tmpOptions -= 5;
//            }
//
//            ByteArrayInputStream isBm = new ByteArrayInputStream(baos.toByteArray());
//            Bitmap bitmap = BitmapFactory.decodeStream(isBm, null, options);
//
//            msg.thumbData = Util.bmpToByteArray(bitmap, true);
//            //æé ä¸ä¸ª req
//            SendMessageToWX.Req req = new SendMessageToWX.Req();
//            req.transaction = buildTransaction("img");//"img"+String.valueOf(System.currentTimeMillis());
//            req.message = msg;
//            req.scene = where;
//            GameAppActivity.api.sendReq(req);
//        } catch (Exception e) {
//            Log.e("WX", e.toString());
//        }
    }

    private static String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    public static void JumpToWeixinPay(String partnerId, String prepayId, String nonceStr,
                                       String timeStamp, String packageVal, String sign) {
//        PayReq request = new PayReq();
//        request.appId = GameAppActivity.APP_ID;
//        request.partnerId = partnerId;
//        request.prepayId = prepayId;
//        request.packageValue = packageVal;
//        request.nonceStr = nonceStr;
//        request.timeStamp = timeStamp;
//        request.sign = sign;
//        GameAppActivity.api.sendReq(request);
    }

    public static boolean IsWXAppInstalled() {
//        boolean sIsWXAppInstalledAndSupported = GameAppActivity.api.isWXAppInstalled();
        return false;
    }

    public static void copyFile(String oldPath, String newPath) {
        try {
            int bytesum = 0;
            int byteread = 0;
            File oldfile = new File(oldPath);
            if (oldfile.exists()) { //文件存在时
                InputStream inStream = new FileInputStream(oldPath); //读入原文件
                FileOutputStream fs = new FileOutputStream(newPath);
                byte[] buffer = new byte[1444];
                int length;
                while ( (byteread = inStream.read(buffer)) != -1) {
                    bytesum += byteread; //字节数 文件大小
                    System.out.println(bytesum);
                    fs.write(buffer, 0, byteread);
                }
                inStream.close();
            }
        }
        catch (Exception e) {
            System.out.println("复制单个文件操作出错");
            e.printStackTrace();

        }

    }

    public static void SaveFileToPhoto(String path) {

//// 首先保存图片
//        File appDir = new File(Environment.getExternalStorageDirectory(), "QRCode");
//        if (!appDir.exists()) {
//            appDir.mkdir();
//        }
        Context context = GameAppActivity.mainActive.getContext();
        String[] names = path.split("/");
        String fileName = names[names.length -1];
//        copyFile(path,appDir.toString() + "/" + fileName);

        // 其次把文件插入到系统图库
        String bitPath = "";
        String ttPath = "";
        try {
            bitPath = MediaStore.Images.Media.insertImage(context.getContentResolver(),
                    path, fileName, null);
            ttPath = ImageUtils.getRealPathFromUri(context,Uri.parse(bitPath));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        if(ttPath == null)
            return;
        // 最后通知图库更新
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) { // 判断SDK版本是不是4.4或者高于4.4
            String[] paths = new String[]{ttPath};
            MediaScannerConnection.scanFile(context, paths, null, null);
        } else {
            final Intent intent;
            intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            File  file = new File(ttPath);
            intent.setData(Uri.fromFile(file));
            context.sendBroadcast(intent);
        }
    }


}
