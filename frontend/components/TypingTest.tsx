"use client";

import { useEffect, useRef, useState } from "react";
import TypingInput from "./TypingInput";
import { CminiKey } from "@backend/cmini/types";
import { Box } from "@mui/material";
import style from "./TypingTest.module.sass";
import { Corpus } from "@backend/corpus/types";
import useCorpus from "@frontend/hooks/useCorpus";
import { randomString } from "@util/random";

export default function TypingTest({
  keys,
  defaultUserValue,
  defaultTestValue,
  defaultWords,
}: {
  keys: CminiKey[];
  defaultUserValue: string;
  defaultTestValue: string;
  defaultWords: string[];
}) {
  const userInputRef = useRef<HTMLInputElement>(null);
  const [userValue, setUserValue] = useState<string>(defaultUserValue);
  const [seed, setSeed] = useState<string>("default");
  const [expectedValue, setExpectedValue] = useState<string>(
    defaultTestValue + " " + defaultWords.join(" ")
  );
  const [expectedCharacter, setExpectedCharacter] = useState<string>(
    defaultWords[0][0]
  );

  const { corpus, error, isLoading } = useCorpus(
    { corpus: Corpus.MonkeyType1k, limit: 50, seed },
    true
  );

  useEffect(() => {
    if (seed === "default") {
      return;
    }
    if (corpus) {
      setSeed(
        randomString(
          4,
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        )
      );
      setUserValue(defaultUserValue);
      setExpectedValue(defaultTestValue + corpus.data.join(" "));
    }
  }, [corpus, userValue, seed]);

  useEffect(() => {
    setExpectedCharacter(expectedValue[userValue.length]);
  }, [expectedValue, userValue]);

  return (
    <Box className={style["typing-test"]}>
      <Box className={style["input-container"]}>
        <TypingInput
          className={style["user-input"]}
          ref={userInputRef}
          expectedCharacter={expectedCharacter}
          keys={keys}
          allowBackspace={false}
          value={userValue}
          setValue={setUserValue}
        />
        <Box className={style["mirror-input"]}>{expectedValue}</Box>
      </Box>
    </Box>
  );
}
