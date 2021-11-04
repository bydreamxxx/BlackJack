package game;

import android.content.Context;
import android.content.SharedPreferences;

import com.anglegame.blackjack.AppActivity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shen on 2017/9/5.
 */

public class Preference {
    private static Context context;
    private static AppActivity activity;
    private static final String KEY_USER_ACCOUNT = "account";
    private static final String KEY_USER_TOKEN = "token";
    private static final List<String> users = new ArrayList<String>();

    public static void setActivity(AppActivity activity){
        Preference.activity = activity;
    }

    public static AppActivity getActivity(){
        return Preference.activity;
    }

    public static void setContext(Context context) {
//        Preference.context = context.getApplicationContext();
        Preference.context = context;
    }

    public static Context getContext(){
        return Preference.context;
    }

    public static void saveUserAccount(String account) {
        saveString(KEY_USER_ACCOUNT, account);
    }

    public static String getUserAccount() {
        return getString(KEY_USER_ACCOUNT);
    }

    public static void saveUserToken(String token) {
        saveString(KEY_USER_TOKEN, token);
    }

    public static String getUserToken() {
        return getString(KEY_USER_TOKEN);
    }

    private static void saveString(String key, String value) {
        SharedPreferences.Editor editor = getSharedPreferences().edit();
        editor.putString(key, value);
        editor.commit();
    }

    private static String getString(String key) {
        return getSharedPreferences().getString(key, null);
    }

    public static SharedPreferences getSharedPreferences() {
        return Preference.context.getSharedPreferences("im_data", Context.MODE_PRIVATE);
    }

    public static void addUser(String account){
        Preference.users.add(account);
    }

    public static void removeUser(String account){
        Preference.users.remove(account);
    }

    public static void clearUser(){
        Preference.users.clear();
    }

    public static List<String> getUsers(){
        return Preference.users;
    }
}
