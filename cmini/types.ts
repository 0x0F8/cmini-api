export enum CminiBoard {
    Staggered, Mini, Ortho
}

export enum CminiFinger {
    LT, LI, LM, LR, LP, RT, RI, RM, RR, RP
}

export type CminiKey = {
    column: number
    row: number
    key: number
    finger: CminiFinger
}

export type CminiLayout = {
    layoutHash: string;
    boardHash: string;
    board: CminiBoard
    keys: CminiKey[]
}

export type CminiStats = {
    corpora: string;
    layoutHash: string;
    boardHash: string
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
        rightThumb: number
    };
};

export type CminiMetric = {
    min: number;
    max: number;
}

export type CminiMeta = {
    name: string;
    layoutHash: string;
    boardHash: string;
    board: CminiBoard;
    author: string;
    likes: number
    link: string;
}
export type CminiStatsParent = Map<string, CminiStats>

export type CminiGlobal = { layout: CminiLayout; stats: CminiStats; meta: CminiMeta[] }
export type CminiGlobalWithCorpora = { layout: CminiLayout; stats: CminiStatsParent; meta: CminiMeta[] }
export type CminiGlobalsWithCorpora = { layout: CminiLayout; stats: Map<string, CminiStatsParent>; meta: CminiMeta[] }

export enum CminiMetricName {
    Alternate = 'alternate',
    RollIn = 'roll-in',
    RollOut = 'roll-out',
    OnehIn = 'oneh-in',
    OnehOut = 'oneh-out',
    Redirect = 'redirect',
    BadRedirect = 'bad-redirect',
    Sfb = 'sfb',
    DsfbRed = 'dsfb-red',
    DsfbAlt = 'dsfb-alt',
    Fsb = 'fsb',
    Hsb = 'hsb',
    PinkyOff = 'pinky-off',
    RightRing = 'RR',
    LM = 'LM',
    LP = 'LP',
    RP = 'RP',
    LI = 'LI',
    RI = 'RI',
    LR = 'LR',
    LH = 'LH',
    RH = 'RH',
    LT = 'LT',
    RT = 'RT'
}