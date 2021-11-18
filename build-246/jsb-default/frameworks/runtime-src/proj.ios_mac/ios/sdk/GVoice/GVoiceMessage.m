//
//  GVoiceMessage.m
//  xlqp-mobile
//
//  Created by yons on 2018/7/23.
//

#import "GVoiceMessage.h"
#import "JavaScriptCaller.h"

@implementation GVoiceMessage

static GVoiceMessage* _instance = nil;

+(instancetype) shareInstance
{
    if(_instance == nil){
        _instance = [[GVoiceMessage alloc] init];
    }
    
    return _instance ;
}

- (id)init {
    if (self=[super init]) {
        [GVGCloudVoice sharedInstance].delegate = self;
        [[GVGCloudVoice sharedInstance] setAppInfo:"1749527635" withKey:"bb9ad358739ba5eb269991af1cbb99bc" andOpenID:"abc"];
        [[GVGCloudVoice sharedInstance] initEngine];
        if(_pollTimer != nil){
            [_pollTimer invalidate];
            _pollTimer = nil;
        }
        _pollTimer = [NSTimer scheduledTimerWithTimeInterval:1.000/15 target:self selector:@selector(pollTimer:) userInfo:NULL repeats:YES];
        
        NSString *docPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
        _filePath = [[NSString alloc] initWithFormat:@"%@/%s", docPath, "voice.dat"];
        _downFilePath = [[NSString alloc] initWithFormat:@"%@/%s", docPath, "voice_downlad.dat"];
    }
    return self;
}

-(void) pollTimer:(NSTimer*)timer{
    [[GVGCloudVoice sharedInstance] poll];
}


- (void) deallo{
    [_filePath release];
    [_downFilePath release];
}

- (void) setUserId:(NSString*)userId{
    _userId = userId;
}

/**
 *  开始录音
 */
- (void) startRecord{
    NSString *docPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    NSString * recordFilePath = [[NSString alloc] initWithFormat:@"%@/%s", docPath, "voice.dat"];
    [[GVGCloudVoice sharedInstance] startRecording:[recordFilePath cStringUsingEncoding:NSUTF8StringEncoding]];
}

/**
 *  结束录音
 */
- (void) stopRecord{
    [[GVGCloudVoice sharedInstance] stopRecording];
}

/**
 *  上传录音
 */
- (void) upload{
    NSString *docPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    NSString * recordFilePath = [[NSString alloc] initWithFormat:@"%@/%s", docPath, "voice.dat"];
    NSLog(@"腾讯GVoice 上传文件path=%@",recordFilePath);
    [[GVGCloudVoice sharedInstance] uploadRecordedFile:[recordFilePath cStringUsingEncoding:NSUTF8StringEncoding] timeout:18000];
}

/**
 *  下载录音
 */
- (void) download:(NSString*)fileId withPath:(NSString*) filePath{
    NSString *docPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    NSString* downloadFilePath = [[NSString alloc] initWithFormat:@"%@/%@", docPath, filePath];
    [[GVGCloudVoice sharedInstance] downloadRecordedFile:[fileId cStringUsingEncoding:NSUTF8StringEncoding] filePath:[downloadFilePath cStringUsingEncoding:NSUTF8StringEncoding] timeout:18000];

}

/**
 *  开始播放
 */
- (void) playMessage:(NSString *)filePath{
    [[GVGCloudVoice sharedInstance] playRecordedFile:[filePath cStringUsingEncoding:NSUTF8StringEncoding]];
}

/**
 *  结束播放
 */
- (void) stopPlay:(NSString*)filePath{
    [[GVGCloudVoice sharedInstance] stopPlayFile];
    NSFileManager *fileMgr = [NSFileManager defaultManager];
    BOOL bRet = [fileMgr fileExistsAtPath:filePath];
    if (bRet) {
        NSError *err;
        if([fileMgr removeItemAtPath:filePath error:&err]){
            NSLog(@"腾讯GVoice 删除录音文件");
        }
    }
}

#pragma mark delegate

- (void) onJoinRoom:(enum GCloudVoiceCompleteCode) code withRoomName: (const char * _Nullable)roomName andMemberID:(int) memberID {
    
}

- (void) onStatusUpdate:(enum GCloudVoiceCompleteCode) status withRoomName: (const char * _Nullable)roomName andMemberID:(int) memberID {
    
}

- (void) onQuitRoom:(enum GCloudVoiceCompleteCode) code withRoomName: (const char * _Nullable)roomName {
    
}

- (void) onMemberVoice:    (const unsigned int * _Nullable)members withCount: (int) count {
}

- (void) onUploadFile: (enum GCloudVoiceCompleteCode) code withFilePath: (const char * _Nullable)filePath andFileID:(const char * _Nullable)fileID  {
    //notify cocos
    _fileID = [NSString stringWithFormat:@"%s", fileID];
    NSString* jsCode;
    if(GV_ON_UPLOAD_RECORD_DONE == code){
        jsCode = [NSString stringWithFormat:@"cc.onGVoiceUploadFile(\"%d\",\"%@\");", 0,_fileID];
    }else{
        jsCode = [NSString stringWithFormat:@"cc.onGVoiceUploadFile(\"%d\",\"%@\");", code,_fileID];
    }
    [[JavaScriptCaller shareInstance] call:jsCode];
}

