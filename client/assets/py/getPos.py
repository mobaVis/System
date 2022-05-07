#!/usr/bin/python
from cProfile import label
import json
import numpy as np
import matplotlib.pyplot as plt
# import datetime
# import os
import ast
import copy
import base64

# input: open json file flow -> python class
openFilePath = "../json/parse6219491628248857926.json"

# output
# testOutputName = open("./testOut", "a+")
destName = open("../json/pos6219491628248857926.json", "w+")

# data in python
plrActionFeatures = {'hero_die', 'maya_kill', 'gain_exp',
                     'tower_destory', 'gain_cash', 'hero_kill', 'boss_kill'}
campActionFeatures = {'hero_die', 'tower_destory', 'dengta'}
defaultPos = [float(999), float(999)]


class UsrObj:
    def __init__(self):
        self.value = {
            # "hero_ID": 0,
            # "skill_ID": 0,
            "cashGain": 0,
            "expGain": 0,
            "maya_kill": 0,
            "boss_kill": 0,
            "isAlive": 1,
            "tower_destroy": 0,
            "dies": 0,
            "kills": 0,
            "pos": defaultPos,  # only float
        }


class Item:
    def __init__(self, time):
        assert int(time) >= 0, "Error: time < 0!"
        # init with only unix timestamp
        self.value = {
            "time": int(time),
            # 0~4: camp1, 5~9: camp2
            "usr_0": UsrObj().value,
            "usr_1": UsrObj().value,
            "usr_2": UsrObj().value,
            "usr_3": UsrObj().value,
            "usr_4": UsrObj().value,
            "usr_5": UsrObj().value,
            "usr_6": UsrObj().value,
            "usr_7": UsrObj().value,
            "usr_8": UsrObj().value,
            "usr_9": UsrObj().value,
            "camp_1": {"tower_destroy": 0, "light_house": 0, "all_light_house": 0, "all_tower_destroy": 0},
            "camp_2": {"tower_destroy": 0, "light_house": 0, "all_light_house": 0, "all_tower_destroy": 0},
        }


posList = []
if __name__ == "__main__":
    with open(openFilePath, "r", encoding="utf8") as fp:
        itemList = json.load(fp)

        for itemVal in itemList:
            time = itemVal['time']
            item = Item(time)
            # print("time:", itemVal["time"],itemVal['usr_0']['pos'],file=testOutputName)

            # add usr_x
            for usr_i in range(10):
                usr_dict = itemVal["usr_" + str(usr_i)]
                item.value["usr_" + str(usr_i)] = usr_dict
            # add camp_x
            item.value['camp_1']=itemVal['camp_1']
            item.value['camp_2']=itemVal['camp_2']

            # print(usr_i, itemVal["usr_0"]["pos"], file=testOutputName)
            posList.append(item.value)


print(json.dumps(posList), file=destName)
# # print("type of output in python:", type(itemValList))
# printAllTimes()
