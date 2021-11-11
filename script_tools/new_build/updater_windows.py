#!/usr/bin/env python
# coding=utf-8

import builder_windows
import buildCfg_windows
import shutil
import os


# 打安装包时,删除动态下载的资源
def remove_self(game):
    if game.res_dir == "" or game.desc == "internal" or game.desc == "resources" or game.desc == "main":
        return
    if os.path.exists(buildCfg_windows.NATIVE_PATH + '/assets' + game.res_dir):
        shutil.rmtree(buildCfg_windows.NATIVE_PATH + '/assets' + game.res_dir)
    return
# def remove_self_withpath(nativepath, game):
#     if game.res_dir == "":
#         return
#     if os.path.exists(nativepath + '/assets' + game.res_dir):
#         shutil.rmtree(nativepath + '/assets' + game.res_dir)
#     return

# 生成本地版本
def gen_local_version(platform, game):
    # 生成本地目录
    if not os.path.exists(platform.local_dir):
        os.mkdir(platform.local_dir)

    # 生成本地游戏目录
    # if not os.path.exists(platform.local_dir + game.game_dir):
    #     os.mkdir(platform.local_dir + game.game_dir)
    # if game.game_dir == '/hall':
    #     builder_windows.build_hall_pro(platform.local_dir + game.game_dir)
    # else:
    #     builder_windows.build_empty_pro(platform.local_dir + game.game_dir, game.res_dir)

    if os.path.exists(platform.local_dir + game.game_dir):
        shutil.rmtree(platform.local_dir + game.game_dir, True)
    if os.path.exists(buildCfg_windows.NATIVE_PATH + '/assets' + game.res_dir) and game.res_dir != "":
        shutil.copytree(buildCfg_windows.NATIVE_PATH + '/assets' + game.res_dir, platform.local_dir + game.game_dir)
    if not os.path.exists(platform.local_dir + game.game_dir):
        os.mkdir(platform.local_dir + game.game_dir)

    # 生成本地版本
    version = platform.empty_version
    if game.res_dir == '' or game.desc == 'internal' or game.desc == 'resources' or game.desc == 'main':
        version = game.version
    url = platform.remote_url + game.game_dir + '/'
    version_url = platform.remote_url_version + game.game_dir + '/'
    src = platform.local_dir + game.game_dir + '/'
    des = platform.local_dir + game.game_dir + '/'
    cmd = 'node ../version_generator.js -v {0} -u {1} -s {2} -d {3}'
    cmd_version = cmd.format(version, version_url, src, des)
    os.system(cmd_version)

    # 生成项目游戏版本目录
    if not os.path.exists(buildCfg_windows.NATIVE_VERSIONS_PATH):
        os.mkdir(buildCfg_windows.NATIVE_VERSIONS_PATH)
    if not os.path.exists(buildCfg_windows.NATIVE_VERSIONS_PATH + game.game_dir):
        os.mkdir(buildCfg_windows.NATIVE_VERSIONS_PATH + game.game_dir)

    # 拷贝本地版本到项目
    shutil.copyfile(platform.local_dir + game.game_dir + "/project.manifest",
                    buildCfg_windows.NATIVE_VERSIONS_PATH + game.game_dir + "/project.manifest")
    shutil.copyfile(platform.local_dir + game.game_dir + "/version.manifest",
                    buildCfg_windows.NATIVE_VERSIONS_PATH + game.game_dir + "/version.manifest")
    return

# def gen_local_version_withpath(nativepath,platform, game):
#     versionpath = nativepath + "/assets/versions"
#     # 生成本地目录
#     if not os.path.exists(platform.local_dir):
#         os.mkdir(platform.local_dir)
#
#     # 生成本地游戏目录
#     if not os.path.exists(platform.local_dir + game.game_dir):
#         os.mkdir(platform.local_dir + game.game_dir)
#     if game.game_dir == '/hall':
#         builder_windows.build_hall_pro(platform.local_dir + game.game_dir)
#     else:
#         builder_windows.build_empty_pro(platform.local_dir + game.game_dir)
#
#     # 生成本地版本
#     version = platform.empty_version
#     if game.res_dir == '':
#         version = game.version
#     url = platform.remote_url + game.game_dir + '/'
#     version_url = platform.remote_url_version + game.game_dir + '/'
#     src = platform.local_dir + game.game_dir + '/'
#     des = platform.local_dir + game.game_dir + '/'
#     cmd = 'node ../version_generator.js -v {0} -u {1} -vu {2} -s {3} -d {4}'
#     cmd_version = cmd.format(version, url, version_url, src, des)
#     os.system(cmd_version)
#
#     # 生成项目游戏版本目录
#     if not os.path.exists(versionpath):
#         os.mkdir(versionpath)
#     if not os.path.exists(versionpath + game.game_dir):
#         os.mkdir(versionpath + game.game_dir)
#
#     # 拷贝本地版本到项目
#     shutil.copyfile(platform.local_dir + game.game_dir + "/project.manifest",
#                     versionpath + game.game_dir + "/project.manifest")
#     shutil.copyfile(platform.local_dir + game.game_dir + "/version.manifest",
#                     versionpath + game.game_dir + "/version.manifest")
#     return


