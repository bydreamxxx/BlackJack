package sdk;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.SkuDetails;
import com.android.billingclient.api.SkuDetailsParams;
import com.android.billingclient.api.SkuDetailsResponseListener;

import org.cocos2dx.javascript.service.SDKClass;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.util.ArrayList;
import java.util.List;

public class GooglePay extends SDKClass {
    public static GooglePay sdkApp = null;
    private BillingClient billingClient = null;


    @Override
    public void init(Context context) {
        super.init(context);

        sdkApp = this;

        billingClient = BillingClient.newBuilder(getContext())
                .setListener(new PurchasesUpdatedListener() {
                    @Override
                    public void onPurchasesUpdated(@NonNull BillingResult billingResult, @Nullable List<Purchase> list) {
                        if (billingResult == null) {
                            Log.wtf("Google Pay Super Error", "onPurchasesUpdated: null BillingResult");
                            return;
                        }

                        int responseCode = billingResult.getResponseCode();
                        String debugMessage = billingResult.getDebugMessage();

                        switch(responseCode){
                            case BillingClient.BillingResponseCode.OK:
                                payResult(list);
                                break;
                            case BillingClient.BillingResponseCode.USER_CANCELED:
                                Log.i("Google Pay Error", "onPurchasesUpdated: User canceled the purchase");
                                break;
                            case BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED:
                                Log.i("Google Pay Error", "onPurchasesUpdated: The user already owns this item");
                                break;
                            case BillingClient.BillingResponseCode.DEVELOPER_ERROR:
                                Log.e("Google Pay Error", "onPurchasesUpdated: Developer error means that Google Play " +
                                        "does not recognize the configuration. If you are just getting started, " +
                                        "make sure you have configured the application correctly in the " +
                                        "Google Play Console. The SKU product ID must match and the APK you " +
                                        "are using must be signed with release keys."
                                );
                                break;
                        }
                    }
                })
                .enablePendingPurchases()
                .build();

        if(!billingClient.isReady()){
            connectToGooglePlay();
        }
    }

    private void connectToGooglePlay(){
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingServiceDisconnected() {
                // Try to restart the connection on the next request to
                // Google Play by calling the startConnection() method.
                Log.d("Google Pay ConnectError", "onBillingServiceDisconnected");
                connectToGooglePlay();
            }

            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if(billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK){
                    // The BillingClient is ready. You can query purchases here.
                    queryPurchases();
                }
            }
        });
    }

    private void getSkuList(String goodsId, String mOrderId){
        List<String> skuList = new ArrayList<>();
        skuList.add(goodsId);

        SkuDetailsParams params = SkuDetailsParams.newBuilder()
                .setSkusList(skuList)
                .setType(BillingClient.SkuType.INAPP)
                .build();
        billingClient.querySkuDetailsAsync(params, new SkuDetailsResponseListener() {
            @Override
            public void onSkuDetailsResponse(@NonNull BillingResult billingResult, @Nullable List<SkuDetails> list) {
                if(billingResult == null){
                    Log.wtf("Google Pay Super Error", "onSkuDetailsResponse: null BillingResult");
                    return;
                }

                int responseCode = billingResult.getResponseCode();
                String debugMessage = billingResult.getDebugMessage();
                switch(responseCode){
                    case BillingClient.BillingResponseCode.OK:
                        if(list != null){
                            for(SkuDetails skuDetails : list){
                                if(goodsId.equals(skuDetails.getSku())){
                                    googlePay(mOrderId, skuDetails);
                                }
                            }
                        }
                        break;
                    case BillingClient.BillingResponseCode.SERVICE_DISCONNECTED:
                    case BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE:
                    case BillingClient.BillingResponseCode.BILLING_UNAVAILABLE:
                    case BillingClient.BillingResponseCode.ITEM_UNAVAILABLE:
                    case BillingClient.BillingResponseCode.DEVELOPER_ERROR:
                    case BillingClient.BillingResponseCode.ERROR:
                        Log.e("Google Pay Error", "onSkuDetailsResponse: " + responseCode + " " + debugMessage);
                        break;
                    case BillingClient.BillingResponseCode.USER_CANCELED:
                        Log.i("Google Pay Error", "onSkuDetailsResponse: " + responseCode + " " + debugMessage);
                        break;
                    // These response codes are not expected.
                    case BillingClient.BillingResponseCode.FEATURE_NOT_SUPPORTED:
                    case BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED:
                    case BillingClient.BillingResponseCode.ITEM_NOT_OWNED:
                    default:
                        Log.wtf("Google Pay Super Error", "onSkuDetailsResponse: " + responseCode + " " + debugMessage);
                }
            }
        });
    }

    private void googlePay(String mOrderId, SkuDetails skuDetails){
        if(billingClient.isReady()){
            BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                    .setSkuDetails(skuDetails)
                    .setObfuscatedAccountId(mOrderId)
                    .build();
            int responseCode = billingClient.launchBillingFlow((Cocos2dxActivity)getContext(), flowParams).getResponseCode();
            if(responseCode != BillingClient.BillingResponseCode.OK){
                Log.e("Google Pay Error", "errorState:" + responseCode);
            }
        }else{
            Log.e("Google Pay Error", "Not Connected to Google Play");
        }
    }

    private void payResult(List<Purchase> purchaselist){
        if(purchaselist != null){
            for(Purchase purchase: purchaselist){
                if(purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED){
                    String developerPayLoad = purchase.getDeveloperPayload();
                    String orderId = purchase.getOrderId();
                    String originalJson = purchase.getOriginalJson();
                    String packageName = purchase.getPackageName();
                    int purchaseState = purchase.getPurchaseState();
                    long purchaseTime = purchase.getPurchaseTime();
                    String purchaseToken = purchase.getPurchaseToken();
                    String signature = purchase.getSignature();
                    ArrayList<String> sku = purchase.getSkus();

//                    if(!purchase.isAcknowledged()){//订阅
                        ConsumeParams acknowledgePurchaseParams = ConsumeParams.newBuilder()
                                .setPurchaseToken(purchase.getPurchaseToken())
                                .build();

                        billingClient.consumeAsync(acknowledgePurchaseParams, new ConsumeResponseListener() {
                            @Override
                            public void onConsumeResponse(@NonNull BillingResult billingResult, @NonNull String s) {
                                if(billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK){
                                    final String jsCallStrError = String.format("cc.googlePayCallBack();");
                                    ((Cocos2dxActivity)getContext()).runOnGLThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            Cocos2dxJavascriptJavaBridge.evalString(jsCallStrError);
                                        }
                                    });
                                }
                            }
                        });
//                    }
                }
            }
        }
    }

    private void queryPurchases(){
        if(billingClient.isReady()){
            billingClient.queryPurchasesAsync(BillingClient.SkuType.INAPP, new PurchasesResponseListener() {
                @Override
                public void onQueryPurchasesResponse(@NonNull BillingResult billingResult, @NonNull List<Purchase> list) {
                    payResult(list);
                }
            });
        }
    }

    public static void pay(String goodsId, String mOrderId){
        sdkApp.getSkuList(goodsId, mOrderId);
    }
}
