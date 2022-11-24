package sdk;

import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.util.Log;

import com.google.android.gms.auth.api.identity.BeginSignInRequest;
import com.google.android.gms.auth.api.identity.BeginSignInResult;
import com.google.android.gms.auth.api.identity.Identity;
import com.google.android.gms.auth.api.identity.SignInClient;
import com.google.android.gms.auth.api.identity.SignInCredential;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

import org.cocos2dx.javascript.service.SDKClass;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public class GoogleSDK extends SDKClass {
    private static final int REQ_ONE_TAP = 10000;  // Can be any integer unique to the Activity.
    private final String SCID = "209976438689-7cvf35mm6i6eh2ngm4000k2v3hdcjspb.apps.googleusercontent.com";
    private final String TAG = "Google Login";

    public static GoogleSDK sdkApp = null;

    private GoogleOneTap oneTap = new GoogleOneTap();
//    private GoogleSignInOld signInOld = new GoogleSignInOld();
//    private GoogleSignInNew signInNew = new GoogleSignInNew();

    @Override
    public void init(Context context) {
        super.init(context);
        System.out.print("Google Login init \n");
        Log.e(TAG, "init");

        sdkApp = this;
        oneTap.init(context);
//        signInOld.init(context);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){
        System.out.print("Google Login requestCode"+requestCode+"\n");
        oneTap.onActivityResult(requestCode, resultCode, data);
//        signInOld.onActivityResult(requestCode, resultCode, data);
//        signInNew.onActivityResult(requestCode, resultCode, data);
    }

    public void login(){
        oneTap.login();
//        signInOld.login();
//        signInNew.login();
    }

    public void googleLoginResult(String idToken){
        if(idToken != null){
            Log.e(TAG, "success idToken: "+idToken);

            final String jsCallStrError = String.format("cc.googleLoginCallBack(%d, \"%s\");", 0, idToken);
            ((Cocos2dxActivity)getContext()).runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStrError);
                }
            });
        }else{
            final String jsCallStrError = String.format("cc.googleLoginCallBack(%d, \"\");", 1);
            ((Cocos2dxActivity)getContext()).runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStrError);
                }
            });
        }
    }

    public static void googleLogin(){
        sdkApp.login();
    }

    private class GoogleOneTap{
        public SignInClient oneTapClient;
        public BeginSignInRequest signInRequest;
        private boolean showOneTapUI = true;

        public void init(Context context) {
            oneTapClient = Identity.getSignInClient(getContext());
            signInRequest = BeginSignInRequest.builder()
                    .setPasswordRequestOptions(BeginSignInRequest.PasswordRequestOptions.builder()
                            .setSupported(true)
                            .build())
                    .setGoogleIdTokenRequestOptions(BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
                            .setSupported(true)
                            // Your server's client ID, not your Android client ID.
                            .setServerClientId(SCID)
                            // Only show accounts previously used to sign in.
                            .setFilterByAuthorizedAccounts(true)
                            .build())
                    // Automatically sign in when exactly one credential is retrieved.
                    .setAutoSelectEnabled(true)
                    .build();
        }

        public void login(){
            oneTapClient.beginSignIn(signInRequest)
                    .addOnSuccessListener((Cocos2dxActivity) getContext(), new OnSuccessListener<BeginSignInResult>() {
                        @Override
                        public void onSuccess(BeginSignInResult result) {
                            try {
                                ((Cocos2dxActivity)getContext()).startIntentSenderForResult(
                                        result.getPendingIntent().getIntentSender(), REQ_ONE_TAP,
                                        null, 0, 0, 0);
                            } catch (IntentSender.SendIntentException e) {
                                Log.e(TAG, "Couldn't start One Tap UI: " + e.getLocalizedMessage());
                                googleLoginResult(null);
                            }
                        }
                    })
                    .addOnFailureListener((Cocos2dxActivity) getContext(), new OnFailureListener() {
                        @Override
                        public void onFailure(Exception e) {
                            // No saved credentials found. Launch the One Tap sign-up flow, or
                            // do nothing and continue presenting the signed-out UI.
                            Log.e(TAG, e.getLocalizedMessage());
                            googleLoginResult(null);
                        }
                    });
        }

        public void onActivityResult(int requestCode, int resultCode, Intent data){
            switch (requestCode) {
                case REQ_ONE_TAP:
                    try {
                        SignInCredential credential = oneTapClient.getSignInCredentialFromIntent(data);
                        String idToken = credential.getGoogleIdToken();
//                        String username = credential.getId();
//                        String password = credential.getPassword();
//                        if (idToken !=  null) {
//                            // Got an ID token from Google. Use it to authenticate
//                            // with your backend.
//                            Log.d(TAG, "Got ID token.");
//                        } else if (password != null) {
//                            // Got a saved username and password. Use them to authenticate
//                            // with your backend.
//                            Log.d(TAG, "Got password.");
//                        }
                        googleLoginResult(idToken);
                    } catch (ApiException e) {
                        switch (e.getStatusCode()) {
                            case CommonStatusCodes.CANCELED:
                                Log.e(TAG, "One-tap dialog was closed.");
                                // Don't re-prompt the user.
                                showOneTapUI = false;
                                break;
                            case CommonStatusCodes.NETWORK_ERROR:
                                Log.e(TAG, "One-tap encountered a network error.");
                                // Try again or just ignore.
                                break;
                            default:
                                Log.e(TAG, "Couldn't get credential from result."
                                        + e.getLocalizedMessage());
                                break;
                        }
                        googleLoginResult(null);
                    }
                    break;
            }
        }
    }
