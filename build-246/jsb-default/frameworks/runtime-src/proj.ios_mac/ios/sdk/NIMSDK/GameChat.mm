//
//  GameChat.m
//  gameyj
//
//  Created by shen on 2017/9/5.
//
//

#import <Foundation/Foundation.h>
#import "GameChat.h"
#include "cocos2d.h"
//#include<jsapi.h>
#include "ScriptingCore.h"
#import <AVFoundation/AVFoundation.h>
#import "cocos/scripting/js-bindings/jswrapper/SeApi.h"

//using namespace js;


static NSMutableArray* m_users = [NSMutableArray arrayWithCapacity:30];
static NSString*   m_account = nil;
static int m_audioDur = 0;

@implementation GameChat


+ (void) startRecord{
    id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
    [mediaMgr recordForDuration:20];
}

+ (void) cancelRecord{
    id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
    [mediaMgr cancelRecord];
}

+ (void) completeRecord{
    id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
    [mediaMgr stopRecord];
}

+ (void) loginIm:(NSString *)account withToken:(NSString *)token{
    m_account = [[NSString alloc] initWithString:account];
    NSLog(@"语音登录:account:%@", m_account);
    NSLog(@"语音登录:token:%@", [[NSString alloc] initWithString:token]);
    id<NIMLoginManager> loginMgr = [[NIMSDK sharedSDK] loginManager];
    [loginMgr login:account token:token completion:^(NSError * _Nullable error) {
        if(!error){
            NSLog(@"语音登录:登录成功！");
        }else{
            NSLog(@"语音登录:登录失败！%@", [error localizedDescription]);
        }
    }];
    
    //去除 录制或者播放完成以后是否自动deactivate AVAudioSession
    id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
    [mediaMgr setDeactivateAudioSessionAfterComplete:NO];
}

+ (void) addUser:(NSString *)account{
    NSLog(@"语音玩家::增加玩家：%@", account);
    [m_users addObject:[[NSString alloc] initWithString:account]];
}

+ (void) removeUser:(NSString *)account{
    NSLog(@"语音玩家::删除玩家：%@", account);
    [m_users removeObject:[[NSString alloc] initWithString:account]];
}

+ (void) clearUsers{
    NSLog(@"语音玩家::清空玩家");
    [m_users removeAllObjects];
}


/**
 *  接口实现
 **/

/**
 *  登录回调
 *
 *  @param step 登录步骤
 *  @discussion 这个回调主要用于客户端UI的刷新
 */
- (void)onLogin:(NIMLoginStep)step{
    NSLog(@"语音::onLogin step=%ld", (long)step);
}


- (void) recordAudio:(NSString *)filePath didBeganWithError:(NSError *)error{
    NSLog(@"语音::开始录音：filePath=%@, error=%@", filePath, error);
}

- (void) recordAudio:(NSString *)filePath didCompletedWithError:(NSError *)error{
    
    int count = m_users.count;
    NSLog(@"语音::录音结束! %@", m_account);
    if(!error && count > 0){
        for(int i=0; i<count; i++){
            NSString* acc = [m_users objectAtIndex:i];
            // 构造出具体会话
            NIMSession *session = [NIMSession session:acc type:NIMSessionTypeP2P];
            // 获得语音附件对象
            NIMAudioObject *object = [[NIMAudioObject alloc] initWithSourcePath:filePath];
            // 构造出具体消息并注入附件
            NIMMessage *message = [[NIMMessage alloc] init];
            message.messageObject = object;
            // 错误反馈对象
            NSError *error_ack = nil;
            // 发送消息
            [[NIMSDK sharedSDK].chatManager sendMessage:message toSession:session error:&error_ack];

        }
    }
    id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
    [mediaMgr play:filePath];
    
    std::string str = [m_account UTF8String];
    std::string jsCallStr = cocos2d::StringUtils::format("playRecord(\"%s\", \"%d\");", str.c_str(), m_audioDur);
//    ScriptingCore::getInstance()->executeString(jsCallStr.c_str());
    if (std::this_thread::get_id() == cocos2d::Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
    else
    {
        cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
            
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        });
    }
}

/**
 *  录音被取消的回调
 */
- (void)recordAudioDidCancelled{
    NSLog(@"语音::录音被取消的回调");
}

/**
 *  音频录制进度更新回调
 *
 *  @param currentTime 当前录制的时间
 */
- (void)recordAudioProgress:(NSTimeInterval)currentTime{
    NSLog(@"语音::音频录制进度更新回调：currentTime=%f", currentTime);
    m_audioDur = ceil(currentTime);
}

