/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "RootViewController.h"
#import "cocos2d.h"

#include "platform/CCApplication.h"
#include "platform/ios/CCEAGLView-ios.h"
#import "LoadingAnimation.h"
#import "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#import "SystemTool.h"
#import "Reachability.h"
#import "AFHTTPSessionManager.h"
#import "JavaScriptCaller.h"

using namespace cocos2d;

@implementation RootViewController

/*
// The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
// Custom initialization
}
return self;
}
*/

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Initialize the CCEAGLView
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [UIScreen mainScreen].bounds
                                         pixelFormat: (__bridge NSString *)cocos2d::GLViewImpl::_pixelFormat
                                         depthFormat: cocos2d::GLViewImpl::_depthFormat
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: NO
                                     numberOfSamples: 0 ];
    // Enable or disable multiple touches
    [eaglView setMultipleTouchEnabled:YES];
    // Set EAGLView as view of RootViewController
    self.view = eaglView;
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reachabilityChanged:) name:kReachabilityChangedNotification object:nil];
    [[Reachability reachabilityForInternetConnection] startNotifier];
}

- (void)dealloc
{
    [super dealloc];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:kReachabilityChangedNotification object:nil];
}
- (void) reachabilityChanged:(NSNotification *)note
{
    int connect_type = 0;
    if([SystemTool isNetAvailable]){
        connect_type = 1;
    }
    std::string jsCallStr = cocos2d::StringUtils::format("cc.networkChanged(\"%d\");", connect_type);
    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        });
    }
}
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    // 添加观察者
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    // 移除观察者
    [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
    return self.interfaceOrientation;
}

// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return self.interfaceOrientationMask ;
}
#endif
- (BOOL)setLandscape{
    if (self.interfaceOrientation != UIInterfaceOrientationLandscapeRight) {
        self.interfaceOrientation = UIInterfaceOrientationLandscapeRight;
        self.interfaceOrientationMask = UIInterfaceOrientationMaskLandscape;
        //设置屏幕的转向为横屏
        NSLog(@"设置横屏");
        [[UIDevice currentDevice] setValue:@(UIDeviceOrientationLandscapeLeft) forKey:@"orientation"];
        [UIViewController attemptRotationToDeviceOrientation];
        return true;
    }
    return false;
}

- (BOOL)setPortrait{
    if (self.interfaceOrientation != UIInterfaceOrientationPortrait) {
        self.interfaceOrientation = UIInterfaceOrientationPortrait;
        self.interfaceOrientationMask = UIInterfaceOrientationMaskPortrait;
        //设置屏幕的转向为横屏
        NSLog(@"设置竖屏");
        [[UIDevice currentDevice] setValue:@(UIDeviceOrientationPortrait) forKey:@"orientation"];
        [UIViewController attemptRotationToDeviceOrientation];
        return true;
    }
    return false;
}
- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];
    auto glview = cocos2d::Director::getInstance()->getOpenGLView();
    if (glview)
    {
        CCEAGLView *eaglview = (__bridge CCEAGLView *)glview->getEAGLView();
        if (eaglview)
        {
            CGSize s = CGSizeMake([eaglview getWidth], [eaglview getHeight]);
            cocos2d::Application::getInstance()->applicationScreenSizeChanged((int) s.width, (int) s.height);
        }
    }
}
//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

- (void) startLoadingAni:(NSString *)content{
    CGRect rect_screen = [[UIScreen mainScreen]bounds];
    NSLog(@"屏幕大小 %@",NSStringFromCGRect(rect_screen));
    if (loadingAni == nil) {
        loadingAni = [[LoadingAnimation alloc]initWithFrame:CGRectMake(rect_screen.size.width/2, rect_screen.size.height/2, 1, 1)];
        [self.view addSubview:loadingAni];
    }
    loadingAni.frame = CGRectMake(rect_screen.size.width/2, rect_screen.size.height/2, 1, 1);
    loadingAni.hidden = false;
    [loadingAni setTips:content withOrientation:self.interfaceOrientation];
    self.view.userInteractionEnabled = false;
}

