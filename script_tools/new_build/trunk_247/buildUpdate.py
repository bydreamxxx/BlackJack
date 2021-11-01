#!/usr/bin/env python
# coding=utf-8

import commands
import os
import shutil

from new_build import buildCfg
from new_build import builder
from new_build import updater

import game_platform
import games_cfg


def init():
    shutil.rmtree(game_platform.local_dir, True)
    shutil.rmtree(game_platform.remote_dir, True)
    shutil.rmtree(game_platform.remote_version_dir, True)


# 上传远程版本
def upload():
    builder.make_zip(game_platform.remote_dir, game_platform.remote_dir + '.zip')

    cmd_upload = []
    cmd_upload.append('scp -r ./{0}.zip game@39.106.30.21:/data/project_2'.format(game_platform.remote_dir))

    print '上传中...'
    for i, val in enumerate(cmd_upload):
        (status, output) = commands.getstatusoutput(val)
        print status, output
    print '上传完成'

    cmd = 'ssh game@39.106.30.21 \'unzip -o /data/project_2/{0}.zip -d /data/project_2/\''.format(game_platform.remote_dir)
    os.system(cmd)


# 上传远程版本号
def version_num_upload():
    builder.make_zip(game_platform.remote_version_dir, game_platform.remote_version_dir + '.zip')

    cmd_upload = []
    cmd_upload.append('scp -r ./{0}.zip game@39.106.30.21:/data/project_1'.format(game_platform.remote_version_dir))

    print '上传中...'
    for i, val in enumerate(cmd_upload):
        (status, output) = commands.getstatusoutput(val)
        print status, output
    print '上传完成'

    cmd = 'ssh game@39.106.30.21 \'unzip -o /data/project_1/{0}.zip -d /data/project_1/\''.format(
        game_platform.remote_version_dir)
    os.system(cmd)
    return


# 上传远程版本至版本号目录
def upload_to_version_dir():
    builder.make_zip(game_platform.remote_dir, games_cfg.hall.version+'.zip')

    cmd_upload = []
    cmd_upload.append('scp -r ./{0}.zip game@39.106.30.21:/data/project_1/versions_247'.format(games_cfg.hall.version))

    print '上传中...'
    for i, val in enumerate(cmd_upload):
        (status, output) = commands.getstatusoutput(val)
        print status, output
    print '上传完成'

    cmd = 'ssh game@39.106.30.21 \'unzip -o /data/project_1/versions_247/{0}.zip -d /data/project_1/versions_247/\''.format(games_cfg.hall.version)
    os.system(cmd)
    cmd = 'ssh game@39.106.30.21 \'rm /data/project_1/versions_247/{0} -rf\''.format(games_cfg.hall.version)
    os.system(cmd)
    cmd = 'ssh game@39.106.30.21 \'mv /data/project_1/versions_247/trunk_247 /data/project_1/versions_247/{0}\''.format(games_cfg.hall.version)
    os.system(cmd)
    return


# 删除子游戏
def remove_download_games():
    for game in games_cfg.games:
        updater.remove_self(game)
    return


# 生成游戏远程版本
def gen_game_version():
    for game in games_cfg.games:
        updater.gen_remote_version(game_platform, game)
    return


# 生成游戏远程版本号
def gen_game_num_version():
    for game in games_cfg.games:
        updater.gen_remote_num_version(game_platform, game)
    return


# 生成大厅版本
def gen_hall():
    updater.gen_remote_version(game_platform, games_cfg.hall)
    updater.gen_remote_num_version(game_platform, games_cfg.hall)
    return


# 备份版本代码
def back_up():
    back_path = os.path.abspath('./backup/' + games_cfg.hall.version + '/')
    shutil.rmtree(back_path, True)
    os.mkdir(back_path)
    shutil.copyfile(buildCfg.NATIVE_PATH + "/js backups (useful for debugging)/project.js", back_path + '/project.js')
    return


if __name__ == "__main__":
    # init()
    # builder.cocos_build()
    # #builder.gen_etc2()
    # gen_game_version()
    # gen_game_num_version()
    # remove_download_games()
    # # 移除游戏后,生成大厅版本
    # gen_hall()
    # back_up()
    # upload_to_version_dir()
    # version_num_upload()
    print '远程构建完成'
