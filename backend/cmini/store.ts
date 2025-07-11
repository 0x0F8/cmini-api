import {
  CminiLayout,
  CminiStats,
  CminiStatsByCorpora,
  CminiMetric,
  CminiMeta,
  CminiHeatmap,
  CminiBoardLayout,
  CminiBoardType,
} from "./types";
import {
  calculateBoardHash,
  calculateLayoutHash,
  decodeKeys,
} from "@util/layout";
import { CsvLoader } from "../FileLoader";
import { isAppBuilding, isProduction } from "@util/nextjs";
import { unique } from "@util/array";

class CminiStoreClass {
  stats: Map<string, CminiStatsByCorpora> = new Map();
  layouts: Map<string, CminiLayout> = new Map();
  boardLayouts: Map<string, CminiBoardLayout> = new Map();
  meta: Map<string, CminiMeta> = new Map();
  heatmaps: Map<string, CminiHeatmap> = new Map();
  metrics: Map<string, CminiMetric> = new Map();
  keymap: Map<string, string[]> = new Map();
  corpora: string[] = [];

  indexes: { [key: string]: { [key: string]: string } } = {
    boardNameToId: {},
    authorNameToId: {},
    layoutHashToId: {},
    boardHashToId: {},
  };

  indexToMany: { [key: string]: { [key: string]: string[] } } = {
    authorIdToLayoutIds: {},
    authorIdToBoardIds: {},
  };

  async load() {
    await this.loadLayout();
    await this.loadMeta();
    await this.loadStats();
    await this.loadMetrics();
    await this.loadHeatmap();

    // if (!isAppBuilding()) {
    //   const descriptor = isProduction() ? "" : " minimized";
    //   console.log(`Caching${descriptor} keymap...`);
    //   await this.loadKeymap(isProduction());
    //   console.log("Done.");
    // }
    await this.loadKeymap();
  }

  protected async loadKeymap(shouldLoadAll = true) {
    const data = await new CsvLoader("keymap.csv").load();
    if (!data) return;
    for await (const line of data) {
      const [key, ids] = line.split("¶");

      if (!this.keymap.has(key)) {
        this.keymap.set(key, []);
      }
      const ref = this.keymap.get(key);
      for (const id of ids.split(",")) {
        if (ref!.includes(id)) continue;
        ref!.push(id);
      }

      if (!shouldLoadAll) {
        break;
      }
    }
  }

  protected async loadHeatmap() {
    const data = await new CsvLoader("heatmap.csv").load();
    if (!data) return;
    for await (const line of data) {
      const [name, ...pairs] = line.split("|");

      const parent = new Map<string, number>();
      this.heatmaps.set(name, parent);

      for (const pair of pairs) {
        const [charCode, frequency] = pair.split(",");
        if (typeof charCode === "undefined" || charCode === "") {
          continue;
        }
        parent.set(charCode, Number(frequency));
      }
    }
  }

  protected async loadMetrics() {
    const data = await new CsvLoader("metrics.csv").load();
    if (!data) return;
    for await (const line of data) {
      const [name, min, max] = line.split("|");

      const metric: CminiMetric = {
        min: Number(min),
        max: Number(max),
        name,
      };
      this.metrics.set(name, metric);
    }
  }

  protected async loadMeta() {
    const data = await new CsvLoader("meta.csv").load();
    if (!data) return;
    for await (const line of data) {
      const [
        layoutId,
        boardId,
        metaId,
        createdAt,
        modifiedAt,
        name,
        author,
        authorId,
        likes,
        link,
      ] = line.split("|");
      if (!layoutId) {
        continue;
      }

      const ref2 = this.layouts.get(layoutId);
      if (!ref2?.metaIds.includes(metaId)) {
        ref2?.metaIds.push(metaId);
      }

      const ref3 = this.boardLayouts.get(boardId);
      if (!ref3?.metaIds.includes(metaId)) {
        ref3?.metaIds.push(metaId);
      }

      const layoutHash = calculateLayoutHash(ref2!);
      const boardHash = calculateBoardHash(ref2!, ref3!);

      const meta: CminiMeta = {
        name,
        layoutId,
        boardId,
        metaId,
        layoutHash,
        boardHash,
        authorId,
        createdAt,
        modifiedAt,
        author,
        likes: Number(likes),
        link,
      };

      this.meta.set(metaId, meta);

      this.indexes.boardNameToId[name] = boardId;
      this.indexes.authorNameToId[authorId] = author;
      this.indexes.authorNameToId[author] = authorId;

      if (!(authorId in this.indexToMany.authorIdToLayoutIds)) {
        this.indexToMany.authorIdToLayoutIds[authorId] = [];
      }
      const ref1 = this.indexToMany.authorIdToLayoutIds[authorId];
      if (!ref1!.includes(layoutId)) {
        ref1!.push(layoutId);
      }

      if (!(authorId in this.indexToMany.authorIdToBoardIds)) {
        this.indexToMany.authorIdToBoardIds[authorId] = [];
      }
      const ref4 = this.indexToMany.authorIdToBoardIds[authorId];
      if (!ref4!.includes(boardId)) {
        ref4!.push(boardId);
      }

      this.indexes.layoutHashToId[layoutHash] = ref2!.layoutId;
      this.indexes.boardHashToId[boardHash] = ref3!.boardId;
      this.indexes.layoutHashToId[ref2!.layoutId] = layoutHash;
      this.indexes.boardHashToId[ref3!.boardId] = boardHash;
    }
  }

  protected async loadLayout() {
    const data = await new CsvLoader("layouts.csv").load();
    if (!data) return;
    for await (const line of data) {
      const [layoutId, boardId, board, keysStr] = line.split("|");
      if (!layoutId) {
        continue;
      }

      if (!this.layouts.has(layoutId)) {
        const keys = decodeKeys(keysStr);
        const fingers = unique(
          keys.map((k) => {
            return k.finger;
          }),
        );
        const layout: CminiLayout = {
          layoutId,
          keys,
          fingers,
          boardIds: [],
          metaIds: [],
          encodedKeys: keysStr,
        };
        this.layouts.set(layoutId, layout);
      }
      const ref1 = this.layouts.get(layoutId);
      ref1!.boardIds.push(boardId);

      if (!this.boardLayouts.has(boardId)) {
        const layout: CminiBoardLayout = {
          layoutId,
          boardId,
          board: Number(board) as CminiBoardType,
          metaIds: [],
        };
        this.boardLayouts.set(boardId, layout);
      }
    }
  }

  protected async loadStats() {
    const data = await new CsvLoader("stats.csv").load();
    if (!data) return;
    for await (const line of data) {
      const [
        layoutId,
        boardId,
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
      if (!layoutId) {
        continue;
      }

      const stats: CminiStats = {
        corpora,
        layoutId,
        boardId,
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
      if (!this.stats.has(boardId)) {
        this.stats.set(boardId, new Map<string, CminiStats>());
      }
      const ref = this.stats.get(boardId);
      ref!.set(corpora, stats);

      if (!this.corpora.includes(corpora)) {
        this.corpora.push(corpora);
      }
    }
  }
}

const CminiStore = new CminiStoreClass();
await CminiStore.load();
export default CminiStore;
