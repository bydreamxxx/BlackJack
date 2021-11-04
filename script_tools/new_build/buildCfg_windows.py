#!/usr/bin/env python
# coding=utf-8

# ----------------------------以下需要更改成自己的目录------------------------
NDK_PATH = 'E:/Android/SDK/ndk/19.2.5345600'
START_SCENE_UUID = "8719247d-9a91-4249-a3d5-562cad802f11" #jlmj_Loginload
COCOS_PROJECT_PATH = "E:/AnotherWorkspace/client/jilinmajiang243"

# cocos 构建指令
# 1.7.0
# COCOS_CMD = " /Applications/CocosCreator4.app/Contents/MacOS/CocosCreator --path {0}  --build \"platform=android;debug=true;autoCompile=true\" ".format(COCOS_PROJECT_PATH)
# 1.8.2
COCOS_CMD = " C:/CocosDashboard_1.0.11/resources/.editors/Creator/2.4.6/CocosCreator.exe " \
            "--path {0}  --build \"platform=android;packageName=com.anglegame.blackjack;" \
            "buildPath=./build-246;debug=false;autoCompile=true;xxteaKey=bdd7b8ea-7650-43;appABIs=['armeabi-v7a','x86','arm64-v8a','x86_64'];\" ".format(COCOS_PROJECT_PATH)
# ----------------------------以上需要更改成自己的目录------------------------
H5_PATH = COCOS_PROJECT_PATH + "/build-246/"
#h5临时目录，对比png是否修改过使用
H5_TEMP_PATH = COCOS_PROJECT_PATH + "/build-246/"
# 1.7.0
# NATIVE_PATH = COCOS_PROJECT_PATH + "/build-170/jsb-default"
# 1.8.2
NATIVE_PATH = COCOS_PROJECT_PATH + "/build-246/jsb-default"
NATIVE_VERSIONS_PATH = NATIVE_PATH + "/assets"

# 压缩路径
TINIFY_PATH = COCOS_PROJECT_PATH + '/script_tools/build/tininy_images/'
# 压缩过滤列表
TINIFY_SKIP_LIST = [
    TINIFY_PATH + 'gameyj_yyl/atlas/ui.png',
    TINIFY_PATH + 'gameyj_yyl/textures/com_di1.png',
    TINIFY_PATH + 'gameyj_hall/textures/no_tininy/no_tininy-1.png',
]




