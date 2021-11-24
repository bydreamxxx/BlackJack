package game;

import android.app.Activity;


/**
 * Created by shen on 2017/10/23.
 */

public class PicturePick extends Activity{

    public static void openAlbum(String jsonData, String uploadURL){
        Preference.getActivity().openAlbum(jsonData, uploadURL);
    }

    public static void takePhoto(String jsonData, String uploadURL){
        Preference.getActivity().takePhoto(jsonData, uploadURL);
    }

}
