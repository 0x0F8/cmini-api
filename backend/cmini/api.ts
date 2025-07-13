import Fuse from "fuse.js";
import CminiController from "./controller";
import { SortOrder } from "../../types";
import { CminiFinger, CminiHand, CminiMeta, CminiStats } from "./types";
import { isBefore, isAfter, isDate, fromUnixTime } from "date-fns";
import {
  AutocompleteApiArgs,
  SearchApiArgs,
  SearchSortField,
} from "@frontend/feature/search/types";
import { prng, randomValues } from "@/util/random";

export default class CminiApi {
  public static search(args: SearchApiArgs) {
    const {
      corpora = "monkeyracer",
      query,
      randomize,
      board,
      sort = SortOrder.Ascending,
      sortBy,
      minSfb,
      maxSfb,
      minSfs,
      maxSfs,
      minFsb,
      maxFsb,
      minRedirect,
      maxRedirect,
      minPinkyOff,
      maxPinkyOff,
      minAlternate,
      maxAlternate,
      minRoll,
      maxRoll,
      minRollRatio,
      maxRollRatio,
      minLeftHand,
      maxLeftHand,
      minRightHand,
      maxRightHand,
      author,
      name,
      authorId,
      keyQuery,
      createdBefore,
      hasThumb,
      modifiedBefore,
      createdAfter,
      modifiedAfter,
    } = args;
    let rows = CminiController.getBoardLayoutsByCorporaFull(corpora);

    const hasKeyQuery = typeof keyQuery !== "undefined" && keyQuery.length > 0;
    if (hasKeyQuery) {
      const layoutIds = this.keySearch(keyQuery);
      rows = rows.filter((row) => layoutIds.includes(row.layoutId));
    }
    if (rows.length === 0) return [];

    const hasSfb =
      typeof minSfb !== "undefined" || typeof maxSfb !== "undefined";
    const hasSfs =
      typeof minSfs !== "undefined" || typeof maxSfs !== "undefined";
    const hasFsb =
      typeof minFsb !== "undefined" || typeof maxFsb !== "undefined";
    const hasRedirect =
      typeof minRedirect !== "undefined" || typeof maxRedirect !== "undefined";
    const hasPinkyOff =
      typeof minPinkyOff !== "undefined" || typeof maxPinkyOff !== "undefined";
    const hasAlternation =
      typeof minAlternate !== "undefined" ||
      typeof maxAlternate !== "undefined";
    const hasRoll =
      typeof minRoll !== "undefined" || typeof maxRoll !== "undefined";
    const hasRollRatio =
      typeof minRollRatio !== "undefined" ||
      typeof maxRollRatio !== "undefined";
    const hasLeftHand =
      typeof minLeftHand !== "undefined" || typeof maxLeftHand !== "undefined";
    const hasRightHand =
      typeof minRightHand !== "undefined" ||
      typeof maxRightHand !== "undefined";
    const hasBoard = typeof board !== "undefined";
    const hasAuthorId = typeof authorId !== "undefined";
    const hasThumb1 = typeof hasThumb === "undefined";
    const hasDate =
      typeof createdBefore !== "undefined" ||
      typeof modifiedBefore !== "undefined" ||
      typeof createdAfter !== "undefined" ||
      typeof modifiedAfter !== "undefined";
    const hasFilter =
      hasBoard ||
      hasSfb ||
      hasSfs ||
      hasAuthorId ||
      hasDate ||
      hasThumb1 ||
      hasFsb ||
      hasRedirect ||
      hasPinkyOff ||
      hasAlternation ||
      hasRoll ||
      hasRollRatio ||
      hasLeftHand ||
      hasRightHand;

    if (hasFilter) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let shouldFilter = false;

        if (hasAuthorId && !shouldFilter) {
          const authorIdExists = row.meta.some(
            (meta) => meta.authorId === authorId,
          );
          if (authorIdExists) {
            shouldFilter = true;
          }
        }
        if (hasThumb1 && !shouldFilter) {
          const rowHasThumb =
            row.layout.fingers.filter(
              (f) => f === CminiFinger.RT || f === CminiFinger.LT,
            ).length > 0;
          if (hasThumb && !rowHasThumb) {
            shouldFilter = true;
          } else if (!hasThumb && rowHasThumb) {
            shouldFilter = true;
          }
        }
        if (hasBoard && row.board !== board && !shouldFilter) {
          shouldFilter = true;
        }
        for (let [has, stat, min, max] of [
          [hasSfb, row.stats.sfb, minSfb, maxSfb],
          [hasSfs, row.stats.sfs, minSfs, maxSfs],
          [hasFsb, row.stats.fsb, minFsb, maxFsb],
          [
            hasRedirect,
            row.stats.redirect + row.stats.badRedirect,
            minRedirect,
            maxRedirect,
          ],
          [hasPinkyOff, row.stats.pinkyOff, minPinkyOff, maxPinkyOff],
          [hasAlternation, row.stats.alternate, minAlternate, maxAlternate],
          [hasRoll, row.stats.rollIn + row.stats.rollOut, minRoll, maxRoll],
          [
            hasRollRatio,
            row.stats.rollIn / row.stats.rollOut,
            minRollRatio,
            maxRollRatio,
          ],
          [hasLeftHand, row.stats.leftHand, minLeftHand, maxLeftHand],
          [hasRightHand, row.stats.rightHand, minRightHand, maxRightHand],
        ]) {
          if (shouldFilter) break;
          if (!has) continue;

          const isWithinMin = typeof min !== "undefined" ? stat! >= min : true;
          const isWithinMax = typeof max !== "undefined" ? stat! <= max : true;
          if (!isWithinMin || !isWithinMax) {
            shouldFilter = true;
            break;
          }
        }
        if (hasDate && !shouldFilter) {
          for (const [value, dateCheck, rowDate] of [
            [createdBefore, isBefore, row.meta[0].createdAt],
            [modifiedBefore, isBefore, row.meta[0].modifiedAt],
            [createdAfter, isAfter, row.meta[0].createdAt],
            [modifiedAfter, isAfter, row.meta[0].modifiedAt],
          ]) {
            if (typeof value === "undefined") continue;
            const target = fromUnixTime(Number(rowDate));
            const comparer = fromUnixTime(Number(value));
            const isComparerValid = isDate(comparer!);
            const isFiltered =
              isComparerValid && (dateCheck as Function)(target, comparer!);
            if (isFiltered) {
              shouldFilter = true;
              break;
            }
          }
        }

        if (shouldFilter) {
          rows.splice(i, 1);
          i--;
        }
      }
    }
    if (rows.length === 0) return [];

    const hasQuery =
      typeof query !== "undefined" ||
      typeof name !== "undefined" ||
      typeof author !== "undefined";
    if (hasQuery) {
      if (typeof name !== "undefined") {
        const fuse = new Fuse(rows, {
          minMatchCharLength: 2,
          keys: ["meta.name"],
        });
        rows = fuse.search(name as string).map((o) => o.item);
      }
      if (typeof author !== "undefined") {
        const fuse = new Fuse(rows, {
          minMatchCharLength: 2,
          keys: ["meta.author"],
        });
        rows = fuse.search(author as string).map((o) => o.item);
      }
      if (typeof query !== "undefined") {
        const fuse = new Fuse(rows, {
          minMatchCharLength: 2,
          keys: ["meta.author", "meta.name"],
        });
        rows = fuse.search(query as string).map((o) => o.item);
      }
    }
    if (rows.length === 0) return [];

    const hasSort =
      (typeof sort !== "undefined" && typeof sortBy !== "undefined") ||
      typeof randomize !== "undefined";
    if (hasSort) {
      if (randomize) {
        rows = randomValues(rows, rows.length, prng(randomize));
      } else {
        rows = this.sortLayouts(sort, sortBy, rows);
      }
    }

    return rows;
  }

  public static autoComplete(args: AutocompleteApiArgs) {
    const {
      corpora = "monkeyracer",
      query,
      sort = SortOrder.Ascending,
      sortBy,
    } = args;
    let rows = CminiController.getBoardLayoutsByCorporaMinimal(corpora);

    const fuse = new Fuse(rows, {
      minMatchCharLength: 2,
      keys: ["meta.author", "meta.name"],
    });
    rows = fuse.search(query as string).map((o) => o.item);
    if (rows.length === 0) return [];

    const hasSort =
      typeof sort !== "undefined" && typeof sortBy !== "undefined";
    if (hasSort) {
      rows = this.sortLayouts(sort, sortBy, rows);
    }

    return rows;
  }

  // reserved keys: | + :
  public static parseKeyQuery(query: string) {
    const commands: string[][] = [];

    const queryTokens = query.split(/[\s+]/g);
    if (queryTokens.length > 3) {
      return [];
    }

    for (const queryToken of queryTokens) {
      if (queryToken === "") continue;
      for (let token of queryToken.split(",")) {
        let hand: CminiHand | undefined = undefined;
        if (token.startsWith("|")) {
          hand = CminiHand.Left;
        } else if (token.endsWith("|")) {
          hand = CminiHand.Right;
        }

        for (let handToken of token.split("|")) {
          if (handToken !== "") {
            if (handToken === "" || handToken === "|") {
              continue;
            }

            if (!handToken.includes(":")) {
              handToken = ":" + handToken;
            }
            const [modifier, letters] = handToken.split(":");
            if (
              letters.length < 1 ||
              letters.length > 4 ||
              (letters.length < 2 && !hand)
            ) {
              continue;
            }

            let key = "";
            switch (modifier) {
              case "h":
                key += "h–";
                break;
              case "v":
                key += "v–";
                break;
              case "":
                // nop
                break;
              default:
                continue;
            }
            key += letters;

            if (typeof hand === "undefined") {
              // query contains a generic search on both hands
              commands.push(["|" + key, key + "|"]);
            } else {
              const start = hand !== CminiHand.Right ? "|" : "";
              const end = hand !== CminiHand.Left ? "|" : "";
              commands.push([start + key + end]);
            }
          }
        }
      }
    }
    return commands;
  }

  public static keySearch(query: string) {
    let ids: string[] = [];
    const commands = this.parseKeyQuery(query);

    for (let i = 0; i < commands.length; i++) {
      const commandList = commands[i];

      let keys: string[] = [];
      let hasKeys = false;
      for (const command of commandList) {
        const appendKeys = CminiController.getKeymap(command);
        if (appendKeys) {
          keys = keys.concat(appendKeys);
          hasKeys = true;
        }
      }

      if (!hasKeys) {
        ids = [];
        break;
      }

      if (i === 0) {
        ids = keys;
      } else {
        ids = ids.filter((id) => keys.includes(id));
      }

      if (ids.length === 0) {
        break;
      }
    }
    return ids;
  }

  public static sortLayouts<
    T extends {
      stats?: CminiStats;
      meta: CminiMeta[];
    },
  >(sort: SortOrder, sortBy: SearchSortField | undefined, rows: T[]): T[] {
    return rows.sort((a, b) => {
      const first = sort === SortOrder.Ascending ? a : b;
      const second = sort === SortOrder.Ascending ? b : a;
      let c1: number | string = 0;
      let c2: number | string = 0;
      switch (sortBy) {
        case SearchSortField.Sfb:
          c1 = first.stats?.sfb || 0;
          c2 = second.stats?.sfb || 0;
          break;
        case SearchSortField.Sfs:
          c1 = (first.stats && first.stats.sfs + first.stats.sfsAlt) || 0;
          c2 = (second.stats && second.stats.sfs + second.stats.sfsAlt) || 0;
          break;
        case SearchSortField.Name:
          c1 = first.meta[0].name;
          c2 = second.meta[0].name;
          break;
        case SearchSortField.Author:
          c1 = first.meta[0].author;
          c2 = second.meta[0].author;
          break;
        case SearchSortField.Fsb:
          c1 = first.stats?.fsb || 0;
          c2 = second.stats?.fsb || 0;
          break;
        case SearchSortField.Redirect:
          c1 =
            (first.stats && first.stats.redirect + first.stats.badRedirect) ||
            0;
          c2 =
            (second.stats &&
              second.stats.redirect + second.stats.badRedirect) ||
            0;
          break;
        case SearchSortField.PinkyOff:
          c1 = first.stats?.pinkyOff || 0;
          c2 = second.stats?.pinkyOff || 0;
          break;
        case SearchSortField.Alternate:
          c1 = first.stats?.alternate || 0;
          c2 = second.stats?.alternate || 0;
          break;
        case SearchSortField.Roll:
          c1 = (first.stats && first.stats.rollIn + first.stats.rollOut) || 0;
          c2 =
            (second.stats && second.stats.rollIn + second.stats.rollOut) || 0;
          break;
        case SearchSortField.RollRatio:
          c1 = (first.stats && first.stats.rollIn / first.stats.rollOut) || 0;
          c2 =
            (second.stats && second.stats.rollIn / second.stats.rollOut) || 0;
          break;
        case SearchSortField.LeftHand:
          c1 = first.stats?.leftHand || 0;
          c2 = second.stats?.leftHand || 0;
          break;
        case SearchSortField.RightHand:
          c1 = first.stats?.rightHand || 0;
          c2 = second.stats?.rightHand || 0;
          break;
        default:
        // nop
      }

      if (c1 < c2) {
        return -1;
      } else if (c1 > c2) {
        return 1;
      }
      return 0;
    });
  }
}
