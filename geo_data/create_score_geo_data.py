import csv
import re

GEO_DATA = "DOE_High_School_Directory_2017.csv"
SCORE_DATA = "New_York_City_District_Map.csv"

location_dict = {}

with open(GEO_DATA, 'rb') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    for row in reader:
        location_obj = {}
        db_id = row[0]
        groups = re.search("(\()(.*)(\,)(.*)(\))", row[18])
        try:
            location_obj["long"] = groups.group(2)
            location_obj["lat"] = groups.group(4)
            location_dict[db_id] = location_obj
        except:
            print("")


found_num = 0
not_found_num = 0

school_dict = {}

with open(SCORE_DATA, 'rb') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    for row in reader:
        db_id = row[0]
        try: 
            obj = location_dict[db_id]
            obj["reading"] = row[3]
            obj["math"] = row[4]
            obj["writing"] = row[5]
            obj["num_takers"] = row[2]
            if(row[4] != "s"):
                school_dict[db_id] = obj
            
        except KeyError:
            not_found_num += 1
            print("can't find school: " + db_id)


for school in school_dict:
    print(school + ": " + str(school_dict[school]))

print(len(school_dict))

import json
with open('school_data.json', 'w') as fp:
    json.dump(school_dict, fp)