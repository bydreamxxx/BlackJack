package game;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.res.Resources;
import android.graphics.Point;
import android.os.Build;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.widget.TextView;

import com.anglegame.blackjack.AppActivity;
import com.anglegame.blackjack.R;

import java.lang.reflect.Method;

/**
 * Created by yons on 2017/9/7.
 */

public class LoadingAnimation {

    final String TAG = "LoadingAnimation";

    TextView _tips;
    View _content;
    View _smallMask;
    View _circle;

    public LoadingAnimation(Context context) {
        _content = View.inflate(context, R.layout.dialogui_loading_vertical, null);
        _smallMask = _content.findViewById(R.id.small_mask);
        _circle = _content.findViewById(R.id.pb_bg);
        _tips = (TextView) _content.findViewById(R.id.dialogui_tv_msg);

        float screen_width = 0.0f;
        float screen_height = 0.0f;

        int ver = Build.VERSION.SDK_INT;
        Log.d(TAG,"安卓系统版本 "+ver);
        if(ver>=17){
            Display display = AppActivity.app.getWindowManager().getDefaultDisplay();
            DisplayMetrics dm = new DisplayMetrics();
            Class c;
            try {
                c = Class.forName("android.view.Display");
                Method method = c.getMethod("getRealMetrics",DisplayMetrics.class);
                method.invoke(display, dm);
            }catch(Exception e){
                e.printStackTrace();
            }
            Log.d(TAG,"屏幕分辨率 "+dm.toString());
            screen_width = dm.widthPixels;
            screen_height = dm.heightPixels;
        }else{
            Point point = new Point();
            AppActivity.app.getWindowManager().getDefaultDisplay().getSize(point);
            Log.d(TAG,"屏幕分辨率 "+point.toString());
            screen_width = point.x;
            screen_height = point.y;
        }

        //分辨率适配
        float scale_width = screen_width/1280;
        float scale_height = screen_height/720;
        float scale_min = scale_width<scale_height ? scale_width : scale_height;
        Log.d(TAG,"缩放最小比率"+scale_min);

        _smallMask.setScaleX(scale_min);
        _smallMask.setScaleY(scale_min);
        _circle.setScaleX(scale_min);
        _circle.setScaleY(scale_min);
        _tips.setScaleX(scale_min);
        _tips.setScaleY(scale_min);
    }

    //获取是否存在NavigationBar
    public static boolean checkDeviceHasNavigationBar(Context context) {
        boolean hasNavigationBar = false;
        Resources rs = context.getResources();
        int id = rs.getIdentifier("config_showNavigationBar", "bool", "android");
        if (id > 0) {
            hasNavigationBar = rs.getBoolean(id);
        }
        try {
            Class systemPropertiesClass = Class.forName("android.os.SystemProperties");
            Method m = systemPropertiesClass.getMethod("get", String.class);
            String navBarOverride = (String) m.invoke(systemPropertiesClass, "qemu.hw.mainkeys");
            if ("1".equals(navBarOverride)) {
                hasNavigationBar = false;
            } else if ("0".equals(navBarOverride)) {
                hasNavigationBar = true;
            }
        } catch (Exception e) {

        }
        return hasNavigationBar;

    }

    public View getContent(){
        return _content;
    }

    public void startLoadingAni(final String content){
        _content.setVisibility(View.VISIBLE);

        float screen_width = 0.0f;
        float screen_height = 0.0f;

        int ver = Build.VERSION.SDK_INT;
        Log.d(TAG,"安卓系统版本 "+ver);
        if(ver>=17){
            Display display = AppActivity.app.getWindowManager().getDefaultDisplay();
            DisplayMetrics dm = new DisplayMetrics();
            Class c;
            try {
                c = Class.forName("android.view.Display");
                Method method = c.getMethod("getRealMetrics",DisplayMetrics.class);
                method.invoke(display, dm);
            }catch(Exception e){
                e.printStackTrace();
            }
            Log.d(TAG,"屏幕分辨率 "+dm.toString());
            screen_width = dm.widthPixels;
            screen_height = dm.heightPixels;
        }else{
            Point point = new Point();
            AppActivity.app.getWindowManager().getDefaultDisplay().getSize(point);
            Log.d(TAG,"屏幕分辨率 "+point.toString());
            screen_width = point.x;
            screen_height = point.y;
        }

        float scale_width = 0;
        float scale_height = 0;
        float scale_min = 0;

        if (AppActivity.app.getRequestedOrientation() != ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
            scale_width = screen_width/1280;
            scale_height = screen_height/720;
            scale_min = scale_width<scale_height ? scale_width : scale_height;
        }else{
            scale_width = screen_width/720;
            scale_height = screen_height/1280;
            scale_min = scale_width<scale_height ? scale_width : scale_height;
        }
        Log.d(TAG,"缩放最小比率"+scale_min);

        _smallMask.setScaleX(scale_min);
        _smallMask.setScaleY(scale_min);
        _circle.setScaleX(scale_min);
        _circle.setScaleY(scale_min);
        _tips.setScaleX(scale_min);
        _tips.setScaleY(scale_min);


        setTips(content);
    }

    public void stopLoadingAni(){
        _content.setVisibility(View.GONE);
    }

    public void setTips(final String content){
        _tips.setText(content);
    }

}