- (void) stopLoadingAni{
    if (loadingAni != nil) {
        loadingAni.hidden = true;
    }
    self.view.userInteractionEnabled = true;
}
- (void) setLoadingAniTips:(NSString *)content{
    if (loadingAni != nil) {
        [loadingAni setTips:content withOrientation:self.interfaceOrientation];
    }
}
#pragma mark 内购
-(void)inAppPay:(NSString*)product_id{
    if([SKPaymentQueue canMakePayments]){
        // productID就是你在创建购买项目时所填写的产品ID
        selectProductID = [NSString stringWithFormat:@"%@",product_id];
        [self requestProductID:selectProductID];
    }else{
        // NSLog(@"不允许程序内付费");
        UIAlertView *alertError = [[UIAlertView alloc] initWithTitle:@"温馨提示"
                                                             message:@"请先开启应用内付费购买功能。"
                                                            delegate:nil
                                                   cancelButtonTitle:@"确定"
                                                   otherButtonTitles: nil];
        [alertError show];
    }
}
#pragma mark 1.请求所有的商品ID
-(void)requestProductID:(NSString *)productID{
    // 1.拿到所有可卖商品的ID数组
    NSArray *productIDArray = [[NSArray alloc]initWithObjects:productID, nil];
    NSSet *sets = [[NSSet alloc]initWithArray:productIDArray];
    // 2.向苹果发送请求，请求所有可买的商品
    // 2.1.创建请求对象
    SKProductsRequest *sKProductsRequest = [[SKProductsRequest alloc]initWithProductIdentifiers:sets];
    // 2.2.设置代理(在代理方法里面获取所有的可卖的商品)
    sKProductsRequest.delegate = self;
    // 2.3.开始请求
    [sKProductsRequest start];
}
#pragma mark 2.苹果那边的内购监听
-(void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response{
    NSLog(@"可卖商品的数量=%ld",response.products.count);
    NSArray *product = response.products;
    if([product count] == 0){
        NSLog(@"没有商品");
        return;
    }
    for (SKProduct *sKProduct in product) {
        NSLog(@"pro info");
        NSLog(@"SKProduct 描述信息：%@", sKProduct.description);
        NSLog(@"localizedTitle 产品标题：%@", sKProduct.localizedTitle);
        NSLog(@"localizedDescription 产品描述信息：%@",sKProduct.localizedDescription);
        NSLog(@"price 价格：%@",sKProduct.price);
        NSLog(@"productIdentifier Product id：%@",sKProduct.productIdentifier);
        if([sKProduct.productIdentifier isEqualToString: selectProductID]){
            [self buyProduct:sKProduct];
            break;
        }else{
            //NSLog(@"不不不相同");
        }
    }
}
#pragma mark 内购的代码调用
-(void)buyProduct:(SKProduct *)product{
    // 1.创建票据
    SKPayment *skpayment = [SKPayment paymentWithProduct:product];
    // 2.将票据加入到交易队列
    [[SKPaymentQueue defaultQueue] addPayment:skpayment];
    // 3.添加观察者，监听用户是否付钱成功(不在此处添加观察者)
    //[[SKPaymentQueue defaultQueue] addTransactionObserver:self];
}
#pragma mark 4.实现观察者监听付钱的代理方法,只要交易发生变化就会走下面的方法
-(void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions{
    /*
     SKPaymentTransactionStatePurchasing,    正在购买
     SKPaymentTransactionStatePurchased,     已经购买
     SKPaymentTransactionStateFailed,        购买失败
     SKPaymentTransactionStateRestored,      回复购买中
     SKPaymentTransactionStateDeferred       交易还在队列里面，但最终状态还没有决定
     */
    for (SKPaymentTransaction *transaction in transactions) {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchasing:{
                NSLog(@"正在购买");
            }break;
            case SKPaymentTransactionStatePurchased:{
                NSLog(@"购买成功");
                // 购买后告诉交易队列，把这个成功的交易移除掉
                [queue finishTransaction:transaction];
                [self buyAppleStoreProductSucceedWithPaymentTransactionp:transaction];
            }break;
            case SKPaymentTransactionStateFailed:{
                NSLog(@"购买失败");
                // 购买失败也要把这个交易移除掉
                [queue finishTransaction:transaction];
            }break;
            case SKPaymentTransactionStateRestored:{
                NSLog(@"回复购买中,也叫做已经购买");
                // 回复购买中也要把这个交易移除掉
                [queue finishTransaction:transaction];
            }break;
            case SKPaymentTransactionStateDeferred:{
                NSLog(@"交易还在队列里面，但最终状态还没有决定");
            }break;
            default:
                break;
        }
    }
}
// 苹果内购支付成功
- (void)buyAppleStoreProductSucceedWithPaymentTransactionp:(SKPaymentTransaction *)paymentTransactionp {
    NSString * productIdentifier = paymentTransactionp.payment.productIdentifier;
    NSLog(@"productIdentifier Product id：%@", productIdentifier);
    NSString * transactionId = paymentTransactionp.transactionIdentifier;
    NSLog(@"transactionId ：%@", transactionId);
    NSString *transactionReceiptString= nil;
    //系统IOS7.0以上获取支付验证凭证的方式应该改变，切验证返回的数据结构也不一样了。
    NSString *version = [UIDevice currentDevice].systemVersion;
    if([version intValue] >= 7.0){
        // 验证凭据，获取到苹果返回的交易凭据
        // appStoreReceiptURL iOS7.0增加的，购买交易完成后，会将凭据存放在该地址
        NSURLRequest * appstoreRequest = [NSURLRequest requestWithURL:[[NSBundle mainBundle]appStoreReceiptURL]];
        NSError *error = nil;
        NSData * receiptData = [NSURLConnection sendSynchronousRequest:appstoreRequest returningResponse:nil error:&error];
        transactionReceiptString = [receiptData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
    }else{
        NSData * receiptData = paymentTransactionp.transactionReceipt;
        //  transactionReceiptString = [receiptData base64EncodedString];
        transactionReceiptString = [receiptData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
    }
    // 去验证是否真正的支付成功了
    [self checkAppStorePayResultWithBase64String:transactionReceiptString withProductId:productIdentifier withTransactionId:transactionId];
}
- (void)checkAppStorePayResultWithBase64String:(NSString *)base64String withProductId:(NSString *)productId withTransactionId:(NSString *)transactionId {
    /* 生成订单参数，注意沙盒测试账号与线上正式苹果账号的验证途径不一样，要给后台标明 */
    /*
     注意：
     自己测试的时候使用的是沙盒购买(测试环境)
     App Store审核的时候也使用的是沙盒购买(测试环境)
     上线以后就不是用的沙盒购买了(正式环境)
     所以此时应该先验证正式环境，在验证测试环境
     正式环境验证成功，说明是线上用户在使用
     正式环境验证不成功返回21007，说明是自己测试或者审核人员在测试
     */
    /*
     苹果AppStore线上的购买凭证地址是： https://buy.itunes.apple.com/verifyReceipt
     测试地址是：https://sandbox.itunes.apple.com/verifyReceipt
     */
    //    NSNumber *sandbox;
    NSString *sandbox;
#if (defined(APPSTORE_ASK_TO_BUY_IN_SANDBOX) && defined(DEBUG))
    //sandbox = @(0);
    sandbox = @"0";
#else
    //sandbox = @(1);
    sandbox = @"1";
#endif
    NSMutableDictionary *prgam = [[NSMutableDictionary alloc] init];;
    [prgam setValue:sandbox forKey:@"sandbox"];
    [prgam setValue:base64String forKey:@"reciept"];
    /*
     请求后台接口，服务器处验证是否支付成功，依据返回结果做相应逻辑处理
     0 代表沙盒  1代表 正式的内购
     最后最验证后的
     */
    /*
     内购验证凭据返回结果状态码说明
     21000 App Store无法读取你提供的JSON数据
     21002 收据数据不符合格式
     21003 收据无法被验证
     21004 你提供的共享密钥和账户的共享密钥不一致
     21005 收据服务器当前不可用
     21006 收据是有效的，但订阅服务已经过期。当收到这个信息时，解码后的收据信息也包含在返回内容中
     21007 收据信息是测试用（sandbox），但却被发送到产品环境中验证
     21008 收据信息是产品环境中使用，但却被发送到测试环境中验证
     */
    NSLog(@"字典==%@",prgam);
    std::string jsCallStr = cocos2d::StringUtils::format("cc.AppleInAppPay(\"%s\",\"%s\",\"%s\")",[base64String UTF8String],[productId UTF8String],[transactionId UTF8String]);
    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        });
    }
}
#pragma mark 客户端验证购买凭据
- (void)verifyTransactionResult
{
    // 验证凭据，获取到苹果返回的交易凭据
    // appStoreReceiptURL iOS7.0增加的，购买交易完成后，会将凭据存放在该地址
    NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
    // 从沙盒中获取到购买凭据
    NSData *receipt = [NSData dataWithContentsOfURL:receiptURL];
    // 传输的是BASE64编码的字符串
    /**
     BASE64 常用的编码方案，通常用于数据传输，以及加密算法的基础算法，传输过程中能够保证数据传输的稳定性
     BASE64是可以编码和解码的
     */
    NSDictionary *requestContents = @{
                                      @"receipt-data": [receipt base64EncodedStringWithOptions:0]
                                      };
    NSError *error;
    // 转换为 JSON 格式
    NSData *requestData = [NSJSONSerialization dataWithJSONObject:requestContents
                                                          options:0
                                                            error:&error];
    // 不存在
    if (!requestData) { /* ... Handle error ... */ }
    // 发送网络POST请求，对购买凭据进行验证
    NSString *verifyUrlString;
#if (defined(APPSTORE_ASK_TO_BUY_IN_SANDBOX) && defined(DEBUG))
    verifyUrlString = @"https://sandbox.itunes.apple.com/verifyReceipt";
#else
    verifyUrlString = @"https://buy.itunes.apple.com/verifyReceipt";
#endif
    // 国内访问苹果服务器比较慢，timeoutInterval 需要长一点
    NSMutableURLRequest *storeRequest = [NSMutableURLRequest requestWithURL:[[NSURL alloc] initWithString:verifyUrlString] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:10.0f];
    [storeRequest setHTTPMethod:@"POST"];
    [storeRequest setHTTPBody:requestData];
    // 在后台对列中提交验证请求，并获得官方的验证JSON结果
    NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [NSURLConnection sendAsynchronousRequest:storeRequest queue:queue
                           completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
                               if (connectionError) {
                                   NSLog(@"链接失败");
                               } else {
                                   NSError *error;
                                   NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
                                   if (!jsonResponse) {
                                       NSLog(@"验证失败");
                                   }
                                   // 比对 jsonResponse 中以下信息基本上可以保证数据安全
                                   /*
                                    bundle_id
                                    application_version
                                    product_id
                                    transaction_id
                                    */
                                   NSLog(@"验证成功");
                               }
                           }];
}
//相册
-(void)openAlbum:(NSString *)data uploadURL:(NSString *)url{
    upload_data = data;
    [upload_data retain];
    upload_url = url;
    [upload_url retain];
    if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary])
    {
        UIImagePickerController *pickerController = [[UIImagePickerController alloc] init];
        pickerController.delegate = self;
        pickerController.allowsEditing = YES;
        NSLog(@"支持图库");
        pickerController.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
        [self presentViewController:pickerController animated:YES completion:nil];
    }else{
        UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"提示" message:@"请在设置-->隐私-->照片，中开启本应用的相机访问权限！！" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"我知道了", nil];
        [alert show];
    }
}
//拍照
-(void)takePhoto:(NSString *)data uploadURL:(NSString *)url{
    upload_data = data;
    [upload_data retain];
    upload_url = url;
    [upload_url retain];
    if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera])
    {
        UIImagePickerController *pickerController = [[UIImagePickerController alloc] init];
        pickerController.delegate = self;
        pickerController.allowsEditing = YES;
        NSLog(@"支持相机");
        pickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
        [self presentViewController:pickerController animated:YES completion:nil];
    }else{
        UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"提示" message:@"请在设置-->隐私-->相机，中开启本应用的相机访问权限！！" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"我知道了", nil];
        [alert show];
    }
}
#pragma mark -
#pragma mark UIImagePickerControllerDelegate
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
    [picker dismissViewControllerAnimated:YES completion:nil];
}
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info
{
    NSString *mediaType = [info objectForKey:UIImagePickerControllerMediaType];
    // 被选中的图片
    if ([mediaType isEqualToString:@"public.image"])   {
        // 获取照片
        UIImage *image = [info objectForKey:UIImagePickerControllerEditedImage];
        //缩小图片大小
        CGSize size = CGSizeMake(132, 132);
        // 设置成为当前正在使用的context
        UIGraphicsBeginImageContext(size);
        // 绘制改变大小的图片
        [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
        // 从当前context中创建一个改变大小后的图片
        image = UIGraphicsGetImageFromCurrentImageContext();
        // 使当前的context出堆栈
        UIGraphicsEndImageContext();
        [self upDataHeadIcon:image];
//        NSData *imageData = UIImageJPEGRepresentation(image, 1);             // 1为不缩放保存，取值(0~1)
//        // 获取沙盒路径
//        NSString *path = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:@"test"];
//        // 将照片写入文件
//        //atomically：这个参数意思是: 如果为YES则保证文件的写入原子性,就是说会先创建一个临时文件,直到文件内容写入成功再导入到目标文件里.如果为NO,则直接写入目标文件里
//        if ([imageData writeToFile:path atomically:NO]) {
//            NSLog(@"MySelf path %@",path);
//        }
        [picker dismissViewControllerAnimated:YES completion:nil];          // 隐藏视图
    }
}
-(void)upDataHeadIcon:(UIImage *)photo
{
    //上传用户信息接口
    NSData *data = UIImageJPEGRepresentation(photo, 0.1);
    NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithObject:upload_data forKey: @"data"];
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    manager.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json", @"text/html",@"text/json", @"text/javascript", nil];
    [manager POST:upload_url parameters:dict constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        formatter.dateFormat = @"yyyyMMddHHmmss";
        NSString *str = [formatter stringFromDate:[NSDate date]];
        NSString *fileName = [NSString stringWithFormat:@"%@.jpg", str];
        [formData appendPartWithFileData:data name:@"image" fileName:fileName mimeType:@"image/pjpeg"];
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:responseObject options:kNilOptions error:nil ];
        NSString *code = dict[@"code"];
        NSString *msg = dict[@"msg"];
        NSString *data = dict[@"data"];
        NSLog(@"上传成功 code = %@， msg = %@， data = %@", code, msg, data);
        std::string jsCallStr = cocos2d::StringUtils::format("cc.onChangeHeadCallBack(\"%s\",\"%s\")",[code UTF8String],[msg UTF8String]);
        if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
        {
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        }
        else
        {
            Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
                se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
            });
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"上传失败 %@", error);
    }];
    [upload_data release];
    [upload_url release];
}
@end
