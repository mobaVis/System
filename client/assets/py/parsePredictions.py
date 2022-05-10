import json

# input: open json file flow -> python class
openFilePath = "../json/grad_out_testing_time_2.json"

# output
destName = open("../json/grad_out_testing_time_2_hash.json", 'w+')

# dict in python: hashMap[${live_time}]=${index_of_correlated_obj}
# both strings
hashMap = {}

if __name__ == "__main__":
    with open(openFilePath, "r", encoding="utf8") as fp:
        itemList = json.load(fp)

        for i in range(len(itemList)):
            time = str(itemList[i]['live_time'])
            hashMap[time]=i

print(json.dumps(hashMap), file=destName)
