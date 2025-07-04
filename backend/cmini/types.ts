export enum CminiBoardType {
  None = -1,
  Staggered = 0,
  Mini = 1,
  Ortho = 2,
}

export enum CminiFinger {
  LT,
  LI,
  LM,
  LR,
  LP,
  RT,
  RI,
  RM,
  RR,
  RP,
}

export enum CminiHand {
  Left,
  Right,
}

export type CminiKey = {
  column: number;
  row: number;
  key: number;
  finger: CminiFinger;
};

export type CminiLayout = {
  layoutId: string;
  boardIds: string[];
  metaIds: string[];
  keys: CminiKey[];
  encodedKeys: string;
};

export type CminiBoardLayout = {
  layoutId: string;
  boardId: string;
  board: CminiBoardType;
  metaIds: string[];
};

export type CminiMeta = {
  name: string;
  layoutId: string;
  boardId: string;
  metaId: string;
  author: string;
  authorId: string;
  layoutHash: string;
  boardHash: string;
  likes: number;
  link: string;
  createdAt: string;
  modifiedAt: string;
};

export type CminiStats = {
  corpora: string;
  layoutId: string;
  boardId: string;
  alternate: number;
  rollIn: number;
  rollOut: number;
  oneIn: number;
  oneOut: number;
  redirect: number;
  badRedirect: number;
  sfb: number;
  pinkyOff: number;
  sfs: number;
  sfsAlt: number;
  fsb: number;
  hsb: number;
  leftHand: number;
  rightHand: number;
  fingers: {
    rightRing: number;
    leftRing: number;
    rightIndex: number;
    leftIndex: number;
    rightMiddle: number;
    leftMiddle: number;
    rightPinky: number;
    leftPinky: number;
    leftThumb: number;
    rightThumb: number;
  };
};

export type CminiStatsByCorpora = Map<string, CminiStats>;

export type CminiMetric = {
  min: number;
  max: number;
  name: string;
};

export type CminiHeatmap = Map<string, number>;

export enum CminiMetricName {
  Alternate = "alternate",
  RollIn = "roll-in",
  RollOut = "roll-out",
  OnehIn = "oneh-in",
  OnehOut = "oneh-out",
  Redirect = "redirect",
  BadRedirect = "bad-redirect",
  Sfb = "sfb",
  DsfbRed = "dsfb-red",
  DsfbAlt = "dsfb-alt",
  Fsb = "fsb",
  Hsb = "hsb",
  PinkyOff = "pinky-off",
  RightRing = "RR",
  LM = "LM",
  LP = "LP",
  RP = "RP",
  LI = "LI",
  RI = "RI",
  LR = "LR",
  LH = "LH",
  RH = "RH",
  LT = "LT",
  RT = "RT",
}
