package game;

import android.app.ActivityManager;
import android.content.Context;
import android.media.MediaPlayer;
import android.text.TextUtils;

import java.io.File;
import java.io.IOException;

/**
 * Created by shen on 2017/9/5.
 */

public class SystemUtil {
    /**
     * 获取当前进程名
     * @param context
     * @return 进程名
     */
    public static final String getProcessName(Context context) {
        String processName = null;

        // ActivityManager
        ActivityManager am = ((ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE));

        while (true) {
            for (ActivityManager.RunningAppProcessInfo info : am.getRunningAppProcesses()) {
                if (info.pid == android.os.Process.myPid()) {
                    processName = info.processName;

                    break;
                }
            }

            // go home
            if (!TextUtils.isEmpty(processName)) {
                return processName;
            }

            // take a rest and again
            try {
                Thread.sleep(100L);
            } catch (InterruptedException ex) {
                ex.printStackTrace();
            }
        }
    }

    /**
     * 删除文件
     * @param filePath
     * @return
     */
    public static boolean deleteFile(String filePath){
        File file = new File(filePath);
        if (file.isFile() && file.exists()) {
            return file.delete();
        }
        return false;
    }

    /**
     * 获取音频时长
     * @param filePath
     * @return
     */
    public static double getAudioDuration(String filePath){
        MediaPlayer player = new MediaPlayer();
        try {
            player.setDataSource(filePath);
            player.prepare();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        double duration= player.getDuration();
        player.release();
        return duration;
    }
}
