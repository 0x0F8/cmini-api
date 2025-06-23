#!/bin/python
from util import layout, memory, parser
from util import analyzer, authors, corpora, links
from util.consts import *
from util.returns import *
import asyncio

from core.keyboard import Layout, Position
from os import walk
import json, math, hashlib

RESTRICTED = False

def get_filenames(path):
    f = []
    for (dirpath, dirnames, filenames) in walk(path):
        f.extend(filenames)
        break
    return f

def get_hash(s):
    return hashlib.md5(s.encode("utf-8")).hexdigest()

def get_dirnames(path):
    f = []
    for (dirpath, dirnames, filenames) in walk(path):
        f.extend(dirnames)
        break
    return f

ngrams_cache = {}
def get_ngrams( name: str, typ:str):
    path = f'corpora/{name}/{typ}.json'
    if path in ngrams_cache:
        return ngrams_cache[path]
    handle = open(path, 'r')
    grams = json.load(handle)
    handle.close()
    ngrams_cache[path] = grams
    return grams

def format_number(n):
    return math.trunc(n * 100000) / 100000

def board_to_num(b):
    match b:
        case "ortho":
            return 2
        case "mini":
            return 1
        case _:
            return 0

def finger_to_num(f):
    match f:
        case "LT":
            return 0
        case "TB":
            return 0
        case "LI":
            return 1
        case "LM":
            return 2
        case "LR":
            return 3
        case "LP":
            return 4
        case "RT":
            return 5
        case "RI":
            return 6
        case "RM":
            return 7
        case "RR":
            return 8
        case "RP":
            return 9
        case _:
            print(f)
            return None

def keys_to_string(keys):
    output = ''
    for key, data in keys.items():
        ch = (hex(ord(key))[2:]).zfill(2)
        c = hex(data.col)[2:].zfill(2)
        r = hex(data.row)[2:].zfill(2)
        f = finger_to_num(data.finger)
        line = f'{ch}{c}{r}{f}'
        output += line
    return output

def create_metric():
    return {
        "min": 100000,
        "max": 0
    }

def record_metric(metric, value):
    if value < metric["min"]:
        metric["min"] = value
    if value > metric["max"]:
        metric["max"] = value

