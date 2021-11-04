#!/usr/bin/env python
# coding=utf-8

import shutil
import os
import commands
import zipfile
import glob
import re
import codecs

isTest = True

def getFileContent(fileName):
    all_the_text = ""
    try:
        file_object = codecs.open(fileName, encoding='utf-8')
        # file_object.seek(0)
        all_the_text = file_object.read()
        # for line in file_object:
        #     print(line.strip())
        file_object.close()
    except Exception as e:
        print(e)
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
    except Exception as e:
        print(e)
        pass
    return

# def copy_h5_assets():
#     path = '10019'
#     if isTest:
#         path = 'test'
#
#     for _parent, _dirnames, _filenames in os.walk('./' + path + '/'):
#         for _filename in _filenames:
#             _pathfile = os.path.join(_parent, _filename)
#             _des_file = _pathfile.replace('./' + path + '/', '', 1)
#             shutil.copyfile(_pathfile, './h5_assets/' + _des_file)
#
#     for parent, dirnames, filenames in os.walk('./h5_assets/'):
#         for dirname in dirnames:
#             if not os.path.exists('../../..build-246/web-mobile/'+dirname):
#                 os.mkdir('../build-246/web-mobile/'+dirname)
#         for filename in filenames:
#             pathfile = os.path.join(parent, filename)
#             des_file = pathfile.replace('./h5_assets/', '', 1)
#             print des_file
#             shutil.copyfile(pathfile, '../../../build-246/web-mobile/'+des_file)


def cocos_build():
    cmd = "C:/CocosDashboard_1.0.11/resources/.editors/Creator/2.4.6/CocosCreator.exe --path ../../../  --build \"platform=web-mobile;debug=false;buildPath=./build-246;md5Cache=true;inlineSpriteFrames=true\" "
    os.system(cmd)


def make_zip(source_dir, output_filename):
    zipf = zipfile.ZipFile(output_filename, 'w')
    pre_len = len(os.path.dirname(source_dir))
    for parent, dirnames, filenames in os.walk(source_dir):
        for filename in filenames:
            pathfile = os.path.join(parent, filename)
            arcname = pathfile[pre_len:].strip(os.path.sep)  # 相对路径
            zipf.write(pathfile, arcname)
    zipf.close()


# def upload():
#     make_zip('../build/web-mobile', 'jlmj-h5.zip')
#     os.system('scp -r ./jlmj-h5.zip root@47.93.193.205:/usr/share/nginx/html/')
#     os.system('ssh root@47.93.193.205 \'unzip -o /usr/share/nginx/html/jlmj-h5.zip -d /usr/share/nginx/html/\'')
#     os.system('ssh root@47.93.193.205 \'\\cp -rf  /usr/share/nginx/html/web-mobile/* /usr/share/nginx/html/jlmj\'')

def compressRes():
    cmd = "python ../trunk_247/compressH5Res_mobile.py"
    os.system(cmd)

def modify_md5():
    # #删除index.html
    # if os.path.exists('../../../build-246/web-mobile/index.html'):
    #     os.remove('../../../build-246/web-mobile/index.html')

    gmfile=glob.glob('../../../build-246/web-mobile/main*.js')
    mainfile = gmfile[0][-13:]
    print(mainfile)
    # settingsfile=glob.glob('../../../build-246/web-mobile/src/settings*.js')[0][-17:]
    # print(settingsfile)
    # projectfile=glob.glob('../../../build-246/web-mobile/src/project*.js')[0][-16:]
    # print(projectfile)
    #
    # if isTest:
    #     project = getFileContent('../../../build-246/web-mobile/src/'+projectfile)
    #     if re.search(r'H5PID:3,', project):
    #         project = re.sub(r'H5PID:3,', 'H5PID:1,', project)
    #     if re.search(r'cc.pid=3,', project):
    #         project = re.sub(r'cc.pid=3,', 'cc.pid=1,', project)
    #     writeFileContent('../../../build-246/web-mobile/src/'+projectfile, project)

    # #modify index.php
    # print('changing index.php')
    # indexphp=getFileContent('../../../build-246/web-mobile/index.php')
    # if re.search(r'main.*.js" charset=',indexphp):
    #     indexphp=re.sub(r'main.*.js" charset=',mainfile+'" charset=',indexphp)
    #     print('replaced main file')
    #
    # if re.search(r'"src/settings.*.js" charset=',indexphp):
    #     indexphp=re.sub(r'"src/settings.*.js" charset=','"src/'+settingsfile+'" charset=',indexphp)
    #     print('replaced settings file')
    # writeFileContent('../../../build-246/web-mobile/index.php',indexphp)


    #modify main.js
    print('changing main.js')
    mainjs=getFileContent('../../../build-246/web-mobile/'+mainfile)
    # if re.search(r": 'src/project.*.js';",mainjs):
    #     mainjs=re.sub(r": 'src/project.*.js';",": 'src/"+projectfile+"';",mainjs)
    #     print('replaced project file')
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
    writeFileContent('../../../build-246/web-mobile/'+mainfile,mainjs)


    # #modify index_desktop.html
    # print('changing index_desktop.html')
    # deskhtml=getFileContent('../../../build-246/web-mobile/index_desktop.html')
    # if re.search(r'main.*.js" charset=',deskhtml):
    #     deskhtml=re.sub(r'main.*.js" charset=',mainfile+'" charset=',deskhtml)
    #     print('replaced main file')
    #
    # if re.search(r'"src/settings.*.js" charset=',deskhtml):
    #     deskhtml=re.sub(r'"src/settings.*.js" charset=','"src/'+settingsfile+'" charset=',deskhtml)
    #     print('replaced settings file')
    # writeFileContent('../../../build-246/web-mobile/index_desktop.html',deskhtml)

if __name__ == "__main__":
    cocos_build()
    # compressRes()
    # copy_h5_assets()
    modify_md5()
    make_zip('E:/AnotherWorkspace/client/jilinmajiang243/build-246/web-mobile/', 'E:/AnotherWorkspace/client/jilinmajiang243/build-246/web-mobile.zip')
    # upload()
