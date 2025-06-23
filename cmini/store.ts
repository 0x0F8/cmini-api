import fs from "fs/promises";
import { CminiLayout, CminiMeta, CminiKey, CminiStats, CminiStatsParent, CminiMetric } from "./types";

class CminiStore {
  stats: Map<string, CminiStatsParent> = new Map()
  layout: Map<string, CminiLayout> = new Map()
  meta: Map<string, CminiMeta[]> = new Map()
  metrics: Map<string, CminiMetric> = new Map()
  corpora: string[] = []

  indexes: { [key: string]: { [key: string]: string } } = {
    name: {},
    hash: {}
  }

  hashToBoardHashes: Map<string, string[]> = new Map()

  async load() {
    await this.loadMeta()
    await this.loadLayout()
    await this.loadStats()
    await this.loadMetrics()
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

      const metric:CminiMetric = {
        min:Number(min),max:Number(max)
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
        board,
        author,
        likes,
        link,
      ] = line.split("|");
      if (!layoutHash) {
        continue
      }

      const layout: CminiMeta = {
        name,
        layoutHash: layoutHash,
        boardHash,
        board: Number(board),
        author,
        likes: Number(likes),
        link,
      };

      if (!this.meta.has(boardHash)) {
        this.meta.set(boardHash, [])
      }
      let ref = this.meta.get(boardHash)
      ref!.push(layout)

      if (!this.meta.has(layoutHash)) {
        this.meta.set(layoutHash, [])
      }
      ref = this.meta.get(layoutHash)
      ref!.push(layout)

      this.indexes.name[name] = boardHash
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

      const layout: CminiLayout = {
        layoutHash: layoutHash,
        boardHash,
        board: Number(board),
        keys
      };
      this.layout.set(layoutHash, layout)
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

      if (!this.hashToBoardHashes.has(layoutHash)) {
        this.hashToBoardHashes.set(layoutHash, [])
      }
      const ref1 = this.hashToBoardHashes.get(layoutHash)
      if (!ref1!.includes(boardHash)) {
        ref1!.push(boardHash)
      }

      this.indexes.hash[boardHash] = layoutHash

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