# 生成远程版本
def gen_remote_version(platform, game):
    # 生成远程目录
    if not os.path.exists(platform.remote_dir):
        os.mkdir(platform.remote_dir)

    # 生成远程游戏目录
    # if not os.path.exists(platform.remote_dir + game.game_dir):
    #     os.mkdir(platform.remote_dir + game.game_dir)
    # if game.game_dir == '/hall':
    #     builder_windows.build_hall_pro(platform.remote_dir + game.game_dir)
    # else:
    #     builder_windows.build_empty_pro(platform.remote_dir + game.game_dir)

    if os.path.exists(platform.remote_dir + game.game_dir):
        shutil.rmtree(platform.remote_dir + game.game_dir, True)
    if os.path.exists(buildCfg_windows.NATIVE_PATH + '/assets' + game.res_dir) and game.res_dir != "":
        shutil.copytree(buildCfg_windows.NATIVE_PATH + '/assets' + game.res_dir, platform.remote_dir + game.game_dir)
    if not os.path.exists(platform.remote_dir + game.game_dir):
        os.mkdir(platform.remote_dir + game.game_dir)

    # # 拷贝游戏资源
    # if game.res_dir != '':
    #     shutil.copytree(buildCfg_windows.NATIVE_PATH + '/assets' + game.res_dir,
    #                     platform.remote_dir + game.game_dir + '/assets' + game.res_dir)

    # 生成远程版本
    url = platform.remote_url + game.game_dir + '/'
    version_url = platform.remote_url_version + game.game_dir + '/'
    src = platform.remote_dir + game.game_dir + '/'
    des = platform.remote_dir + game.game_dir + '/'
    cmd = 'node ../version_generator.js -v {0} -u {1} -s {2} -d {3}'
    cmd_version = cmd.format(game.version, version_url, src, des)
    os.system(cmd_version)

    if game.zip_name == '':
        return

    # 生成压缩包
    if not os.path.exists(platform.remote_dir + '/zip'):
        os.mkdir(platform.remote_dir + '/zip')
    builder_windows.make_zip(platform.remote_dir + game.game_dir, platform.remote_dir + '/zip/' + game.zip_name)

    # 拷贝压缩包
    if not os.path.exists(platform.remote_dir + game.game_dir + '/zip'):
        os.mkdir(platform.remote_dir + game.game_dir + '/zip')
    shutil.copyfile(platform.remote_dir + '/zip/' + game.zip_name,
                    platform.remote_dir + game.game_dir + '/zip/' + game.zip_name)

    # 生成压缩包版本
    url = platform.remote_url + game.game_dir + '/'
    version_url = platform.remote_url_version + game.game_dir + '/'
    src = platform.remote_dir + game.game_dir + '/'
    des = platform.remote_dir + game.game_dir + '/'
    cmd = 'node ../version_generator_with_zip.js -v {0} -u {1} -s {2} -d {3}'
    cmd_version = cmd.format(game.version, version_url, src, des)
    os.system(cmd_version)

    # 删除游戏内压缩包
    shutil.rmtree(platform.remote_dir + game.game_dir + '/zip', True)

    return


# 生成远程版本号
def gen_remote_num_version(platform, game):
    # 生成远程版本号目录
    if not os.path.exists(platform.remote_version_dir):
        os.mkdir(platform.remote_version_dir)

    # 拷贝版本
    shutil.rmtree(platform.remote_version_dir + game.game_dir, True)

    shutil.copytree(platform.remote_dir + game.game_dir, platform.remote_version_dir + game.game_dir)

    if game.zip_name == '':
        return

    # 拷贝压缩包
    if not os.path.exists(platform.remote_version_dir + '/zip'):
        os.mkdir(platform.remote_version_dir + '/zip')
    shutil.copyfile(platform.remote_dir + '/zip/' + game.zip_name,
                    platform.remote_version_dir + '/zip/' + game.zip_name)
    return
