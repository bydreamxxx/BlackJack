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


# 游戏配置
games = [
    # 配置参数: 描述        日期         版本号        游戏目录        资源目录(为空代表内含资源) 压缩文件名
    Game('blackjack', '2021-11-03', '1.0.0.1', '/blackjack_blackjack', '/blackjack_blackjack', 'blackjack.zip'),
    # Game('快乐吧', '2021-11-03', '1.0.0.0', '/gamedl_majiang', '/gamedl_majiang', 'dlmajiang.zip'),
    # Game('大话西游', '2021-11-03', '1.0.0.0', '/gameyj_big_talk_westward_journey', '/gameyj_big_talk_westward_journey', 'dhxy.zip'),
    # Game('飞禽走兽', '2021-11-03', '1.0.0.0', '/gameyj_birds_and_animals', '/gameyj_birds_and_animals', 'fqzs.zip'),
    # Game('百人牛牛', '2021-11-03', '1.0.0.0', '/gameyj_brnn', '/gameyj_brnn', 'brnn.zip'),
    # Game('斗地主', '2021-11-03', '1.0.0.0', '/gameyj_ddz', '/gameyj_ddz', 'ddz.zip'),
    # Game('捕鱼', '2021-11-03', '1.0.0.0', '/gameyj_fish', '/gameyj_fish', 'fish.zip'),
    # Game('捕鱼达人', '2021-11-03', '1.0.0.0', '/gameyj_fish_doyen', '/gameyj_fish_doyen', 'fishdoyen.zip'),
    # Game('亲友圈', '2021-11-03', '1.0.0.0', '/gameyj_friend', '/gameyj_friend', 'friend.zip'),
    # Game('赛马', '2021-11-03', '1.0.0.0', '/gameyj_horse_racing', '/gameyj_horse_racing', 'horse.zip'),
    # Game('loading', '2021-11-03', '1.0.0.0', '/gameyj_loading', '/gameyj_loading', 'loading.zip'),
    # Game('转盘', '2021-11-03', '1.0.0.0', '/gameyj_lucky_turntable', '/gameyj_lucky_turntable', 'lucky.zip'),
    # Game('slot', '2021-11-03', '1.0.0.0', '/gameyj_mammon_slot', '/gameyj_mammon_slot', 'slot.zip'),
    # Game('斗三张', '2021-11-03', '1.0.0.0', '/gameyj_new_dsz', '/gameyj_new_dsz', 'dsz.zip'),
    # Game('牛牛', '2021-11-03', '1.0.0.0', '/gameyj_nn', '/gameyj_nn', 'nn.zip'),
    # Game('PK', '2021-11-03', '1.0.0.0', '/gameyj_one_on_one', '/gameyj_one_on_one', 'pk.zip'),
    # Game('跑得快', '2021-11-03', '1.0.0.0', '/gameyj_pdk', '/gameyj_pdk', 'pdk.zip'),
    Game('德州', '2021-11-03', '1.0.0.1', '/gameyj_texas', '/gameyj_texas', 'texas.zip'),
    # Game('水浒', '2021-11-03', '1.0.0.0', '/gameyj_water_margin_slot', '/gameyj_water_margin_slot', 'shuihu.zip'),
    # Game('祥云斗地主', '2021-11-03', '1.0.0.0', '/gameyj_xyddz', '/gameyj_xyddz', 'xyddz.zip'),
    # Game('俱乐部百人牛牛', '2021-11-03', '1.0.0.0', '/jlb_brnn', '/jlb_brnn', 'jlbbrnn.zip'),
    # Game('俱乐部牛牛', '2021-11-03', '1.0.0.0', '/jlb_nn', '/jlb_nn', 'jlbnn.zip'),
    Game('苹果', '2021-11-03', '1.0.0.0', '/pkg', '', ''),
    Game('安卓', '2021-11-03', '1.0.0.0', '/pkgandroid', '', ''),
    # ----------大厅需要放在最后 请在此上增加配置 ------------
    Game('internal', '2021-11-03', '1.0.0.1', '/internal', '/internal', 'internal.zip'),
    Game('resources', '2021-11-03', '1.0.0.1', '/resources', '/resources', 'resources.zip'),
    Game('main', '2021-11-03', '1.0.0.0', '/main', '/main', 'main.zip'),
]
