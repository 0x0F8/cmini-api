'use client'

import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Box, BoxProps } from "@mui/material";
import { useEventListener } from 'usehooks-ts'
import { CminiKey } from "@backend/cmini/types";
import { getCharFromCode, getUpshiftedKey, getPhysicalKeyMap, getPrintableChars } from "@util/input";

export default function TypingInput({ keys, expectedCharacter, allowBackspace = true, value, setValue, autoFocus = true, ...props }: { keys: CminiKey[]; expectedCharacter: string; allowBackspace?: boolean; value: string; setValue: (value:string) => void } & Omit<BoxProps, 'onKeyDown' | 'onKeyUp' | 'onKeypress' | 'value' | 'defaultValue'>) {
    const documentRef = useRef<Document>(typeof document !== 'undefined' ? document : undefined)
    const [keyMap, setKeymap] = useState<Record<string, number>>()
    const physicalKeyMap = useMemo(getPhysicalKeyMap, [])
    const printableChars = useMemo(getPrintableChars, [])

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if (!keyMap) {
            return
        }

        if (allowBackspace && event.code === "Backspace") {
            setValue(value.slice(0, value.length - 1))
            return
        }

        const code = getCharFromCode(event.code)
        if (code.length > 1) {
            return
        }

        const keyCode = code.charCodeAt(0)
        const isPrintable = printableChars.includes(keyCode)
        if (!isPrintable) {
            return
        }

        const shouldTranslateKey = String(keyCode) in keyMap
        let nextChar: string = ''
        if (shouldTranslateKey) {
            const translatedKeyCode = keyMap[String(keyCode)]
            const char = String.fromCharCode(translatedKeyCode)
            if (event.shiftKey) {
                nextChar = getUpshiftedKey(char)
            } else {
                nextChar = char
            }
        } else {
            const char = String.fromCharCode(keyCode)
            if (event.shiftKey) {
                nextChar = getUpshiftedKey(char)
            } else {
                nextChar = char
            }
        }

        if (nextChar !== expectedCharacter) {
            return
        }

        setValue(value + nextChar)
    }, [keyMap, value, expectedCharacter])

    useEventListener('keydown', onKeyDown, documentRef as RefObject<Document>)
    useEffect(() => {
        const nextKeymap: Record<string, number> = {}
        for (const { row, column, key } of keys) {
            const translatedCharCode = physicalKeyMap[column + ':' + row]
            if (translatedCharCode === undefined) {
                console.error(`${String.fromCharCode(key)} could not be translated`)
            }
            nextKeymap[String(translatedCharCode)] = key
        }
        setKeymap(nextKeymap)
    }, [keys])
    
    return (
        <Box>
            <Box {...props}>
                {value}
            </Box>
            <Box sx={{ height: '100%', width: '2px', background: '#000', position: 'absolute', right: 0, top: 0 }}/>
        </Box>
    )
}