/**
    private class GoogleSignInOld{
        public GoogleSignInClient mGoogleSignInClient;

        public void init(Context context) {
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(SCID)
                    .requestEmail()
                    .build();
            mGoogleSignInClient = GoogleSignIn.getClient(getContext(), gso);
        }

        public void login(){
            GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getContext());
            if(account != null){
                loginResult(account);
            }else{
                Intent signInIntent = mGoogleSignInClient.getSignInIntent();
                ((Cocos2dxActivity)getContext()).startActivityForResult(signInIntent, REQ_ONE_TAP);
            }
        }

        public void onActivityResult(int requestCode, int resultCode, Intent data){
            switch (requestCode) {
                case REQ_ONE_TAP:
                    Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                    try{
                        GoogleSignInAccount account = task.getResult(ApiException.class);
                        loginResult(account);
                    }catch (ApiException e){
                        int code = e.getStatusCode();
                        System.out.print("Google Login Error"+"status: " + code);
                        loginResult(null);
                    }

                    break;
            }
        }

        private void loginResult(GoogleSignInAccount account){
            System.out.print("Google Login Result"+String.valueOf((account != null))+"\n");

            if(account != null){
//            String personName = account.getDisplayName();
//            String personGivenName = account.getGivenName();
//            String personFamilyName = account.getFamilyName();
//            String personEmail = account.getEmail();
//            String personId = account.getId();
//            Uri personPhoto = account.getPhotoUrl();
                String idToken = account.getIdToken();
//            Log.d("Google Login success","personName: "+personName+" personGivenName: "+personGivenName+" personFamilyName: "+personFamilyName+" personEmail: "+personEmail+" personId: "+personId+" idToken: "+idToken);

                googleLoginResult(idToken);
            }else{
                googleLoginResult(null);
            }
        }
    }
*/
/**
    private class GoogleSignInNew{
        public void login(){
            GetSignInIntentRequest request = GetSignInIntentRequest.builder()
                    .setServerClientId(SCID)
                    .build();
            Identity.getSignInClient(getContext())
                    .getSignInIntent(request)
                    .addOnSuccessListener(
                            result->{
                                try{
                                    ((Cocos2dxActivity)getContext()).startIntentSenderForResult(result.getIntentSender(),
                                            REQ_ONE_TAP,null,0,0,0,null);
                                }catch (IntentSender.SendIntentException e){
                                    Log.e(TAG, "error status: " + e.getMessage());
                                }
                            })
                    .addOnFailureListener(
                            e->{
                                Log.e(TAG, "fail status: " + e.getMessage());
                            });
        }

        public void onActivityResult(int requestCode, int resultCode, Intent data){
            switch (requestCode) {
                case REQ_ONE_TAP:
                    try{
                        SignInCredential credential = Identity.getSignInClient(getContext()).getSignInCredentialFromIntent(data);
                        loginResult(credential);
                    }catch(ApiException e){
                        int code = e.getStatusCode();
                        Log.e(TAG, "result error status: " + code);
                    }
                    break;
            }
        }

        private void loginResult(SignInCredential credential){
            if(credential != null){
//                String personName = credential.getDisplayName();
//                String personGivenName = credential.getGivenName();
//                String personFamilyName = credential.getFamilyName();
//                String personId = credential.getId();
//                Uri personPhoto = credential.getProfilePictureUri();
                String idToken = credential.getGoogleIdToken();
//            Log.d("Google Login success","personName: "+personName+" personGivenName: "+personGivenName+" personFamilyName: "+personFamilyName+" personId: "+personId+" idToken: "+idToken);

                googleLoginResult(idToken);
            }else {
                googleLoginResult(null);
            }
        }
    }
 */
}