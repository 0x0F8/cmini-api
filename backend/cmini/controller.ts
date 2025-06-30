
import { isHash } from '@util/crypto'
import CminiStore from './store'
import { CminiLayout, CminiBoardLayout } from './types'

class CminiController {
  getCorpora() {
    return CminiStore.corpora
  }

  getMetric(name: string) {
    return CminiStore.metrics.get(name)
  }

  getHeatmap(corpora: string) {
    const ref = CminiStore.heatmaps.get(corpora)
    if (!ref) return undefined;

    return Object.fromEntries(ref.entries())
  }

  getAuthorName(id: string) {
    return CminiStore.indexes.authorNameToId[id]
  }

  getBoardIds() {
    const ids: string[] = []
    for (const corpora of Array.from(CminiStore.boardLayouts.entries())) {
      for (const item of corpora) {
        const layout = item as CminiBoardLayout
        if (!ids.includes(layout.boardId) && !!layout.boardId) {
          ids.push(layout.boardId)
        }
      }
    }
    return ids
  }

  getLayoutHashes() {
    return Object.values(CminiStore.indexes.layoutHashToId).filter(isHash)
  }

  getBoardHashes() {
    return Object.values(CminiStore.indexes.boardHashToId).filter(isHash)
  }

  getLayoutIds() {
    const ids: string[] = []
    for (const corpora of Array.from(CminiStore.layouts.entries())) {
      for (const item of corpora) {
        const layout = item as CminiLayout
        if (!ids.includes(layout.layoutId) && !!layout.layoutId) {
          ids.push(layout.layoutId)
        }
      }
    }
    return ids
  }

  getLayoutNames() {
    const names: string[] = []
    for (const boardLayout of Array.from(CminiStore.boardLayouts.values())) {
      for (const metaId of boardLayout.metaIds) {
        const meta = CminiStore.meta.get(metaId)!
        if (!names.includes(meta.name)) {
          names.push(meta.name)
        }
      }
    }
    return names
  }

  getAuthorNames() {
    const names: string[] = []
    for (const meta of Array.from(CminiStore.meta.values())) {
      if (!names.includes(meta.author)) {
        names.push(meta.author)
      }
    }
    return names
  }

  getAuthorIds() {
    const names: string[] = []
    for (const meta of Array.from(CminiStore.meta.values())) {
      if (!names.includes(meta.authorId)) {
        names.push(meta.authorId)
      }
    }
    return names
  }

  getLayoutByBoardHash(boardHash: string) {
    const id = this.getBoardHash(boardHash)
    if (!id) {
      return undefined
    }
    return this.getLayoutByBoardId(id)
  }

  getLayoutByBoardId(boardId: string) {
    const boardLayout = CminiStore.boardLayouts.get(boardId)
    if (!boardLayout) {
      return undefined
    }
    return {
      layout: CminiStore.layouts.get(boardLayout.layoutId)!,
      boardLayouts: [this.getBoardLayoutDetails(boardLayout)]
    }
  }

  getLayoutByHash(layoutHash: string) {
    const id = this.getLayoutHash(layoutHash)
    if (!id) {
      return undefined
    }
    return this.getLayoutById(id)
  }

  getLayoutById(hash: string) {
    const layout = CminiStore.layouts.get(hash)
    if (!layout) {
      return undefined
    }

    const boardLayouts = layout?.boardIds.map(boardId => CminiStore.boardLayouts.get(boardId)!)
    return {
      boardLayouts, layout
    }
  }

  getBoardLayoutDetails(board: CminiBoardLayout) {
    const {metaIds,...props} = board
    return {
      ...props,
      stats: CminiStore.stats.get(board.boardId)!,
      meta: this.getMetas(metaIds)!
    }
  }

  getBoardLayoutByBoardHash(boardHash: string) {
    const id = this.getBoardHash(boardHash)
    if (!id) {
      return undefined
    }
    return this.getBoardLayoutByBoardId(id)
  }

  getBoardLayoutByBoardId(boardId:string) {
    const boardLayout = CminiStore.boardLayouts.get(boardId)
    if (!boardLayout) {
      return undefined
    }
    return this.getBoardLayoutDetails(boardLayout)
  }

  getLayoutByName(name: string) {
    const boardId = CminiStore.indexes.boardNameToId[name]
    if (!boardId) {
      return undefined
    }
    return this.getLayoutByBoardId(boardId)
  }

  getBoardLayoutByName(name: string) {
    const boardId = CminiStore.indexes.boardNameToId[name]
    if (!boardId) {
      return undefined
    }
    return this.getBoardLayoutByBoardId(boardId)
  }

  getBoardLayoutsByCorpora(corpora: string) {
    if (!CminiStore.corpora.includes(corpora)) {
      return []
    }
    return Array.from(CminiStore.boardLayouts.values()).map(boardLayout => {
      const layout = CminiStore.layouts.get(boardLayout.layoutId)!
      const {stats, ...details} = this.getBoardLayoutDetails(boardLayout)
      return {
        layout,
        ...details,
        stats: stats.get(corpora)!
      }
    })
  }

  getBoardLayoutsByAuthorName(name: string) {
    const id = CminiStore.indexes.authorNameToId[name]
    if (!id) {
      return []
    }
    return this.getBoardLayoutsByAuthorId(id)
  }

  getMetas(metaIds: string[]) {
    return metaIds.map(hash => CminiStore.meta.get(hash)).filter(hash => (!!hash))
  }

  getBoardLayoutsByAuthorId(authorId: string) {
    const boardIds = (authorId in CminiStore.indexToMany.authorIdToBoardIds) ? CminiStore.indexToMany.authorIdToBoardIds[authorId] : [];
    return boardIds.map(boardLayoutId => {
      const boardLayout = CminiStore.boardLayouts.get(boardLayoutId)!
      const layout = CminiStore.layouts.get(boardLayout.layoutId)!
      const details = this.getBoardLayoutDetails(boardLayout)
      return {
        layout,
        boardLayout: details,
        meta: details.meta.find(meta => meta.authorId === authorId)!
      }
    })
  }

  getKeymap(keySequence: string) {
    return CminiStore.keymap.get(keySequence)
  } 

  getBoardHash(boardId: string) {
    return CminiStore.indexes.boardHashToId[boardId]
  }

  getLayoutHash(layoutId: string) {
    return CminiStore.indexes.layoutHashToId[layoutId]
  }
}

const instance = new CminiController();
export default instance;