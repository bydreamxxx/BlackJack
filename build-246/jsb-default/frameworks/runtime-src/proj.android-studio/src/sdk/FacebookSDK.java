//package sdk;
//
//import android.content.Context;
//import android.content.Intent;
//
//import com.anglegame.blackjack.GameAppActivity;
//import com.facebook.CallbackManager;
//import com.facebook.FacebookCallback;
//import com.facebook.FacebookException;
//import com.facebook.login.LoginManager;
//import com.facebook.login.LoginResult;
//
//import org.cocos2dx.javascript.service.SDKClass;
//
//import java.util.Arrays;
//
//public class FacebookSDK extends SDKClass {
//    public static FacebookSDK sdkApp = null;
//
//    public CallbackManager callbackManager;
//
//    @Override
//    public void init(Context context) {
//        super.init(context);
//
//        sdkApp = this;
//
//        callbackManager = CallbackManager.Factory.create();
//        LoginManager.getInstance().registerCallback(callbackManager,
//                new FacebookCallback<LoginResult>() {
//                    @Override
//                    public void onSuccess(LoginResult loginResult) {
//                        // App code
//                    }
//
//                    @Override
//                    public void onCancel() {
//                        // App code
//                    }
//
//                    @Override
//                    public void onError(FacebookException exception) {
//                        // App code
//                    }
//                });
//    }
//
//    @Override
//    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//        callbackManager.onActivityResult(requestCode, resultCode, data);
//        super.onActivityResult(requestCode, resultCode, data);
//    }
//
//    public static void facebookLogin(){
//        LoginManager.getInstance().logInWithReadPermissions(GameAppActivity.mainActive, Arrays.asList("public_profile"));
//    }
//}
