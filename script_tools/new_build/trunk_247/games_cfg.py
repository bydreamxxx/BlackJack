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
hall = Game('大厅', '2021-11-03', '1.0.0.0', '/hall', '', '')

# 游戏配置
games = [
    # 配置参数: 描述 日期 版本号 游戏目录 资源目录(为空代表内含资源) 压缩文件名
    # Game('blackjack', '2021-11-03', '1.0.0.0', '/blackjack', '/blackjack_blackjack', 'blackjack.zip'),
    Game('快乐吧', '2021-11-03', '1.0.0.0', '/dlmajiang', '/gamedl_majiang', 'dlmajiang.zip'),
    Game('大话西游', '2021-11-03', '1.0.0.0', '/dhxy', '/gameyj_big_talk_westward_journey', 'dhxy.zip'),
    Game('飞禽走兽', '2021-11-03', '1.0.0.0', '/fqzs', '/gameyj_birds_and_animals', 'fqzs.zip'),
    Game('百人牛牛', '2021-11-03', '1.0.0.0', '/brnn', '/gameyj_brnn', 'brnn.zip'),
    Game('斗地主', '2021-11-03', '1.0.0.0', '/ddz', '/gameyj_ddz', 'ddz.zip'),
    Game('捕鱼', '2021-11-03', '1.0.0.0', '/fish', '/gameyj_fish', 'fish.zip'),
    Game('捕鱼达人', '2021-11-03', '1.0.0.0', '/fishdoyen', '/gameyj_fish_doyen', 'fishdoyen.zip'),
    Game('亲友圈', '2021-11-03', '1.0.0.0', '/friend', '/gameyj_friend', 'friend.zip'),
    Game('赛马', '2021-11-03', '1.0.0.0', '/horse', '/gameyj_horse_racing', 'horse.zip'),
    Game('loading', '2021-11-03', '1.0.0.0', '/loading', '/gameyj_loading', 'loading.zip'),
    Game('转盘', '2021-11-03', '1.0.0.0', '/lucky', '/gameyj_lucky_turntable', 'lucky.zip'),
    Game('slot', '2021-11-03', '1.0.0.0', '/slot', '/gameyj_mammon_slot', 'slot.zip'),
    Game('斗三张', '2021-11-03', '1.0.0.0', '/dsz', '/gameyj_new_dsz', 'dsz.zip'),
    Game('牛牛', '2021-11-03', '1.0.0.0', '/nn', '/gameyj_nn', 'nn.zip'),
    Game('PK', '2021-11-03', '1.0.0.0', '/pk', '/gameyj_one_on_one', 'pk.zip'),
    Game('跑得快', '2021-11-03', '1.0.0.0', '/pdk', '/gameyj_pdk', 'pdk.zip'),
    # Game('德州', '2021-11-03', '1.0.0.0', '/texas', '/gameyj_texas', 'texas.zip'),
    Game('水浒', '2021-11-03', '1.0.0.0', '/shuihu', '/gameyj_water_margin_slot', 'shuihu.zip'),
    Game('祥云斗地主', '2021-11-03', '1.0.0.0', '/xyddz', '/gameyj_xyddz', 'xyddz.zip'),
    Game('俱乐部百人牛牛', '2021-11-03', '1.0.0.0', '/jlbbrnn', '/jlb_brnn', 'jlbbrnn.zip'),
    Game('俱乐部牛牛', '2021-11-03', '1.0.0.0', '/jlbnn', '/jlb_nn', 'jlbnn.zip'),
    # Game('苹果', '2021-11-03', '1.0.0.0', '/pkg', '', ''),
    # Game('安卓', '2021-11-03', '1.0.0.0', '/pkgandroid', '', ''),
    # ----------大厅需要放在最后 请在此上增加配置 ------------
    hall
]
