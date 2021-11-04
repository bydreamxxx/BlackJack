#!/usr/bin/env python
# coding=utf-8

import commands
import os
import shutil

import game_platform
import games_cfg
from new_build import buildCfg_windows
from new_build import builder_windows
from new_build import updater

COCOS_PROJECT_PATH = "E:/AnotherWorkspace/client/jilinmajiang243"
COCOS_CMD = "C:/CocosDashboard_1.0.11/resources/.editors/Creator/2.4.6/CocosCreator.exe " \
            "--path {0}  --build \"platform=android;packageName=com.anglegame.blackjack;" \
            "buildPath=./build-246;debug=false;autoCompile=false;encryptJs=true;xxteaKey=bdd7b8ea-7650-43;appABIs=['armeabi-v7a','x86','arm64-v8a','x86_64'];\" ".format(COCOS_PROJECT_PATH)

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
    shutil.copyfile(buildCfg_windows.NATIVE_PATH + "/js backups (useful for debugging)/project.js", back_path + '/project.js')
    return


if __name__ == "__main__":
    # init()
    # builder_windows.cocos_build_withcmd(COCOS_CMD)
    # # builder_windows.gen_etc2()
    remove_download_games()
    # gen_local_version()
    builder_windows.copy_main_code_to_project()
    # back_up()
    builder_windows.generate_apk(buildCfg_windows.COCOS_PROJECT_PATH + '/script_tools/new_build/trunk_247/output/')
    print '本地构建完成'

