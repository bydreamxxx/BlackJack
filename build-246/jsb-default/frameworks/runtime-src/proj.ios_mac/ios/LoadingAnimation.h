//
//  LoadingAnimation.h
//  ios_test
//
//  Created by yons on 2017/9/6.
//  Copyright © 2017年 yons. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LoadingAnimation : UIView
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UILabel *label;
@property (nonatomic, strong) UIView *blackFrame;
- (void) setTips:(NSString*)content withOrientation:(UIInterfaceOrientation) orientation;
@end
