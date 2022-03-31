package game;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;
import java.util.List;

public class PermissionsUtils {
    private final int mRequestCode = 100;
    public static boolean showSystemSetting = true;

    private PermissionsUtils(){

    }

    private static PermissionsUtils permissionsUtils;
    private IPermissionsResult mPermissionsResult;

    public static PermissionsUtils getInstance(){
        if(permissionsUtils == null){
            permissionsUtils = new PermissionsUtils();
        }
        return permissionsUtils;
    }

    public void checkPermissions(Activity context, String[] permissions, @NonNull IPermissionsResult permissionsResult){
        mPermissionsResult = permissionsResult;

        if(Build.VERSION.SDK_INT < Build.VERSION_CODES.M){
            permissionsResult.passPermissions();
            return;
        }

        List<String> mPermissionList = new ArrayList<>();
        for(int i = 0; i < permissions.length; i++){
            if(ContextCompat.checkSelfPermission(context, permissions[i]) != PackageManager.PERMISSION_GRANTED){
                mPermissionList.add(permissions[i]);
            }
        }

        if(mPermissionList.size() > 0){
            ActivityCompat.requestPermissions(context, permissions, mRequestCode);
        }else{
            permissionsResult.passPermissions();
            return;
        }
    }

    public void onRequestPermissionsResult(Activity context, int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults){
        boolean hasPermissionDismiss = false;
        if(mRequestCode == requestCode){
            for(int i = 0; i < grantResults.length; i++){
                if(grantResults[i] == PackageManager.PERMISSION_DENIED){
                    hasPermissionDismiss = true;
                    break;
                }
            }

            if(hasPermissionDismiss){
                if(showSystemSetting){
                    showSystemPermissionsSettingDialog(context);
                }else{
                    mPermissionsResult.forbitPermissions();
                }
            }else{
                mPermissionsResult.passPermissions();
            }
        }
    }

    AlertDialog mPermissionDialog;
    private void showSystemPermissionsSettingDialog(final Activity context){
        final String mPackName = context.getPackageName();
        if(mPermissionDialog == null){
            mPermissionDialog = new AlertDialog.Builder(context)
                    .setMessage("已禁用权限，请手动授予")
                    .setPositiveButton("设置", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            cancelPermissionDialog();

                            Uri packageURI = Uri.parse("package:" + mPackName);
                            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, packageURI);
                            context.startActivity(intent);
                            context.finish();
                        }
                    })
                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            cancelPermissionDialog();
                            mPermissionsResult.forbitPermissions();
                        }
                    })
                    .create();
        }
        mPermissionDialog.show();
    }

    private void cancelPermissionDialog(){
        if(mPermissionDialog != null){
            mPermissionDialog.cancel();
            mPermissionDialog = null;
        }
    }

    public interface IPermissionsResult{
        void passPermissions();
        void forbitPermissions();
    }
}
