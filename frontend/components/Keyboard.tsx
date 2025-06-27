'use client'

import { useEffect, useState } from "react";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';
import FrontHandIcon from '@mui/icons-material/FrontHand';
import FrontHandOutlinedIcon from '@mui/icons-material/FrontHandOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CminiBoardType, CminiFinger, CminiKey } from "../../backend/cmini/types";
import { gradientValue } from "../../util/color";
import { ButtonGroup, IconButton, Stack, Typography } from "@mui/material";
import style from './Keyboard.module.sass'

type KeyboardConfig = {
    display: 'heatmap' | 'fingermap';
    showDisplay: boolean;
    size?: number;
    type: CminiBoardType; 
}

type KeyboardTheme = {
    heatmap: {
        hot: string;
        cold: string;
    },
    fingers: {
        leftPinky: string;
        leftRing: string;
        leftMiddle: string;
        leftIndex: string;
        leftThumb: string;
        rightPinky: string;
        rightRing: string;
        rightMiddle: string;
        rightIndex: string;
        rightThumb: string;
    },
    text: string;
    key: string;
    border: string;
}

type KeyboardKey = {
    key: string;
    finger: string;
    heatColor: string;
    fingerColor: string;
    heat: string
}

const defaultTheme: KeyboardTheme = {
    heatmap: {
        hot: '#ff8585',
        cold: '#355978'
    },
    fingers: {
        leftPinky: '#355978',
        leftRing: '#D7749D',
        leftMiddle: '#636696',
        leftIndex: '#ff8585',
        leftThumb: '#333333',
        rightPinky: '#355978',
        rightRing: '#D7749D',
        rightMiddle: '#636696',
        rightIndex: '#ff8585',
        rightThumb: '#333333',
    },
    text: '#FFFFFF',
    key: '#FFFFFF',
    border: '#000000'
}

function fingerToColor(finger: CminiFinger, theme: KeyboardTheme) {
    switch (finger) {
        case CminiFinger.LT:
            return theme.fingers.leftThumb
        case CminiFinger.LI:
            return theme.fingers.leftIndex
        case CminiFinger.LM:
            return theme.fingers.leftMiddle
        case CminiFinger.LR:
            return theme.fingers.leftRing
        case CminiFinger.LP:
            return theme.fingers.leftPinky
        case CminiFinger.RT:
            return theme.fingers.rightThumb
        case CminiFinger.RI:
            return theme.fingers.rightIndex
        case CminiFinger.RM:
            return theme.fingers.rightMiddle
        case CminiFinger.RR:
            return theme.fingers.rightRing
        case CminiFinger.RP:
            return theme.fingers.rightPinky
        default:
            return theme.fingers.leftIndex
    }
}

function fingerToString(finger: CminiFinger) {
    switch (finger) {
        case CminiFinger.LT:
            return 'LT'
        case CminiFinger.LI:
            return 'LI'
        case CminiFinger.LM:
            return 'LM'
        case CminiFinger.LR:
            return 'LR'
        case CminiFinger.LP:
            return 'LP'
        case CminiFinger.RT:
            return 'RT'
        case CminiFinger.RI:
            return 'RI'
        case CminiFinger.RM:
            return 'RM'
        case CminiFinger.RR:
            return 'RR'
        case CminiFinger.RP:
            return 'RP'
        default:
            return ''
    }
}

export default function Keyboard({ config, keys, heatmap, theme = defaultTheme }: { keys: CminiKey[], heatmap: { [key: string]: number }; theme?: KeyboardTheme; config: KeyboardConfig }) {
    const [keyboard, setKeyboard] = useState<KeyboardKey[][]>([])
    const [display, setDisplay] = useState<'fingermap' | 'heatmap'>(config.display)
    const [showDisplay, setShowDisplay] = useState<boolean>(config.showDisplay)
    
    useEffect(() => {
        const nextKeyboard: KeyboardKey[][] = []
        for (const key of keys) {
            if (key.row + 1 > nextKeyboard.length) {
                nextKeyboard.push([])
            }
            const ref = nextKeyboard[key.row]
            ref[key.column] = {
                key: String.fromCharCode(key.key),
                heatColor: gradientValue(heatmap[String(key.key)], theme.heatmap.cold, theme.heatmap.hot),
                heat: heatmap[String(key.key)].toFixed(2),
                fingerColor: fingerToColor(key.finger, theme),
                finger: fingerToString(key.finger)
            }
        }
        setKeyboard(nextKeyboard)
    }, [keys, heatmap, theme])

    const toggleMap = () => display === 'heatmap' ? setDisplay('fingermap') : setDisplay('heatmap')

    const shouldStagger = config.type === CminiBoardType.Staggered
    const shouldShowHeatmap = display === 'heatmap'
    return (
        <Stack className={style['keyboard']}>
            <Stack className="keys">
                {keyboard.map((columns, i) => (
                    <div className={style['key-row']} key={i} style={{ marginLeft: shouldStagger ? (config?.size || 50) * (Math.floor(i / 2) * 0.5 + Math.floor(i / 2) * 0.33 + (i % 2 > 0 ? 0.33 : 0)) : 0 }}>
                        {columns.map(({ key, heatColor, fingerColor, heat, finger }) => (
                            <div className={style['key-container']} key={key} style={{width: config.size || 50, height: config.size || 50}}>
                                <div className={style['key']} style={{ backgroundColor: shouldShowHeatmap ? heatColor : fingerColor, color: theme.text, border: `1px solid ${theme.border}` }}>
                                    <div className={style['key-text']}><Typography>{key}</Typography></div>
                                    {showDisplay && (
                                        <Typography fontSize="0.6em">{shouldShowHeatmap ? heat : finger}</Typography>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </Stack>
            <Stack>
                <ButtonGroup variant="text">
                    <IconButton onClick={toggleMap}>
                        {shouldShowHeatmap ? <WhatshotIcon /> : <FrontHandIcon />}
                    </IconButton>
                    <IconButton onClick={() => setShowDisplay(!showDisplay)}>
                        {showDisplay ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </ButtonGroup>
            </Stack>
        </Stack>
    )
}