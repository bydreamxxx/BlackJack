//
//  TencentGPS.m
//  xlqp
//
//  Created by Mac_Li on 2018/4/17.
//
//

#import <Foundation/Foundation.h>
#import "TencentGPS.h"
#import <TencentLBS/TencentLBS.h>
#import <TencentLBS/TencentLBSLocationUtils.h>

@interface TencentGPS ()<TencentLBSLocationManagerDelegate>
    @property (readwrite, nonatomic, strong) TencentLBSLocationManager *locationManager;
    @property (readwrite, nonatomic, strong)    TencentLBSLocation *mLocation;

@end

@implementation TencentGPS
//GPS定位
-(void)configLocationManager {
    self.locationManager = [[TencentLBSLocationManager alloc] init];
    [self.locationManager setDelegate:self];
    [self.locationManager setPausesLocationUpdatesAutomatically:NO];
    [self.locationManager setAllowsBackgroundLocationUpdates:NO];
    [self.locationManager setApiKey:@"PPEBZ-B7B3G-5ZFQO-IJBTI-NQSB7-UJB62"];
    [self.locationManager setRequestLevel:TencentLBSRequestLevelName];
    [self.locationManager setDistanceFilter:10];
    
    CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
    if (authorizationStatus == kCLAuthorizationStatusNotDetermined) {
        [self.locationManager requestWhenInUseAuthorization];
    }
}

- (void)startUpdatingLocation {
    [self.locationManager startUpdatingLocation];
}

// 单次定位
- (void)startSingleLocation {
    [self.locationManager requestLocationWithCompletionBlock:
     ^(TencentLBSLocation *location, NSError *error) {
         self.mLocation = location;
         NSLog(@"%@, %@, %@", location.location, location.name, location.address);
     }];
}

- (void)tencentLBSLocationManager:(TencentLBSLocationManager *)manager
didFailWithError:(NSError *)error {
    CLAuthorizationStatus authorizationStatus = [CLLocationManager authorizationStatus];
    if (authorizationStatus == kCLAuthorizationStatusDenied ||
        authorizationStatus == kCLAuthorizationStatusRestricted) {
        
        
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示"
                                                                       message:@"定位权限未开启，是否开启？"
                                                                preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"是"
                                                  style:UIAlertActionStyleDefault
                                                handler:^(UIAlertAction * _Nonnull action) {
                                                    if( [[UIApplication sharedApplication]canOpenURL:
                                                         [NSURL URLWithString:UIApplicationOpenSettingsURLString]] ) {
                                                        [[UIApplication sharedApplication] openURL:
                                                         [NSURL URLWithString:UIApplicationOpenSettingsURLString]];
                                                    }
                                                }]];
        
        [alert addAction:[UIAlertAction actionWithTitle:@"否"
                                                  style:UIAlertActionStyleDefault
                                                handler:^(UIAlertAction * _Nonnull action) {
                                                }]];
        
        
        
    } else {
        NSLog(@"错误码:%@", error);
    }
    
}

- (void)tencentLBSLocationManager:(TencentLBSLocationManager *)manager didUpdateLocation:(TencentLBSLocation *)location {
    //定位结果
    //NSLog(@"location:%@", location.location);
    NSLog(@"location:\n经度%f, \n纬度%f,", location.location.coordinate.longitude, location.location.coordinate.latitude);
    NSLog(@"%@, %@, %@", location.location, location.name, location.address);
    self.mLocation = location;
}

//开始定位
-(void)startGpsLocation{
    [self configLocationManager];
    [self startUpdatingLocation];
}
-(NSString*)getAdress{
    NSLog(@"详细地址：==================%@",self.mLocation.address);
    return self.mLocation.address;
}

//获取纬度
-(float)getLatitude{
    NSLog(@"详细纬度:================%f", self.mLocation.location.coordinate.latitude);
    return self.mLocation.location.coordinate.latitude;
}

-(float)getLongitude{
    NSLog(@"详细经度:================%f", self.mLocation.location.coordinate.longitude);
    return self.mLocation.location.coordinate.longitude;
}
-(float)getDistanceBetween:(float) nstart_Lat endLatitude:(float) nend_Lat startLongitude:(float) nstart_Long endLongitude:(float) nend_Long{
    const CLLocationCoordinate2D start2D = CLLocationCoordinate2DMake(nstart_Lat, nstart_Long);
    const CLLocationCoordinate2D end2D = CLLocationCoordinate2DMake(nend_Lat, nend_Long);
    //TencentLBSLocationUtils* locationUtils = [[TencentLBSLocationUtils alloc]init];
    //[locationUtils distanceBetweenTwoCoordinate2D:start2D: end2D];
    float distance = [TencentLBSLocationUtils distanceBetweenTwoCoordinate2D:&start2D
                                                              coordinateTwo:&end2D];
    return distance;
}
@end
