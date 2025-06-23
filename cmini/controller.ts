
import CminiStore from './store'
import { CminiLayout, CminiGlobalWithCorpora, CminiGlobalsWithCorpora, CminiStatsParent, CminiGlobal, CminiStats } from './types'

export default class CminiController {
  static getCorpora() {
    return CminiStore.corpora
  }

  static getMetrics(name:string) {
    return CminiStore.metrics.get(name)
  }

  static getBoardHashes() {
    const hashes: string[] = []
    for (const corpora of Array.from(CminiStore.layout.entries())) {
      for (const item of corpora) {
        const layout = item as CminiLayout
        if (!hashes.includes(layout.boardHash) && !!layout.boardHash) {
          hashes.push(layout.boardHash)
        }
      }
    }
    return hashes
  }

  static getLayoutHashes() {
    const hashes: string[] = []
    for (const corpora of Array.from(CminiStore.layout.entries())) {
      for (const item of corpora) {
        const layout = item as CminiLayout
        if (!hashes.includes(layout.layoutHash) && !!layout.layoutHash) {
          hashes.push(layout.layoutHash)
        }
      }
    }
    return hashes
  }

  static getNames() {
    const names: string[] = []
    for (const meta of Array.from(CminiStore.meta.values())) {
      for (const item of meta) {
        if (!names.includes(item.name)) {
          names.push(item.name)
        }
      }
    }
    return names
  }

  static getAuthors() {
    const names: string[] = []
    for (const meta of Array.from(CminiStore.meta.values())) {
      for (const item of meta) {
        if (!names.includes(item.author)) {
          names.push(item.author)
        }
      }
    }
    return names
  }

  static getOneByBoardHash(boardHash: string): CminiGlobalWithCorpora | undefined {
    const hash = CminiStore.indexes.hash[boardHash]
    if (!hash) {
      return undefined
    }
    const stats = CminiStore.stats.get(boardHash)
    const meta = CminiStore.meta.get(hash)
    const layout = CminiStore.layout.get(hash)
    if (!stats || !meta || !layout) {
      return undefined
    }
    return {
      stats, meta, layout
    }
  }

  static getOneByLayoutHash(hash: string): CminiGlobalsWithCorpora | undefined {
    const meta = CminiStore.meta.get(hash)
    if (!meta) {
      return undefined
    }

    const stats = meta.reduce<Map<string, CminiStatsParent>>((prev, current) => {
      const stats = CminiStore.stats.get(current.boardHash)
      if (!stats) return prev

      prev.set(current.boardHash, stats)
      return prev
    }, new Map())

    const layout = CminiStore.layout.get(hash)
    if (!stats || !meta || !layout) {
      return undefined
    }
    return {
      stats, meta, layout
    }
  }

  static getOneByName(name: string): CminiGlobalWithCorpora | undefined {
    const boardHash = CminiStore.indexes.name[name]
    if (!boardHash) {
      return undefined
    }
    return CminiController.getOneByBoardHash(boardHash)
  }

  static getManyByCorpora(corpora: string): CminiGlobal[] {
    if (!CminiStore.corpora.includes(corpora)) {
      return []
    }
    return Array.from(CminiStore.layout.values()).map(layout => {
      const stats = CminiStore.stats.get(layout.boardHash)?.get(corpora)!
      const meta = CminiStore.meta.get(layout.layoutHash)!
      return {
        layout, stats, meta
      }
    })
  }

  static bySfb(list: { stats: CminiStats }[]) {
    return list.sort((a, b) => a.stats.sfb - b.stats.sfb)
  }

  static doesUseThumbs(item: CminiStats) {
    return item.fingers?.leftThumb > 0 || item.fingers?.rightThumb > 0
  }

  static doesntUseThumbs(item: CminiStats) {
    return item.fingers?.leftThumb === 0 && item.fingers?.rightThumb === 0
  }
}