- (void) onDownloadFile: (enum GCloudVoiceCompleteCode) code  withFilePath: (const char * _Nullable)filePath andFileID:(const char * _Nullable)fileID {
    NSString* recordFilePath = [NSString stringWithFormat:@"%s", filePath];
    _fileID = [NSString stringWithFormat:@"%s", fileID];
    NSArray* pathNames = [recordFilePath componentsSeparatedByString:@"/"];
    NSString* fileName = [pathNames lastObject];
    NSString* jsCode;
    if(GV_ON_DOWNLOAD_RECORD_DONE == code){
        jsCode = [NSString stringWithFormat:@"cc.onGVoiceDownloadFile(\"%d\",\"%@\",\"%@\");", 0,recordFilePath,fileName];
    }else{
        jsCode = [NSString stringWithFormat:@"cc.onGVoiceDownloadFile(\"%d\",\"%@\",\"%@\");", code,recordFilePath,fileName];
    }
    [[JavaScriptCaller shareInstance] call:jsCode];
}

- (void) onPlayRecordedFile:(enum GCloudVoiceCompleteCode) code withFilePath: (const char * _Nullable)filePath {
    NSString* recordFilePath = [NSString stringWithFormat:@"%s", filePath];
    NSString* jsCode;
    NSArray* pathNames = [recordFilePath componentsSeparatedByString:@"/"];
    NSString* fileName = [pathNames lastObject];
    if(GV_ON_PLAYFILE_DONE == code){
        jsCode = [NSString stringWithFormat:@"cc.onGVoicePlayEnd(\"%d\",\"%@\",\"%@\");", 0,recordFilePath,fileName];
    }else{
        jsCode = [NSString stringWithFormat:@"cc.onGVoicePlayEnd(\"%d\",\"%@\",\"%@\");", code,recordFilePath,fileName];
    }
    [[JavaScriptCaller shareInstance] call:jsCode];
    
    //remove speaked record file
    NSFileManager *fileMgr = [NSFileManager defaultManager];
    BOOL bRet = [fileMgr fileExistsAtPath:recordFilePath];
    if (bRet) {
        NSError *err;
        if([fileMgr removeItemAtPath:recordFilePath error:&err]){
            NSLog(@"腾讯GVoice 删除录音文件");
        }
    }
}

- (void) onApplyMessageKey:(enum GCloudVoiceCompleteCode) code {
    //notify cocos
    NSString* jsCode;
    if(GV_ON_MESSAGE_KEY_APPLIED_SUCC == code){
        jsCode = [NSString stringWithFormat:@"cc.onGVoiceLogin(\"%d\");", 0];
    }else{
        jsCode = [NSString stringWithFormat:@"cc.onGVoiceLogin(\"%d\");", code];
    }
    [[JavaScriptCaller shareInstance] call:jsCode];
}

- (void) onSpeechToText:(enum GCloudVoiceCompleteCode) code withFileID:(const char * _Nullable)fileID andResult:( const char * _Nullable)result {
}

- (void) onRecording:(const unsigned char* _Nullable) pAudioData withLength: (unsigned int) nDataLength {
    
}

- (void)onEvent:(enum GCloudVoiceEvent)event forInfo:(const char * _Nullable)info {

}


- (void)onMemberVoice:(const char * _Nullable)roomName member:(unsigned int)member withStatus:(int)status {
    
}


- (void)onRoleChanged:(enum GCloudVoiceCompleteCode)code inRoom:(const char * _Nullable)roomName withMember:(int)memberID forRole:(int)role {
    
}


- (void)onStreamSpeechToText:(enum GCloudVoiceCompleteCode)code withError:(int)error andResult:(const char * _Nullable)result forPath:(const char * _Nullable)voicePath {
    
}


- (void) onStreamSpeechToText:(enum GCloudVoiceCompleteCode) code withError:(int) error andResult:(const char *_Nullable)result {
    
}

#pragma cocos interface

/**
 * 初始化GVoice
 */
+ (void) init:(NSString *)gameId withKey:(NSString *)key serverInfo:(NSString*)serverInfo andUserId:(NSString *)userId{
    [[GVoiceMessage shareInstance] setUserId:userId];
    
    [[GVGCloudVoice sharedInstance] setAppInfo:[gameId cStringUsingEncoding:NSUTF8StringEncoding] withKey:[key cStringUsingEncoding:NSUTF8StringEncoding] andOpenID:[userId cStringUsingEncoding:NSUTF8StringEncoding]];
    [[GVGCloudVoice sharedInstance] setMode:Messages];
    //setServerInfo for foreign game
//    [[GVGCloudVoice sharedInstance] setServerInfo:[serverInfo UTF8String]];
    [[GVGCloudVoice sharedInstance] applyMessageKey:18000];
}

/**
 *  开始录音
 */
+ (void) startRecord{
    [[GVoiceMessage shareInstance] startRecord];
}

/**
 *  结束录音
 */
+ (void) stopRecord{
    [[GVoiceMessage shareInstance] stopRecord];
}

/**
 *  上传录音
 */
+ (void) upload{
    [[GVoiceMessage shareInstance] upload];
}

/**
 *  开始下载
 */
+ (void) download:(NSString*)fileId withPath:(NSString*) filePath{
    [[GVoiceMessage shareInstance] download:fileId withPath:filePath];
}

/**
 *  开始下载
 */
+ (void) playMessage:(NSString*)filePath{
    [[GVoiceMessage shareInstance] playMessage:filePath];
}

/**
 *  结束播放
 */
+ (void) stopMessage:(NSString*)filePath{
    [[GVoiceMessage shareInstance] stopPlay];
}

@end
