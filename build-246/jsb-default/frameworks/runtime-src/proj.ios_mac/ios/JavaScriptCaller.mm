//
//  JavaScriptCaller.m
//  xlqp-mobile
//
//  Created by yons on 2018/7/23.
//

#import <Foundation/Foundation.h>
#import "JavaScriptCaller.h"
#include "cocos2d.h"
#include "ScriptingCore.h"
#import "cocos/scripting/js-bindings/jswrapper/SeApi.h"

using namespace cocos2d;

@implementation JavaScriptCaller

static JavaScriptCaller* _instance = nil;

+(instancetype) shareInstance
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[self alloc] init];
    });
    
    return _instance ;
}

- (void) call:(NSString*)jsCode{
    
    if (std::this_thread::get_id() == cocos2d::Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString([jsCode UTF8String]);
    }
    else
    {
        cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCode](){

            se::ScriptEngine::getInstance()->evalString([jsCode UTF8String]);
        });
    }
}

@end
