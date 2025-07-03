type MonkeyTypeCorpus = {
  name: string;
  noLazyMode: boolean;
  orderedByFrequency: boolean;
  words: string[];
};

export default function translate(data: MonkeyTypeCorpus): string[] {
  return data.words;
}
