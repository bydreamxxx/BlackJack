//
//  GVoiceMessage.h
//  xlqp
//
//  Created by yons on 2018/7/23.
//

#ifndef GVoiceMessage_h
#define GVoiceMessage_h

#import "GVoice.h"

@interface GVoiceMessage : NSObject<GVGCloudVoiceDelegate>

@property (strong,nonatomic) NSTimer* pollTimer;
@property (strong,nonatomic) NSString* filePath;
@property (strong,nonatomic) NSString* downFilePath;
@property (strong,nonatomic) NSString* fileID;
@property (strong,nonatomic) NSString* userId;



/**
 *  初始化参数
 */
-(void) setUserId:(NSString*)userId;

/**
 *  开始录音
 */
- (void) startRecord;

/**
 *  结束录音
 */
- (void) stopRecord;

/**
 *  上传录音
 */
- (void) upload;

/**
 *  下载录音
 */
- (void) download:(NSString*)fileId withPath:(NSString*) filePath;

/**
 *  开始播放
 */
- (void) playMessage:(NSString*)filePath;

/**
 *  结束播放
 */
- (void) stopPlay:(NSString*)filePath;

/**
 *  单例
 */
+(instancetype) shareInstance;

/**
 * 初始化GVoice
 */
+ (void) init:(NSString*)gameId withKey:(NSString*)key serverInfo:(NSString*)serverInfo andUserId:(NSString*)userId;

/**
 *  开始录音
 */
+ (void) startRecord;

/**
 *  结束录音
 */
+ (void) stopRecord;

/**
 *  上传录音
 */
+ (void) upload;

/**
 *  开始下载
 */
+ (void) download:(NSString*)fileId withPath:(NSString*) filePath;

/**
 *  开始播放
 */
+ (void) playMessage:(NSString*)filePath;

/**
 *  结束播放
 */
+ (void) stopMessage:(NSString*)filePath;

@end

#endif /* GVoiceMessage_h */