def layout_to_string(ll, corpora_dirname, likes_data, metrics):
    author = authors.get_name(ll.user)

    monogram = get_ngrams(corpora_dirname, "monograms")
    bigram = get_ngrams(corpora_dirname, "bigrams")
    trigram = get_ngrams(corpora_dirname, "trigrams")

    stats = analyzer.trigrams(ll, trigram)
    sfb = analyzer.sfb_bigram(ll, bigram)
    use = analyzer.use(ll, monogram)
    po = analyzer.pinky_off(ll, monogram)
    fsb, hsb = analyzer.scissors(ll, bigram)

    stats["sfb"] = sfb
    stats["fsb"] = fsb
    stats["hsb"] = hsb
    stats["pinky-off"] = po

    if ll.name in likes_data:
        likes = len(likes_data[ll.name])
    else:
        likes = 0

    has_stats = not (stats.get("alternate", 0) == 0 or stats.get("sfb", 0) == 0 or stats.get("redirect", 0) == 0 or stats.get("roll-in") == 0)
    external_link = links.get_link(ll.name.lower())
    print(ll.name + ', ' + corpora_dirname)
    keys_string = keys_to_string(ll.keys)
    board_num = board_to_num(ll.board)
    layout_hash = get_hash(keys_string)
    board_hash = get_hash(keys_string + str(board_num))

    names_string = f'{ll.name}|{layout_hash}|{board_hash}|{board_num}|{author}|{likes}|{external_link}',
    layout_string = f'{layout_hash}|{board_hash}|{board_num}|{keys_string}',
    stats_string = (
        f'{layout_hash}|',
        f'{board_hash}|',
        f'{corpora_dirname}|',
        f'{format_number(stats.get("alternate", 0))}|',
        f'{format_number(stats.get("roll-in", 0))}|',
        f'{format_number(stats.get("roll-out", 0))}|',
        f'{format_number(stats.get("oneh-in", 0))}|',
        f'{format_number(stats.get("oneh-out", 0))}|',
        f'{format_number(stats.get("redirect", 0))}|',
        f'{format_number(stats.get("bad-redirect", 0))}|',
        f'{format_number(stats.get("sfb", 0))}|',
        f'{format_number(stats.get("dsfb-red", 0))}|',
        f'{format_number(stats.get("dsfb-alt", 0))}|',
        f'{format_number(stats.get("fsb", 0))}|',
        f'{format_number(stats.get("hsb", 0))}|',
        f'{format_number(stats.get("pinky-off", 0))}|',
        f'{format_number(use.get("RR", 0))}|',
        f'{format_number(use.get("LM", 0))}|',
        f'{format_number(use.get("RM", 0))}|',
        f'{format_number(use.get("LP", 0))}|',
        f'{format_number(use.get("RP", 0))}|',
        f'{format_number(use.get("LI", 0))}|',
        f'{format_number(use.get("RI", 0))}|',
        f'{format_number(use.get("LR", 0))}|',
        f'{format_number(use.get("LH", 0))}|',
        f'{format_number(use.get("RH", 0))}|',
        f'{format_number(use.get("LT", 0))}|',
        f'{format_number(use.get("RT", 0))}',
    )

    record_metric(metrics["alternate"], stats.get("alternate", 0))
    record_metric(metrics["roll-in"], stats.get("roll-in", 0))
    record_metric(metrics["roll-out"], stats.get("roll-out", 0))
    record_metric(metrics["oneh-in"], stats.get("oneh-in", 0))
    record_metric(metrics["oneh-out"], stats.get("oneh-out", 0))
    record_metric(metrics["redirect"], stats.get("redirect", 0))
    record_metric(metrics["bad-redirect"], stats.get("bad-redirect", 0))
    record_metric(metrics["sfb"], stats.get("sfb", 0))
    record_metric(metrics["dsfb-red"], stats.get("dsfb-red", 0))
    record_metric(metrics["dsfb-alt"], stats.get("dsfb-alt", 0))
    record_metric(metrics["fsb"], stats.get("fsb", 0))
    record_metric(metrics["hsb"], stats.get("hsb", 0))
    record_metric(metrics["pinky-off"], stats.get("pinky-off", 0))
    record_metric(metrics["RR"], use.get("RR", 0))
    record_metric(metrics["LM"], use.get("LM", 0))
    record_metric(metrics["RM"], use.get("RM", 0))
    record_metric(metrics["LP"], use.get("LP", 0))
    record_metric(metrics["RP"], use.get("RP", 0))
    record_metric(metrics["LI"], use.get("LI", 0))
    record_metric(metrics["RI"], use.get("RI", 0))
    record_metric(metrics["LR"], use.get("LR", 0))
    record_metric(metrics["LH"], use.get("LH", 0))
    record_metric(metrics["RH"], use.get("RH", 0))
    record_metric(metrics["LT"], use.get("LT", 0))
    record_metric(metrics["RT"], use.get("RT", 0))
   
    # stats_string = (
    #     f'name {ll.name}\n',
    #     f'layout_hash {layout_hash}\n',
    #     f'board_hash {board_hash}\n',
    #     f'corpora_dirname {corpora_dirname}\n',
    #     f'alternate {format_number(stats.get("alternate", 0))}\n',
    #     f'rollin {format_number(stats.get("roll-in", 0))}\n',
    #     f'rollout {format_number(stats.get("roll-out", 0))}\n',
    #     f'onehin {format_number(stats.get("oneh-in", 0))}\n',
    #     f'onehout {format_number(stats.get("oneh-out", 0))}\n',
    #     f'redirect {format_number(stats.get("redirect", 0))}\n',
    #     f'badredirect {format_number(stats.get("bad-redirect", 0))}\n',
    #     f'sfb {format_number(stats.get("sfb", 0))}\n',
    #     f'dsfb-red {format_number(stats.get("dsfb-red", 0))}\n',
    #     f'dsfb-alt {format_number(stats.get("dsfb-alt", 0))}\n',
    #     f'fsb {format_number(stats.get("fsb", 0))}\n',
    #     f'hsb {format_number(stats.get("hsb", 0))}\n',
    #     f'pinky-off {format_number(stats.get("pinky-off", 0))}\n',
    #     f'rr {format_number(use.get("RR", 0))}\n',
    #     f'lm {format_number(use.get("LM", 0))}\n',
    #     f'rm {format_number(use.get("RM", 0))}\n',
    #     f'lp {format_number(use.get("LP", 0))}\n',
    #     f'rp {format_number(use.get("RP", 0))}\n',
    #     f'li {format_number(use.get("LI", 0))}\n',
    #     f'ri {format_number(use.get("RI", 0))}\n',
    #     f'lr {format_number(use.get("LR", 0))}\n',
    #     f'lh {format_number(use.get("LH", 0))}\n',
    #     f'rh {format_number(use.get("RH", 0))}\n',
    #     f'lt {format_number(use.get("LT", 0))}\n',
    #     f'rt {format_number(use.get("RT", 0))}\n',
    # )

    return (layout_hash, board_hash, ''.join(names_string), ''.join(layout_string), ''.join(stats_string), has_stats)

