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
    cmd = "C:/CocosDashboard_1.0.11/resources/.editors/Creator/2.4.6/CocosCreator.exe --path ../../../  --build \"platform=web-mobile;debug=false;buildPath=E:/build-246;md5Cache=true;inlineSpriteFrames=true\" "
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

if __name__ == "__main__":
    cocos_build()
    # compressRes()
    # copy_h5_assets()
    make_zip('E:/build-246/web-mobile/', 'E:/build-246/web-mobile.zip')
    # upload()
