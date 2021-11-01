#!/usr/bin/env python
# coding=utf-8

import commands
import os
import shutil
import sys 
sys.path.append('/Users/yons/workspace/trunk/client/xl_h5/script_tools/new_build')
import game_platform
import games_cfg
import buildCfg
import builder
import updater

# COCOS_PROJECT_PATH = "/Users/luke/trunk/client/jilinmajiang"
# COCOS_CMD = " /Applications/CocosCreator.app/Contents/MacOS/CocosCreator " \
#             "--path {0}  --build \"platform=android;packageName=com.yjhy.jlmj;" \
#             "buildPath=./build-246;debug=false;autoCompile=true;encryptJs=true;xxteaKey=bdd7b8ea-7650-43\" ".format(COCOS_PROJECT_PATH)

def init():
    shutil.rmtree(game_platform.local_dir, True)
    shutil.rmtree(game_platform.remote_dir, True)
    shutil.rmtree(game_platform.remote_version_dir, True)


# 删除子游戏
def remove_download_games():
    for game in games_cfg.games:
        updater.remove_self(game)
    return


# 生成本地版本
def gen_local_version():
    for game in games_cfg.games:
        updater.gen_local_version(game_platform, game)
    return


# 备份版本代码
def back_up():
    back_path = os.path.abspath('./backup/' + games_cfg.hall.version + '/')
    shutil.rmtree(back_path, True)
    os.mkdir(back_path)
    shutil.copyfile(buildCfg.NATIVE_PATH + "/js backups (useful for debugging)/project.js", back_path + '/project.js')
    return


if __name__ == "__main__":
    builder.compressPngAssets(True,True)
    # path = "d:/test"
    # finded,oldfile = builder.search_file(path,'aasdf')
    # print("finded:",finded)
    # print("oldfile:",oldfile)

