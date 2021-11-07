#!/usr/bin/env python
# coding=utf-8

import commands
import os
import shutil

import buildCfg_windows
import zipfile
import platform
import re

def clean():
    shutil.rmtree(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/app/build', True)

def getFileContent(fileName):
    all_the_text = ""
    try:
        file_object = open(fileName, 'r')
        all_the_text = file_object.read()
        file_object.close()
    except:
        pass
    return all_the_text


def writeFileContent(fileName, strContent, strEncoding='utf-8'):
    try:
        # if getFileContent(fileName)==strContent:
        # return
        bycontent = strContent.encode('utf-8')
        output = open(fileName, 'wb')
        output.write(bycontent)
        output.close()
    except:
        pass
    return


# cocos 构建
def cocos_build():
    gen_scene_dir_cfg()
    os.system(buildCfg_windows.COCOS_CMD)
    return

def cocos_build_withcmd(cmd):
    gen_scene_dir_cfg()
    os.system(cmd)
    return

#在当前目录查找文件名包含指定字符串的文件
def search_file(dir,sname):
    for dire in os.listdir(dir):
        # print("dire:",dire)
        if sname in dire: #检验文件名里是否包含sname
            return True,dire

    return False,''
    # if os.path.isfile(dir):   # 如果传入的dir直接是一个文件目录 他就没有子目录，就不用再遍历它的子目录了
    #     return

    # for dire in os.listdir(dir): # 遍历子目录  这里的dire为当前文件名
    #     search_file(os.path.join(dir,dire),sname) #jion一下就变成了当前文件的绝对路径
    #                                        # 对每个子目录路劲执行同样的操作

    """
    max_dif: 允许最大hash差值, 越小越精确,最小为0
    True: 相同
    False: 不同
    """
def compare_image_with_hash(image_file_name_1, image_file_name_2, max_dif=0):
    ImageFile.LOAD_TRUNCATED_IMAGES = True
    hash_1 = None
    hash_2 = None
    # print("image_file_name_1:",image_file_name_1)
    # print("image_file_name_2:",image_file_name_2)
    with open(image_file_name_1, 'rb') as fp:
        hash_1 = imagehash.average_hash(Image.open(fp))
    with open(image_file_name_2, 'rb') as fp:
        hash_2 = imagehash.average_hash(Image.open(fp))
    dif = hash_1 - hash_2
    # print("dif:",dif)
    if dif < 0:
        dif = -dif
    if dif <= max_dif:
        return True
    else:
        return False
    # onlyModify:if true,will only compress png files which modified.
def compressPngAssets(onlyModify,needChoose):
    file_filter_list = []
    #登录界面
    # file_filter_list.append("denglu-1.png")
    # file_filter_list.append("DT.png")
    # file_filter_list.append("dss-bg-yuanzhuo.png")
    # file_filter_list.append("common-1.png")
    # file_filter_list.append("loading1.png")
    # file_filter_list.append("loading2.png")
    # file_filter_list.append("wait.png")
    # file_filter_list.append("zn_di_jujue.png")
    # file_filter_list.append("prompt_bg.png")
    # file_filter_list.append("tdk_bg2.png")

    ipt=1
    if needChoose:
        print(u"请选择压缩目录:")
        print(u"""
        ============压缩图片==========
        1:压缩web-mobile
        2:压缩web-desktop
        """)
        ipt=input("input:")

    tempPath = ''
    difDir = ''
    if ipt == 1:
        difDir = 'web-mobile'
        tempPath = 'h5Temp'
    else:
        difDir = 'web-desktop'
        tempPath = 'desktopTemp'


    path = buildCfg_windows.H5_PATH + difDir+'/assets/resources/native'
    path_temp_ori = buildCfg_windows.H5_TEMP_PATH + tempPath +'/last_ori/assets/resources/native'
    path_temp_compress = buildCfg_windows.H5_TEMP_PATH+ tempPath  + '/last_compress/assets/resources/native'
    logFile = buildCfg_windows.H5_TEMP_PATH+ tempPath  + '/../log.txt'

    if not os.path.exists(path_temp_ori):
        os.makedirs(path_temp_ori)
    if not os.path.exists(path_temp_compress):
        os.makedirs(path_temp_compress)

    ftxt=open(logFile,'w+')
    ftxt.write('压缩日志：\n')
    ftxt.close()


    path_filter_list = []
    # path_filter_list.append(path+"/gameyj_mj/common/textures/tanchuang/AutoAtlas-1.png")
    tool = "/Applications/TexturePacker.app/Contents/MacOS/TexturePacker"
    for dir_path, dir_names, filenames in os.walk(path):
        for file in filenames:
            if not file.endswith('.png'):
                continue
            if file_filter_list.count(file) > 0:
                continue
            file_path = os.path.join(dir_path, file)
            if path_filter_list.count(file_path) > 0:
                continue

            tempPngPath = file_path.replace(difDir, tempPath+'/last_ori')
            if os.path.exists(tempPngPath):
                if not compare_image_with_hash(tempPngPath,file_path,0):
                    print file_path+' has modified,now compressing'
                    # os.system("pause")
                    #copy ori file before compressing
                    shutil.copyfile(file_path, tempPngPath)

                    png_path = file_path.replace('.png', '.back.png');
                    cmd = """%s %s --sheet %s --format "cocos2d" --texture-format "png8" --opt "RGBA8888" --dither-type "PngQuantMedium" --max-width 4096 --max-height 4096 --trim-mode "None" --extrude 0 """ % (tool, file_path, png_path)
                    os.system(cmd)
                    os.remove(file_path)
                    os.rename(png_path, file_path)
                    #write log
                    with open(logFile,"a") as f:
                        f.write("修改:"+file_path+"\n")

                    #copy compressed png file to last compressed file
                    tmp_dir_path = dir_path.replace(difDir, tempPath + '/last_compress')
                    if not os.path.exists(tmp_dir_path):
                        os.makedirs(tmp_dir_path)
                    tempCompressedPngPath = file_path.replace(difDir, tempPath + '/last_compress')
                    shutil.copyfile(file_path,tempCompressedPngPath)
                else:
                    #copy last compressed png file
                    # print file_path+' not changed,copy last file'
                    tempCompressedPngPath = file_path.replace(difDir, tempPath + '/last_compress')
                    shutil.copyfile(tempCompressedPngPath, file_path)
                    with open(logFile,"a") as f:
                        f.write("                 复制未改变文件:"+file_path+"\n")

            else:
                #copy ori file before compressing
                tmp_dir_path = dir_path.replace(difDir, tempPath + '/last_ori')
                if not os.path.exists(tmp_dir_path):
                    os.makedirs(tmp_dir_path)
                #delete same file with different md5
                #名字不能含有.不然这里判断有问题
                oriName = file.split('.')[0]
                print("oriName:",oriName)
                finded,oldfile = search_file(tmp_dir_path,oriName)
                if finded:
                    fileTodel = tmp_dir_path+'/'+oldfile
                    print("dir_path contains old file: "+fileTodel+",now deleting old file.")
                    os.remove(fileTodel)
                    with open(logFile,"a") as f:
                        f.write("    删除:"+fileTodel+"\n")

                # os.system("pause")
                print file_path+' not in temp dirs,now copy and compressing'
                shutil.copyfile(file_path, tempPngPath)

                png_path = file_path.replace('.png', '.back.png');
                cmd = """%s %s --sheet %s --format "cocos2d" --texture-format "png8" --opt "RGBA8888" --dither-type "PngQuantMedium" --max-width 4096 --max-height 4096 --trim-mode "None" --extrude 0 """ % (tool, file_path, png_path)
                os.system(cmd)
                os.remove(file_path)
                os.rename(png_path, file_path)


                #copy compressed png file to last compressed file
                tmp_dir_path = dir_path.replace(difDir, tempPath + '/last_compress')
                if not os.path.exists(tmp_dir_path):
                    os.makedirs(tmp_dir_path)
                tempCompressedPngPath = file_path.replace(difDir, tempPath + '/last_compress')
                shutil.copyfile(file_path,tempCompressedPngPath)
                with open(logFile,"a") as f:
                    f.write("  新增:"+file_path+"\n")


    return


def gen_etc2():
    file_filter_list = []
    #登录界面
    # file_filter_list.append("denglu-1.png")
    # file_filter_list.append("DT.png")
    # file_filter_list.append("dss-bg-yuanzhuo.png")
    # file_filter_list.append("common-1.png")
    # file_filter_list.append("loading1.png")
    # file_filter_list.append("loading2.png")
    # file_filter_list.append("wait.png")
    # file_filter_list.append("zn_di_jujue.png")
    # file_filter_list.append("prompt_bg.png")
    # file_filter_list.append("tdk_bg2.png")
    path = buildCfg_windows.NATIVE_PATH + '/assets/resources/native'
    path_filter_list = []
    # path_filter_list.append(path+"/gameyj_mj/common/textures/tanchuang/AutoAtlas-1.png")
    tool = "/Applications/TexturePacker.app/Contents/MacOS/TexturePacker"
    for dir_path, dir_names, filenames in os.walk(path):
        for file in filenames:
            if not file.endswith('.png'):
                continue
            if file_filter_list.count(file) > 0:
                continue
            file_path = os.path.join(dir_path, file)
            if path_filter_list.count(file_path) > 0:
                continue
            pvr_path = file_path.replace('.png', '.pvr.ccz');
            cmd = """%s %s --sheet %s --format "cocos2d" --texture-format "pvr3ccz" --opt "ETC2_RGBA" --max-width 4096 --max-height 4096 --trim-mode "None" --extrude 0 """ % (
            tool, file_path, pvr_path)
            os.system(cmd)
            os.remove(file_path)
            os.rename(pvr_path, file_path)
    return

def gen_etc2_withpath(nativePath):
    file_filter_list = []
    #登录界面
    file_filter_list.append("denglu-1.png")
    file_filter_list.append("DT.png")
    file_filter_list.append("dss-bg-yuanzhuo.png")
    file_filter_list.append("common-1.png")
    file_filter_list.append("loading1.png")
    file_filter_list.append("loading2.png")
    file_filter_list.append("wait.png")
    file_filter_list.append("zn_di_jujue.png")
    file_filter_list.append("prompt_bg.png")
    file_filter_list.append("tdk_bg2.png")
    path = nativePath + '/res/raw-assets/resources'
    path_filter_list = []
    path_filter_list.append(path+"/gameyj_mj/common/textures/tanchuang/AutoAtlas-1.png")
    tool = "/Applications/TexturePacker2.app/Contents/MacOS/TexturePacker"
    for dir_path, dir_names, filenames in os.walk(path):
        for file in filenames:
            if not file.endswith('.png'):
                continue
            if file_filter_list.count(file) > 0:
                continue
            file_path = os.path.join(dir_path, file)
            if path_filter_list.count(file_path) > 0:
                continue
            pvr_path = file_path.replace('.png', '.pvr.ccz');
            cmd = """%s %s --sheet %s --format "cocos2d" --texture-format "pvr3ccz" --opt "ETC2_RGBA" --max-width 4096 --max-height 4096 --trim-mode "None" --extrude 0 """ % (
            tool, file_path, pvr_path)
            os.system(cmd)
            os.remove(file_path)
            os.rename(pvr_path, file_path)
    return


# 压缩图片
def tinify_images():
    pro_path = buildCfg_windows.NATIVE_PATH + '/res/raw-assets/resources/'
    #os.system('rm -rf {0}*'.format(buildCfg_windows.TINIFY_PATH))
    #os.system('cp -rf {0}* {1}'.format(pro_path, buildCfg_windows.TINIFY_PATH))
    shutil.rmtree(buildCfg_windows.TINIFY_PATH)
    shutil.copytree(pro_path, buildCfg_windows.TINIFY_PATH)
    for dir_path, dir_names, file_names in os.walk(buildCfg_windows.TINIFY_PATH):
        for file in file_names:
            file_path = os.path.join(dir_path, file)
            if buildCfg_windows.TINIFY_SKIP_LIST.count(file_path) > 0:
                print '过滤图片 ' + file_path
                continue
            if file.endswith('.png'):
                print '压缩图片 ' + file_path
                source = tinify.from_file(file_path)
                source.to_file(file_path)
    return


# 压缩图片
def tinify_dir_images(dir):
    pro_dir_path = buildCfg_windows.NATIVE_PATH + '/res/raw-assets/resources/' + dir + '/'
    tinify_dir_path = buildCfg_windows.TINIFY_PATH + dir + '/'
    if os.path.exists(tinify_dir_path):
        #os.system('rm -rf {0}*'.format(tinify_dir_path))
        shutil.rmtree(tinify_dir_path)
    else:
        os.mkdir(tinify_dir_path)
    #os.system('cp -rf {0}* {1}'.format(pro_dir_path, tinify_dir_path))
    shutil.copytree(pro_dir_path, tinify_dir_path)
    for dir_path, dir_names, file_names in os.walk(tinify_dir_path):
        for file in file_names:
            file_path = os.path.join(dir_path, file)
            if buildCfg_windows.TINIFY_SKIP_LIST.count(file_path) > 0:
                print '过滤图片 ' + file_path
                continue
            if file.endswith('.png'):
                print '压缩图片 ' + file_path
                source = tinify.from_file(file_path)
                source.to_file(file_path)
    return


# 拷贝压缩图片
def copy_tinify_images():
    pro_path = buildCfg_windows.NATIVE_PATH + '/res/raw-assets/resources/'
    #os.system('cp -r {0}* {1}'.format(buildCfg_windows.TINIFY_PATH, pro_path))
    if os.path.exists(pro_path):
        shutil.rmtree(pro_path)
    shutil.copytree(buildCfg_windows.TINIFY_PATH, pro_path)
    return


# 构建空资源工程
def build_empty_pro(des_path):
    if not os.path.exists(des_path):
        os.mkdir(des_path)

    shutil.rmtree(des_path + '/zip', True)

    os.mkdir(des_path + "/zip")
    return


# 构建大厅资源工程
def build_hall_pro(des_path):
    if not os.path.exists(des_path):
        os.mkdir(des_path)

    shutil.rmtree(des_path + '/src', True)
    shutil.rmtree(des_path + '/assets', True)

    shutil.copytree(buildCfg_windows.NATIVE_PATH + '/src', des_path + '/src')
    os.mkdir(des_path + '/assets')
    shutil.copytree(buildCfg_windows.NATIVE_PATH + '/assets/internal', des_path + '/assets/internal')
    shutil.copytree(buildCfg_windows.NATIVE_PATH + '/assets/resources', des_path + '/assets/resources')
    shutil.copytree(buildCfg_windows.NATIVE_PATH + '/assets/main', des_path + '/assets/main')
    return


# 拷贝main入口文件
def copy_main_code_to_project():
    # if os.path.exists(buildCfg_windows.NATIVE_PATH + '/main.jsc'):
    #     os.remove(buildCfg_windows.NATIVE_PATH + '/main.jsc')
    # if os.path.exists(buildCfg_windows.NATIVE_PATH + '/main.js'):
    #     os.remove(buildCfg_windows.NATIVE_PATH + '/main.js')
    # shutil.copyfile('./main.js', buildCfg_windows.NATIVE_PATH + '/main.js')
    print('changing main.js')

    mainjs=getFileContent(buildCfg_windows.NATIVE_PATH + '/main.js')
    if re.search(r"""    var bundleRoot = \[INTERNAL\];
    settings\.hasResourcesBundle && bundleRoot\.push\(RESOURCES\);

    var count = 0;
    function cb \(err\) \{
        if \(err\) return console\.error\(err\.message, err\.stack\);
        count\+\+;
        if \(count === bundleRoot\.length \+ 1\) \{
            cc\.assetManager\.loadBundle\(MAIN, function \(err\) \{
                if \(!err\) cc\.game\.run\(option, onStart\);
            \}\);
        \}
    \}""", mainjs):
        mainjs = re.sub(r"""    var bundleRoot = \[INTERNAL\];
    settings\.hasResourcesBundle && bundleRoot\.push\(RESOURCES\);

    var count = 0;
    function cb \(err\) \{
        if \(err\) return console\.error\(err\.message, err\.stack\);
        count\+\+;
        if \(count === bundleRoot\.length \+ 1\) \{
            cc\.assetManager\.loadBundle\(MAIN, function \(err\) \{
                if \(!err\) cc\.game\.run\(option, onStart\);
            \}\);
        \}
    \}""", """    var bundleRoot = [INTERNAL];
    bundleRoot.push(MAIN);
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

    var count = 0;
    function cb (err) {
        if (err) return console.error(err.message, err.stack);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.game.run(option, onStart);
        }
    }""", mainjs)
    writeFileContent(buildCfg_windows.NATIVE_PATH + '/main.js',mainjs)

    settings=getFileContent(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/settings.gradle')
    if re.search(r"include ':libcocos2dx',':game', ':instantapp'", settings):
        settings = re.sub(r"include ':libcocos2dx',':game', ':instantapp'", "include ':libcocos2dx'", settings)
    writeFileContent(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/settings.gradle',settings)

    if os.path.exists(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/instantapp/'):
        shutil.rmtree(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/instantapp/')
    if os.path.exists(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/game/'):
        shutil.rmtree(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/game/')
    return

def copy_main_code_to_project_withpath(nativepath):
    if os.path.exists(nativepath + '/main.jsc'):
        os.remove(nativepath + '/main.jsc')
    if os.path.exists(nativepath + '/main.js'):
        os.remove(nativepath + '/main.js')
    shutil.copyfile('./main.js', nativepath + '/main.js')
    return

def change_android_ndk_path():
    content = getFileContent(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/local.properties',)
    lines = content.splitlines()
    new_content = ''
    for i in range(len(lines)):
        if "ndk.dir=" in lines[i]:
            lines[i] = 'ndk.dir=' + buildCfg_windows.NDK_PATH
        new_content += lines[i]
        new_content += '\n'
    writeFileContent(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/local.properties', new_content)
    return


# 生成apk
def generate_apk(output_path):
    # change_android_ndk_path()
    os.chdir(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/')
    cmd = './gradlew assembleRelease'
    if platform.system() == "Windows":
        cmd = 'gradlew assembleRelease'
    os.system(cmd)
    # os.chdir(output_path)
    #os.system('cp -r {0} {1}'.format(os.path.abspath(
    #    buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/xlqp-release.apk'), './xlqp-release.apk'))
    # shutil.copyfile(buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/release/blackjack-release.apk', './blackjack-release.apk')
    return

def generate_apk_withpath(NATIVE_PATH,output_path):
    # change_android_ndk_path()
    os.chdir(NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/')
    cmd = './gradlew assembleRelease'
    if platform.system() == "Windows":
        cmd = 'gradlew assembleRelease'
    os.system(cmd)
    os.chdir(output_path)
    #os.system('cp -r {0} {1}'.format(os.path.abspath(
    #    buildCfg_windows.NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/xlqp-release.apk'), './xlqp-release.apk'))
    shutil.copyfile(NATIVE_PATH + '/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/release/xlqp-release.apk', './xlqp-release.apk')
    return


def make_zip(source_dir, output_filename):
    zipf = zipfile.ZipFile(output_filename, 'w')
    pre_len = len(os.path.dirname(source_dir))
    for parent, dirnames, filenames in os.walk(source_dir):
        for filename in filenames:
            pathfile = os.path.join(parent, filename)
            arcname = pathfile[pre_len:].strip(os.path.sep)  # 相对路径
            zipf.write(pathfile, arcname)
    zipf.close()
    return


def gen_scene_dir_cfg():
    path = buildCfg_windows.COCOS_PROJECT_PATH+'/assets/resources/script/scene_dir_cfg.js'
    template = """
var scene_dir_cfg = {
%s
}
module.exports = scene_dir_cfg;
    """
    template_attr = """     "%s":"%s",
"""

    content_attr = ''
    for dir_path, dir_names, file_names in os.walk(buildCfg_windows.COCOS_PROJECT_PATH):
        for file in file_names:
            if not file.endswith('.fire'):
                continue
            scene_name = file.split('.fire')[0]
            abs_path = os.path.join(dir_path, file)
            abs_path = abs_path.replace('\\', '/')
            scene_dir = abs_path.split('assets/')[1].split('/')[0]
            if scene_dir == "resources":
                scene_dir = abs_path.split('resources/')[1].split('/')[0]
            content_attr += template_attr % (scene_name, scene_dir)
    content = template % content_attr
    writeFileContent(path, content)
    return