layouts_db = open('../cmini-api/layouts.tmp.csv', 'w')
stats_db = open('../cmini-api/stats.tmp.csv', 'w')
names_db = open('../cmini-api/names.tmp.csv', 'w')
metrics_db = open('../cmini-api/metrics.tmp.csv', 'w')

likes_data = open('likes.json', 'r')
likes = json.load(likes_data)

metrics = {
    "alternate": create_metric(),
    "roll-in": create_metric(),
    "roll-out": create_metric(),
    "oneh-in": create_metric(),
    "oneh-out": create_metric(),
    "redirect": create_metric(),
    "bad-redirect": create_metric(),
    "sfb": create_metric(),
    "dsfb-red": create_metric(),
    "dsfb-alt": create_metric(),
    "fsb": create_metric(),
    "hsb": create_metric(),
    "pinky-off": create_metric(),
    "RR": create_metric(),
    "LM": create_metric(),
    "RM": create_metric(),
    "LP": create_metric(),
    "RP": create_metric(),
    "LI": create_metric(),
    "RI": create_metric(),
    "LR": create_metric(),
    "LH": create_metric(),
    "RH": create_metric(),
    "LT": create_metric(),
    "RT": create_metric()
}

for layout_filename in get_filenames('layouts'):
    file = f'layouts/{layout_filename}'
    with open(file, 'r') as f:
        layout_data = json.load(f)
    items = layout_data["keys"].items()
    keys = {
        k: Position(
            row=v["row"],
            col=v["col"],
            finger=v["finger"]
        ) for k, v in items
    }
    is_alpha = len(items) >= 26
    if not is_alpha:
        continue

    ll = Layout(
        name=layout_data["name"],
        user=layout_data["user"],
        board=layout_data["board"],
        keys=keys,
    )

    corporae = get_dirnames('corpora')
    processed = []
    has_stats = False
    stats = []
    layouts1 = None

    for corpora_dirname in corporae:
        if corpora_dirname != 'monkeyracer':
            continue
        layout_hash, board_hash, names_string, layout_string, stats_string, next_has_stats = layout_to_string(ll, corpora_dirname, likes, metrics)
        if next_has_stats:
            has_stats = True
        if board_hash in processed or not has_stats:
            break
        stats.append(stats_string)

    if not has_stats:
        continue

    names_db.write(f'{names_string}\n')
    if not layout_hash in processed:
        layouts_db.write(f'{layout_string}\n')
    if not board_hash in processed:
        for s in stats:
            stats_db.write(f'{s}\n')

    processed.append(board_hash)
    processed.append(layout_hash)

for key, metric in metrics.items():
    line = f'{key}|{metric["min"]}|{metric["max"]}\n'
    metrics_db.write(line)