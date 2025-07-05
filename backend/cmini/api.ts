import Fuse from "fuse.js";
import CminiController from "./controller";
import { SortOrder } from "../../types";
import { CminiHand } from "./types";
import { isBefore, isAfter, isDate, fromUnixTime } from "date-fns";
import { SearchApiArgs } from "@frontend/feature/search/types";

export default class CminiApi {
  public static search(args: SearchApiArgs) {
    const {
      corpora = "monkeyracer",
      query,
      board,
      sort = SortOrder.Ascending,
      sortBy = "sfb",
      minSfb,
      maxSfb,
      author,
      name,
      authorId,
      keyQuery,
      createdBefore,
      modifiedBefore,
      createdAfter,
      modifiedAfter,
    } = args;
    let rows = CminiController.getBoardLayoutsByCorpora(corpora);

    const hasKeyQuery = typeof keyQuery !== "undefined" && keyQuery.length > 0;
    if (hasKeyQuery) {
      const layoutIds = this.keySearch(keyQuery);
      rows = rows.filter((row) => layoutIds.includes(row.layoutId));
    }
    if (rows.length === 0) return [];

    const hasSfb =
      typeof minSfb !== "undefined" || typeof maxSfb !== "undefined";
    const hasBoard = typeof board !== "undefined";
    const hasAuthorId = typeof board !== "undefined";
    const hasDate =
      typeof createdBefore !== "undefined" ||
      typeof modifiedBefore !== "undefined" ||
      typeof createdAfter !== "undefined" ||
      typeof modifiedAfter !== "undefined";
    const hasFilter = hasBoard || hasSfb || hasAuthorId || hasDate;

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
        if (hasBoard && row.board !== board && !shouldFilter) {
          shouldFilter = true;
        }
        if (hasSfb && !shouldFilter) {
          const isWithinMin =
            typeof minSfb !== "undefined" ? row.stats.sfb >= minSfb : true;
          const isWithinMax =
            typeof maxSfb !== "undefined" ? row.stats.sfb <= maxSfb : true;
          if (!isWithinMin || !isWithinMax) {
            shouldFilter = true;
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
      !hasQuery && typeof sort !== "undefined" && typeof sortBy !== "undefined";
    if (hasSort) {
      rows = rows.sort((a, b) => {
        const first = sort === SortOrder.Ascending ? a : b;
        const second = sort === SortOrder.Ascending ? b : a;
        switch (sortBy) {
          case "sfb":
            return first.stats.sfb - second.stats.sfb;
          default:
            return 0;
        }
      });
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
}
