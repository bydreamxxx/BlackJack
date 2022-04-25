package sdk;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import org.cocos2dx.javascript.service.SDKClass;
import org.cocos2dx.lib.Cocos2dxActivity;

public class GoogleSDK extends SDKClass {
    /**一键登录
    public SignInClient oneTapClient;
    public BeginSignInRequest signInRequest;
    private boolean showOneTapUI = true;
     */

    public GoogleSignInClient mGoogleSignInClient;

    private static final int REQ_ONE_TAP = 10000;  // Can be any integer unique to the Activity.

    public static GoogleSDK sdkApp = null;

    @Override
    public void init(Context context) {
        super.init(context);

        sdkApp = this;
        /**一键登录
        oneTapClient = Identity.getSignInClient(getContext());
        signInRequest = BeginSignInRequest.builder()
                .setPasswordRequestOptions(BeginSignInRequest.PasswordRequestOptions.builder()
                        .setSupported(true)
                        .build())
                .setGoogleIdTokenRequestOptions(BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
                        .setSupported(true)
                        // Your server's client ID, not your Android client ID.
                        .setServerClientId("209976438689")
                        // Only show accounts previously used to sign in.
                        .setFilterByAuthorizedAccounts(true)
                        .build())
                // Automatically sign in when exactly one credential is retrieved.
                .setAutoSelectEnabled(true)
                .build();
        */

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("209976438689-7cvf35mm6i6eh2ngm4000k2v3hdcjspb.apps.googleusercontent.com")
                .requestEmail()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(getContext(), gso);

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){
        super.onActivityResult(requestCode, resultCode, data);

        switch (requestCode) {
            case REQ_ONE_TAP:
                /**一键登录
                try {
                    SignInCredential credential = oneTapClient.getSignInCredentialFromIntent(data);
                    String idToken = credential.getGoogleIdToken();
                    String username = credential.getId();
                    String password = credential.getPassword();
                    if (idToken !=  null) {
                        // Got an ID token from Google. Use it to authenticate
                        // with your backend.
                        Log.d(TAG, "Got ID token.");
                    } else if (password != null) {
                        // Got a saved username and password. Use them to authenticate
                        // with your backend.
                        Log.d(TAG, "Got password.");
                    }
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
                }
                 */


                Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                try{
                    GoogleSignInAccount account = task.getResult(ApiException.class);
                    loginResult(account);
                }catch (ApiException e){
                    int code = e.getStatusCode();
                    Log.e("Google Login Error", "status: " + code);
                }

//                try{
//                    SignInCredential credential = Identity.getSignInClient(getContext()).getSignInCredentialFromIntent(data);
//                    loginResult(credential);
//                }catch(ApiException e){
//                    int code = e.getStatusCode();
//                    Log.e("Google Login Error", "status: " + code);
//                }
//                break;
        }
    }

    private void loginResult(GoogleSignInAccount account){
        String personName = account.getDisplayName();
        String personGivenName = account.getGivenName();
        String personFamilyName = account.getFamilyName();
        String personEmail = account.getEmail();
        String personId = account.getId();
        Uri personPhoto = account.getPhotoUrl();
        String idToken = account.getIdToken();
        Log.d("Google Login success","personName: "+personName+" personGivenName: "+personGivenName+" personFamilyName: "+personFamilyName+" personEmail: "+personEmail+" personId: "+personId+" idToken: "+idToken);
    }

/**
    private void loginResult(SignInCredential credential){
        String personName = credential.getDisplayName();
        String personGivenName = credential.getGivenName();
        String personFamilyName = credential.getFamilyName();
        String personId = credential.getId();
        Uri personPhoto = credential.getProfilePictureUri();
        String idToken = credential.getGoogleIdToken();
        Log.d("Google Login success","personName: "+personName+" personGivenName: "+personGivenName+" personFamilyName: "+personFamilyName+" personId: "+personId+" idToken: "+idToken);
    }
*/
    public void login(){
        /**一键登录
        oneTapClient.beginSignIn(signInRequest)
                .addOnSuccessListener(getContext(), new OnSuccessListener<BeginSignInResult>() {
                    @Override
                    public void onSuccess(BeginSignInResult result) {
                        try {
                            GameAppActivity.mainActive.startIntentSenderForResult(
                                    result.getPendingIntent().getIntentSender(), REQ_ONE_TAP,
                                    null, 0, 0, 0);
                        } catch (IntentSender.SendIntentException e) {
                            Log.e(TAG, "Couldn't start One Tap UI: " + e.getLocalizedMessage());
                        }
                    }
                })
                .addOnFailureListener(getContext(), new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        // No saved credentials found. Launch the One Tap sign-up flow, or
                        // do nothing and continue presenting the signed-out UI.
                        Log.e(TAG, e.getLocalizedMessage());
                    }
                });
         */


        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getContext());
        if(account != null){
            loginResult(account);
        }else{
            Intent signInIntent = mGoogleSignInClient.getSignInIntent();
            ((Cocos2dxActivity)getContext()).startActivityForResult(signInIntent, REQ_ONE_TAP);
        }

/**
        GetSignInIntentRequest request = GetSignInIntentRequest.builder()
                .setServerClientId("1004546939267-r220grgn1c07dpiq55bgrl7ja7b1m067.apps.googleusercontent.com")
                .build();
        Identity.getSignInClient(getContext())
                .getSignInIntent(request)
                .addOnSuccessListener(
                        result->{
                            try{
                                ((Cocos2dxActivity)getContext()).startIntentSenderForResult(result.getIntentSender(),
                                        REQ_ONE_TAP,null,0,0,0,null);
                            }catch (IntentSender.SendIntentException e){
                                Log.e("Google Intent Error", "status: " + e.getMessage());
                            }
                        })
                .addOnFailureListener(
                        e->{
                            Log.e("Google Intent failure", "status: " + e.getMessage());
                        });
 */
    }

    public static void googleLogin(){
        sdkApp.login();
    }
}
