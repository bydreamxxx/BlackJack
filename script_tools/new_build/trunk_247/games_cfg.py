#!/usr/bin/env python
# coding=utf-8


class Game:
    def __init__(self, desc, date, version, game_dir, res_dir, zip_name):
        self.desc = desc
        self.date = date
        self.version = version
        self.game_dir = game_dir
        self.res_dir = res_dir
        self.zip_name = zip_name


# 大厅
hall = Game('大厅', '2018-7-13', '64.2.0.6', '/hall', '', '')

# 游戏配置
games = [
    # 配置参数: 描述 日期 版本号 游戏目录 资源目录(为空代表内含资源) 压缩文件名
    # Game('港式五张', '2018-11-21', '1.0.1.4', '/suoha', '/gameyj_suoha', 'suoha.zip'),
    # Game('红包扫雷', '2019-04-01', '1.0.1.8', '/hbsl', '/gameyj_hbsl', 'hbsl.zip'),
    # Game('麻将', '2019-04-01', '1.0.0.0', '/majiang', '/gameyj_mj', 'majiang.zip'),
    # Game('赤峰麻将', '2019-11-26', '1.0.0.0', '/majiangneimenggu', '/gameyj_mj_neimenggu', 'majiangneimenggu.zip'),
    # Game('麻将工具', '2019-11-26', '1.0.0.0', '/majiangtools', '/gameyj_mj_tools', 'majiangtools.zip'),
    # Game('单挑', '2019-04-01', '1.0.1.7', '/dantiao', '/gameyj_one_on_one', 'dantiao.zip'),
    # Game('斗地主', '2019-04-01', '1.0.2.6', '/doudizhu', '/gameyj_ddz', 'doudizhu.zip'),
    # Game('填大坑', '2018-11-21', '1.0.5.7', '/tiandakeng', '/gameyj_tiandakeng', 'tiandakeng.zip'),
    # Game('三打一', '2018-11-21', '1.0.0.0', '/shandayi', '/gameyj_sdy', 'shandayi.zip'),
    # Game('拼双十', '2018-11-21', '1.0.6.2', '/pinshuangshi', '/gameyj_nn', 'pinshuangshi.zip'),
    # Game('财神到', '2018-11-21', '1.0.1.3', '/caishendao', '/gameyj_mammon_slot', 'caishendao.zip'),
    # Game('上梁山', '2018-11-21', '1.0.6.3', '/shangliangshan', '/gameyj_water_margin_slot', 'shangliangshan.zip'),
    # Game('疯狂拼十', '2018-11-21', '1.0.6.6', '/fengkuangpinshi', '/gameyj_brnn', 'fengkuangpinshi.zip'),
    # Game('刨幺', '2018-11-21', '1.0.7.1', '/paoyao', '/gameyi_paoyao', 'paoyao.zip'),
    # Game('逗三张', '2018-11-21', '1.0.5.5', '/dousanzhang', '/gameyj_dsz', 'dousanzhang.zip'),
    # Game('新逗三张', '2018-11-21', '1.0.0.1', '/xinsanzhang', '/gameyj_new_dsz', 'xinsanzhang.zip'),
    Game('苹果', '2018-11-21', '2.0.1.3', '/pkg', '', ''),
    Game('安卓', '2018-11-21', '2.0.1.4', '/pkgandroid', '', ''),
    # ----------大厅需要放在最后 请在此上增加配置 ------------
    hall
]
