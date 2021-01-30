# time is running out, lets generate a map with some python
import json
from jinja2 import Template
import copy
import random
import math

NUM_DOGS = 7
NUM_SPIKES = 10

map_start_x = 12
map_start_z = -12
tiles_x = 10
tiles_z = 10
map_data = []
map_template = {
    "pos": [map_start_x, 0, map_start_z],
    "size": 6,
    "name": "neutral",
    "color": "#437F2C"
}

random_templates = [
    {
        "name": "detail_forest",
        "pos": [17, 0, -5],
        "receiveShadows": False,
        "rot": [0, 0, 0]
    },
    {
        "name": "tree_forest",
        "pos": [15, 0, 2],
        "receiveShadows": False,
        "collider": {
            "type": "cylinder",
            "radius_top": 0.4,
            "radius_bottom": 0.9,
            "height": 3,
            "segments": 16,
            "pos": [0, 1.5, 0]
        }
    },
    {
        "name": "grass",
        "pos": [11, 0, 7],
        "receiveShadows": False,
        "rot": [0, 0, 0]
    },
    {
        "name": "treeA_graveyard",
        "pos": [13, 0, 3],
        "rot": [0, 0, 0],
        "receiveShadows": False,
        "collider": {
            "type": "cylinder",
            "radius_top": 0.2,
            "radius_bottom": 0.3,
            "height": 3,
            "segments": 16,
            "pos": [0, 1.5, 0]
        }
    },
]

spikes_template = {
    "name": "spikes",
    "pos": [17, 1.5, 0],
    "receiveShadows": False,
    "collider": {
        "type": "cube",
        "dim": [3.4, 1.5, 3.4],
        "pos": [0, -0.75, 0]
    }
}

puppy_template = {
    "name": "dog",
    "pos": [16, 0, 7],
    "receiveShadows": False,
    "rot": [0.0, 1.9, 0.0]
}

tile_size = 6

for x in range(tiles_x):
    for z in range(tiles_z):
        m = copy.deepcopy(map_template)
        m['pos'][0] += x * tile_size
        m['pos'][2] += z * tile_size
        map_data.append(m)

def random_pos_on_map(obj):
    obj['pos'][0] = random.randint(map_start_x, map_start_x + (tiles_x - 1) * tile_size)
    obj['pos'][2] = random.randint(map_start_z, map_start_z + (tiles_z - 1) * tile_size)

def cpy(tpl):
    tpl_inst = copy.deepcopy(tpl)
    random_pos_on_map(tpl_inst)
    return tpl_inst

def cpy_rot(tpl):
    tpl_inst = cpy(tpl)
    if 'rot' in tpl_inst:
        tpl_inst['rot'][1] = random.random() * math.pi - math.pi * 2
    return tpl_inst

random_objects = []
for i in range(110):
    random_objects.append(cpy_rot(random.choice(random_templates)))

dog_objects = []
for i in range(NUM_DOGS):
    dog_objects.append(cpy_rot(puppy_template))


spikes_objects = []
for i in range(NUM_SPIKES):
    spikes_objects.append(cpy(spikes_template))

with open('lobby.json.j2', 'r') as lobby_template:
    template_data = lobby_template.read()
    template = Template(template_data)
    data = template.render(
        map_data = json.dumps(map_data)[1:-1],
        objects = json.dumps(random_objects + spikes_objects + dog_objects)[1:-1])
    json.dump(json.loads(data), open('lobby.json', 'w'), indent=2)