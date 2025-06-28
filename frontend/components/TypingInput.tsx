'use client'

import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { Box, BoxProps, InputBase } from "@mui/material";
import { useEventListener } from 'usehooks-ts'
import { CminiKey } from "@backend/cmini/types";

const printableChars = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?"` '.split('').map(c => c.charCodeAt(0))
const physicalKeyMap = [
    'qwertyuiop[]\\',
    'asdfghjkl;\'',
    'zxcvbnm,./'
].reduce<Record<string, number>>((previous, current, row) => {
    for (let column = 0; column < current.length; column++) {
        const char = current[column]
        const charCode = char.charCodeAt(0)
        const k = column + ':' + row
        previous[k] = charCode
    }
    return previous
}, {})

function getCharFromCode(code: string) {
    switch (code) {
        case 'KeyA':
            return 'a'
        case 'KeyB':
            return 'b'
        case 'KeyC':
            return 'c'
        case 'KeyD':
            return 'd'
        case 'KeyE':
            return 'e'
        case 'KeyF':
            return 'f'
        case 'KeyG':
            return 'g'
        case 'KeyH':
            return 'h'
        case 'KeyI':
            return 'i'
        case 'KeyJ':
            return 'j'
        case 'KeyK':
            return 'k'
        case 'KeyL':
            return 'l'
        case 'KeyM':
            return 'm'
        case 'KeyN':
            return 'n'
        case 'KeyO':
            return 'o'
        case 'KeyP':
            return 'p'
        case 'KeyQ':
            return 'q'
        case 'KeyR':
            return 'r'
        case 'KeyS':
            return 's'
        case 'KeyT':
            return 't'
        case 'KeyU':
            return 'u'
        case 'KeyV':
            return 'v'
        case 'KeyW':
            return 'w'
        case 'KeyX':
            return 'x'
        case 'KeyY':
            return 'y'
        case 'KeyZ':
            return 'z'
        case 'Digit1':
            return '1'
        case 'Digit2':
            return '2'
        case 'Digit3':
            return '3'
        case 'Digit4':
            return '4'
        case 'Digit5':
            return '5'
        case 'Digit6':
            return '6'
        case 'Digit7':
            return '7'
        case 'Digit8':
            return '8'
        case 'Digit9':
            return '9'
        case 'Digit0':
            return '0'
        case 'Minus':
            return '-'
        case 'Equal':
            return '='
        case 'BracketLeft':
            return '['
        case 'BracketRight':
            return ']'
        case 'Backslash':
            return '\\'
        case 'Semicolon':
            return ';'
        case 'Quote':
            return '\''
        case 'Comma':
            return ','
        case 'Period':
            return '.'
        case 'Slash':
            return '/'
        case 'Backquote':
            return '`'
        case 'Space':
            return ' '
        default:
            return code
    }
}

function getModifedKey(char: string) {
    switch (char) {
        case 'a':
            return 'A'
        case 'b':
            return 'B'
        case 'c':
            return 'C'
        case 'd':
            return 'D'
        case 'e':
            return 'E'
        case 'f':
            return 'F'
        case 'g':
            return 'G'
        case 'h':
            return 'H'
        case 'i':
            return 'I'
        case 'j':
            return 'J'
        case 'k':
            return 'K'
        case 'l':
            return 'L'
        case 'm':
            return 'M'
        case 'n':
            return 'N'
        case 'o':
            return 'O'
        case 'p':
            return 'P'
        case 'q':
            return 'Q'
        case 'r':
            return 'R'
        case 's':
            return 'S'
        case 't':
            return 'T'
        case 'u':
            return 'U'
        case 'v':
            return 'V'
        case 'w':
            return 'W'
        case 'x':
            return 'X'
        case 'y':
            return 'Y'
        case 'z':
            return 'Z'
        case '1':
            return '!'
        case '2':
            return '@'
        case '3':
            return '#'
        case '4':
            return '$'
        case '5':
            return '%'
        case '6':
            return '^'
        case '7':
            return '&'
        case '8':
            return '*'
        case '9':
            return '('
        case '0':
            return ')'
        case '-':
            return '_'
        case '=':
            return '+'
        case '[':
            return '{'
        case ']':
            return '}'
        case '\\':
            return '|'
        case ';':
            return ':'
        case '\'':
            return '"'
        case ',':
            return '<'
        case '.':
            return '>'
        case '/':
            return '?'
        case '`':
            return '~'
        default:
            return char
    }
}

export default function TypingInput({ keys, expectedCharacter, allowBackspace = true, value, setValue, autoFocus = true, ...props }: { keys: CminiKey[]; expectedCharacter: string; allowBackspace?: boolean; value: string; setValue: (value:string) => void } & Omit<BoxProps, 'onKeyDown' | 'onKeyUp' | 'onKeypress' | 'value' | 'defaultValue'>) {
    const documentRef = useRef<Document>(typeof document !== 'undefined' ? document : undefined)
    const [keyMap, setKeymap] = useState<Record<string, number>>()

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
                nextChar = getModifedKey(char)
            } else {
                nextChar = char
            }
        } else {
            const char = String.fromCharCode(keyCode)
            if (event.shiftKey) {
                nextChar = getModifedKey(char)
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