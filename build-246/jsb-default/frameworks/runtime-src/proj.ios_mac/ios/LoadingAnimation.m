//
//  LoadingAnimation.m
//  ios_test
//
//  Created by yons on 2017/9/6.
//  Copyright © 2017年 yons. All rights reserved.
//

#import "LoadingAnimation.h"

@implementation LoadingAnimation

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        CGRect rect_screen = [[UIScreen mainScreen]bounds];
        
        UIView * mask = [[UIView alloc] initWithFrame:CGRectMake(-2500,-2500,5000,5000)];
        [mask setBackgroundColor:[UIColor colorWithRed:0 green:0 blue:0 alpha:125/255.0]];
        [self addSubview:mask];
        
        CGFloat scaleW = rect_screen.size.width/1280;
        CGFloat scaleH = rect_screen.size.height/720;
        CGFloat scaleMin = scaleW<scaleH?scaleW:scaleH;
        self.blackFrame = [[UIView alloc] initWithFrame:CGRectMake(-290*scaleMin,-50*scaleMin,580*scaleMin,100*scaleMin)];
        [self.blackFrame setBackgroundColor:[UIColor colorWithRed:0 green:0 blue:0 alpha:136/255.0]];
        [self addSubview:self.blackFrame];
        
        self.imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"wait.png"]];
        [self.imageView setFrame:CGRectMake(92*scaleMin,21*scaleMin,58*scaleMin,58*scaleMin)];
        [self.blackFrame addSubview:self.imageView];
        
        CABasicAnimation *animation =  [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
        //默认是顺时针效果，若将fromValue和toValue的值互换，则为逆时针效果
        animation.fromValue = [NSNumber numberWithFloat:0.f];
        animation.toValue =  [NSNumber numberWithFloat: M_PI *2];
        animation.duration  = 1;
        animation.autoreverses = NO;
        animation.fillMode =kCAFillModeForwards;
        animation.repeatCount = MAXFLOAT; //如果这里想设置成一直自旋转，可以设置为MAXFLOAT，否则设置具体的数值则代表执行多少次
        [self.imageView.layer addAnimation:animation forKey:nil];
        
        self.label = [[UILabel alloc]initWithFrame:CGRectMake(200*scaleMin,0*scaleMin,380*scaleMin,100*scaleMin)];
        self.label.text = @"加载中...";
        self.label.font = [UIFont systemFontOfSize:30*scaleMin];
        self.label.textAlignment = NSTextAlignmentLeft;
        self.label.textColor = [UIColor whiteColor];
        [self.blackFrame addSubview:self.label];
    }
    return self;
}

- (void) setTips:(NSString *)content withOrientation:(UIInterfaceOrientation)orientation{
    CGRect rect_screen = [[UIScreen mainScreen]bounds];
//    NSLog(@"分辨率=%@",NSStringFromCGSize(rect_screen.size));
    CGFloat scaleW = rect_screen.size.width/1280;
    CGFloat scaleH = rect_screen.size.height/720;
    CGFloat scaleMin = scaleW<scaleH?scaleW:scaleH;
    if( orientation == UIInterfaceOrientationLandscapeRight ){
        scaleW = rect_screen.size.width/1280;
        scaleH = rect_screen.size.height/720;
        scaleMin = scaleW<scaleH?scaleW:scaleH;
    }else{
        scaleW = rect_screen.size.width/720;
        scaleH = rect_screen.size.height/1280;
        scaleMin = scaleW<scaleH?scaleW:scaleH;
    }
    self.blackFrame.frame = CGRectMake(-290*scaleMin,-50*scaleMin,580*scaleMin,100*scaleMin);
    self.imageView.frame = CGRectMake(92*scaleMin,21*scaleMin,58*scaleMin,58*scaleMin);
    self.label.frame = CGRectMake(200*scaleMin,0*scaleMin,380*scaleMin,100*scaleMin);
    
    self.label.text = [NSString stringWithFormat:@"%@",content];
}

@end
