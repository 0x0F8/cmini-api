import fs from "fs/promises";
import { CminiLayout,  CminiKey, CminiStats, CminiStatsByCorpora, CminiMetric, CminiMeta, CminiHeatmap, CminiBoardLayout, CminiBoardType } from "./types";

class CminiStore {
  stats: Map<string, CminiStatsByCorpora> = new Map()
  layouts: Map<string, CminiLayout> = new Map()
  boardLayouts: Map<string, CminiBoardLayout> = new Map()
  meta: Map<string, CminiMeta> = new Map()
  heatmaps: Map<string, CminiHeatmap> = new Map()
  metrics: Map<string, CminiMetric> = new Map()
  corpora: string[] = []

  indexes: { [key: string]: { [key: string]: string } } = {
    name: {},
    author: {}
  }

  authorIdToLayoutHashes: Map<string, string[]> = new Map()
  authorIdToBoardHashes: Map<string, string[]> = new Map()

  async load() {
    await this.loadLayout()
    await this.loadMeta()
    await this.loadStats()
    await this.loadMetrics()
    await this.loadHeatmap()
  }

  protected async loadHeatmap() {
    const data = await fs.readFile("heatmap.csv");
    if (!data) return;
    for (const line of data.toString().split("\n")) {
      const [
        name, ...pairs
      ] = line.split("|");

      const parent = new Map<string, number>()
      this.heatmaps.set(name, parent)

      for (const pair of pairs) {
        const [charCode, frequency] = pair.split(',')
        if (typeof charCode === 'undefined' || charCode === '') {
          continue
        }
        parent.set(charCode, Number(frequency))
      }
    }
  }

  protected async loadMetrics() {
    const data = await fs.readFile("metrics.csv");
    if (!data) return;
    for (const line of data.toString().split("\n")) {
      const [
        name,
        min,
        max
      ] = line.split("|");

      const metric: CminiMetric = {
        min: Number(min), max: Number(max), name
      }
      this.metrics.set(name, metric)
    }
  }

  protected async loadMeta() {
    const data = await fs.readFile("names.csv");
    if (!data) return;
    for (const line of data.toString().split("\n")) {
      const [
        name,
        layoutHash,
        boardHash,
        metaHash,
        author,
        authorId,
        likes,
        link,
      ] = line.split("|");
      if (!layoutHash) {
        continue
      }

      const meta: CminiMeta = {
        name,
        layoutHash,
        boardHash,
        metaHash,
        authorId,
        author,
        likes: Number(likes),
        link,
      };

      this.meta.set(metaHash, meta)

      this.indexes.name[name] = boardHash
      this.indexes.author[authorId] = author
      this.indexes.author[author] = authorId

      if (!this.authorIdToLayoutHashes.has(authorId)) {
        this.authorIdToLayoutHashes.set(authorId, [])
      }
      const ref1 = this.authorIdToLayoutHashes.get(authorId)
      if (!ref1!.includes(layoutHash)) {
        ref1!.push(layoutHash)
      }

      if (!this.authorIdToBoardHashes.has(authorId)) {
        this.authorIdToBoardHashes.set(authorId, [])
      }
      const ref4 = this.authorIdToBoardHashes.get(authorId)
      if (!ref4!.includes(boardHash)) {
        ref4!.push(boardHash)
      }

      const ref2 = this.layouts.get(layoutHash)
      if (!ref2?.metaHashes.includes(metaHash)) {
        ref2?.metaHashes.push(metaHash)
      }

      const ref3 = this.boardLayouts.get(boardHash)
      if (!ref3?.metaHashes.includes(metaHash)) {
        ref3?.metaHashes.push(metaHash)
      }
    }
  }

  protected async loadLayout() {
    const data = await fs.readFile("layouts.csv");
    if (!data) return;
    for (const line of data.toString().split("\n")) {
      const [
        layoutHash,
        boardHash,
        board,
        keysStr
      ] = line.split("|");
      if (!layoutHash) {
        continue
      }

      const keys: CminiKey[] = []
      for (let i = 0; i < keysStr.length; i += 7) {
        const line = keysStr.substring(i, i + 8)
        // 76 00 00 4
        const charCode = parseInt(line.substring(0, 2), 16)
        const column = parseInt(line.substring(2, 4), 16)
        const row = parseInt(line.substring(4, 6), 16)
        const finger = Number(line.substring(6, 7))
        const key: CminiKey = {
          column,
          row,
          key: charCode,
          finger
        }
        keys.push(key)
      }

      if (!this.layouts.has(layoutHash) ) {
        const layout: CminiLayout = {
          layoutHash,
          keys,
          boardHashes: [],
          metaHashes: []
        };
        this.layouts.set(layoutHash, layout)
      }
      const ref1 = this.layouts.get(layoutHash)
      ref1!.boardHashes.push(boardHash)

      if (!this.boardLayouts.has(boardHash) ) {
        const layout: CminiBoardLayout = {
          layoutHash,
          boardHash,
          board: Number(board) as CminiBoardType,
          metaHashes: []
        };
        this.boardLayouts.set(boardHash, layout)
      }
    }
  }

  protected async loadStats() {
    const data = await fs.readFile("stats.csv");
    if (!data) return;
    for (const line of data.toString().split("\n")) {
      const [
        layoutHash,
        boardHash,
        corpora,
        alternate,
        rollIn,
        rollOut,
        oneIn,
        oneOut,
        redirect,
        badRedirect,
        sfb,
        sfs,
        sfsAlt,
        fsb,
        hsb,
        pinkyOff,
        rightRing,
        leftMiddle,
        rightMiddle,
        leftPinky,
        rightPinky,
        leftIndex,
        rightIndex,
        leftRing,
        leftHand,
        rightHand,
        leftThumb,
        rightThumb,
      ] = line.split("|");
      if (!layoutHash) {
        continue
      }

      const stats: CminiStats = {
        corpora,
        layoutHash: layoutHash,
        boardHash,
        alternate: Number(alternate),
        rollIn: Number(rollIn),
        rollOut: Number(rollOut),
        oneIn: Number(oneIn),
        oneOut: Number(oneOut),
        redirect: Number(redirect),
        badRedirect: Number(badRedirect),
        sfb: Number(sfb),
        sfs: Number(sfs),
        sfsAlt: Number(sfsAlt),
        leftHand: Number(leftHand),
        rightHand: Number(rightHand),
        fsb: Number(fsb),
        hsb: Number(hsb),
        pinkyOff: Number(pinkyOff),
        fingers: {
          rightRing: Number(rightRing),
          leftRing: Number(leftRing),
          rightIndex: Number(rightIndex),
          leftIndex: Number(leftIndex),
          rightMiddle: Number(rightMiddle),
          leftMiddle: Number(leftMiddle),
          rightPinky: Number(rightPinky),
          leftPinky: Number(leftPinky),
          leftThumb: Number(leftThumb ?? 0),
          rightThumb: Number(rightThumb ?? 0),
        },
      };
      if (!this.stats.has(boardHash)) {
        this.stats.set(boardHash, new Map<string, CminiStats>())
      }
      const ref = this.stats.get(boardHash)
      ref!.set(corpora, stats)

      if (!(this.corpora.includes(corpora))) {
        this.corpora.push(corpora)
      }
    }
  }
}

const instance = new CminiStore();
await instance.load();
setInterval(instance.load.bind(instance), 60000)
export default instance;