/**
 *  录音开始被打断回调
 */
- (void)recordAudioInterruptionBegin{
    NSLog(@"语音::录音开始被打断回调");}

/**
 *  录音结束被打断回调
 */
- (void)recordAudioInterruptionEnd{
    NSLog(@"语音::录音结束被打断回调");
}

/**
 *  开始播放音频的回调
 *
 *  @param filePath 音频文件路径
 *  @param error    错误信息
 */
- (void)playAudio:(NSString *)filePath didBeganWithError:(nullable NSError *)error{
    NSLog(@"语音::开始播放音频的回调:filePath=%@, error=%@", filePath, error);
}

/**
 *  播放完音频的回调
 *
 *  @param filePath 音频文件路径
 *  @param error    错误信息
 */
- (void)playAudio:(NSString *)filePath didCompletedWithError:(nullable NSError *)error{
    NSLog(@"语音::播放完音频的回调:filePath=%@, error=%@", filePath, error);
    NSFileManager *fileManager = [NSFileManager defaultManager];
    [fileManager removeItemAtPath:filePath error:nil];
}

/**
 *  播放音频开始被打断回调
 */
- (void)playAudioInterruptionBegin{
    NSLog(@"语音::播放音频开始被打断回调");
}

/**
 *  播放音频结束被打断回调
 */
- (void)playAudioInterruptionEnd{
    NSLog(@"语音::播放音频结束被打断回调");
}


/**
 *  即将发送消息回调
 *  @discussion 因为发消息之前可能会有个异步的准备过程,所以需要在收到这个回调时才将消息加入到datasource中
 *  @param message 当前发送的消息
 */
- (void)willSendMessage:(NIMMessage *)message{
    
}

/**
 *  发送消息进度回调
 *
 *  @param message  当前发送的消息
 *  @param progress 进度
 */
- (void)sendMessage:(NIMMessage *)message
           progress:(float)progress{
    
}

/**
 *  发送消息完成回调
 *
 *  @param message 当前发送的消息
 *  @param error   失败原因,如果发送成功则error为nil
 */
- (void)sendMessage:(NIMMessage *)message
didCompleteWithError:(nullable NSError *)error{
    NSLog(@"语音::发送消息完成 message=%@", message);
}


/**
 *  收到消息回调
 *
 *  @param messages 消息列表,内部为NIMMessage
 */
- (void)onRecvMessages:(NSArray<NIMMessage *> *)messages{
    
}


/**
 *  收到消息回执
 *
 *  @param receipt 消息回执
 *  @discussion 当上层收到此消息时所有的存储和 model 层业务都已经更新，只需要更新 UI 即可。如果对端发送的已读回执时间戳比当前端存储的最后时间戳还小，这个已读回执将被忽略。
 */
- (void)onRecvMessageReceipt:(NIMMessageReceipt *)receipt{
    
}


/**
 *  收到消息被撤回的通知
 *
 *  @param notification 被撤回的消息信息
 *  @discusssion 云信在收到消息撤回后，会先从本地数据库中找到对应消息并进行删除，之后通知上层消息已删除
 */
- (void)onRecvRevokeMessageNotification:(NIMRevokeMessageNotification *)notification{
    
}


/**
 *  收取消息附件回调
 *  @param message  当前收取的消息
 *  @param progress 进度
 *  @discussion 附件包括:图片,视频的缩略图,语音文件
 */
- (void)fetchMessageAttachment:(NIMMessage *)message
                      progress:(float)progress{
    
}


/**
 *  收取消息附件完成回调
 *
 *  @param message 当前收取的消息
 *  @param error   错误返回,如果收取成功,error为nil
 */
- (void)fetchMessageAttachment:(NIMMessage *)message
          didCompleteWithError:(nullable NSError *)error{
    NSLog(@"语音::收取消息附件完成回调:message=%@, error=%@", message, error);
    if(!error){
        NIMAudioObject* obj = message.messageObject;
        NSString* filePath = obj.path;
        int dur = ceil(obj.duration/1000);
        
        id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
        [mediaMgr play:filePath];
        
        NSString* fromid = message.from;
        
        NSLog(@"语音下载完毕，时长：%d, fromid=%@", dur, fromid);
        std::string jsCallStr = cocos2d::StringUtils::format("playRecord(\"%s\", \"%d\");", [fromid UTF8String], dur);
//        ScriptingCore::getInstance()->executeString(jsCallStr.c_str());
        if (std::this_thread::get_id() == cocos2d::Director::getInstance()->getCocos2dThreadId())
        {
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        }
        else
        {
            cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
                
                se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
            });
        }
    }
}



@end
