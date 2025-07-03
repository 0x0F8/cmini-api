export function getCharFromCode(code: string) {
  switch (code) {
    case "KeyA":
      return "a";
    case "KeyB":
      return "b";
    case "KeyC":
      return "c";
    case "KeyD":
      return "d";
    case "KeyE":
      return "e";
    case "KeyF":
      return "f";
    case "KeyG":
      return "g";
    case "KeyH":
      return "h";
    case "KeyI":
      return "i";
    case "KeyJ":
      return "j";
    case "KeyK":
      return "k";
    case "KeyL":
      return "l";
    case "KeyM":
      return "m";
    case "KeyN":
      return "n";
    case "KeyO":
      return "o";
    case "KeyP":
      return "p";
    case "KeyQ":
      return "q";
    case "KeyR":
      return "r";
    case "KeyS":
      return "s";
    case "KeyT":
      return "t";
    case "KeyU":
      return "u";
    case "KeyV":
      return "v";
    case "KeyW":
      return "w";
    case "KeyX":
      return "x";
    case "KeyY":
      return "y";
    case "KeyZ":
      return "z";
    case "Digit1":
      return "1";
    case "Digit2":
      return "2";
    case "Digit3":
      return "3";
    case "Digit4":
      return "4";
    case "Digit5":
      return "5";
    case "Digit6":
      return "6";
    case "Digit7":
      return "7";
    case "Digit8":
      return "8";
    case "Digit9":
      return "9";
    case "Digit0":
      return "0";
    case "Minus":
      return "-";
    case "Equal":
      return "=";
    case "BracketLeft":
      return "[";
    case "BracketRight":
      return "]";
    case "Backslash":
      return "\\";
    case "Semicolon":
      return ";";
    case "Quote":
      return "'";
    case "Comma":
      return ",";
    case "Period":
      return ".";
    case "Slash":
      return "/";
    case "Backquote":
      return "`";
    case "Space":
      return " ";
    default:
      return code;
  }
}

export function getUpshiftedKey(char: string) {
  switch (char) {
    case "a":
      return "A";
    case "b":
      return "B";
    case "c":
      return "C";
    case "d":
      return "D";
    case "e":
      return "E";
    case "f":
      return "F";
    case "g":
      return "G";
    case "h":
      return "H";
    case "i":
      return "I";
    case "j":
      return "J";
    case "k":
      return "K";
    case "l":
      return "L";
    case "m":
      return "M";
    case "n":
      return "N";
    case "o":
      return "O";
    case "p":
      return "P";
    case "q":
      return "Q";
    case "r":
      return "R";
    case "s":
      return "S";
    case "t":
      return "T";
    case "u":
      return "U";
    case "v":
      return "V";
    case "w":
      return "W";
    case "x":
      return "X";
    case "y":
      return "Y";
    case "z":
      return "Z";
    case "1":
      return "!";
    case "2":
      return "@";
    case "3":
      return "#";
    case "4":
      return "$";
    case "5":
      return "%";
    case "6":
      return "^";
    case "7":
      return "&";
    case "8":
      return "*";
    case "9":
      return "(";
    case "0":
      return ")";
    case "-":
      return "_";
    case "=":
      return "+";
    case "[":
      return "{";
    case "]":
      return "}";
    case "\\":
      return "|";
    case ";":
      return ":";
    case "'":
      return '"';
    case ",":
      return "<";
    case ".":
      return ">";
    case "/":
      return "?";
    case "`":
      return "~";
    default:
      return char;
  }
}

export function getDownshiftedKey(char: string) {
  switch (char) {
    case "A":
      return "a";
    case "B":
      return "b";
    case "C":
      return "c";
    case "D":
      return "d";
    case "E":
      return "e";
    case "F":
      return "f";
    case "G":
      return "g";
    case "H":
      return "h";
    case "I":
      return "i";
    case "J":
      return "j";
    case "K":
      return "k";
    case "L":
      return "l";
    case "M":
      return "m";
    case "N":
      return "n";
    case "O":
      return "o";
    case "P":
      return "p";
    case "Q":
      return "q";
    case "R":
      return "r";
    case "S":
      return "s";
    case "T":
      return "t";
    case "U":
      return "u";
    case "V":
      return "v";
    case "W":
      return "w";
    case "X":
      return "x";
    case "Y":
      return "y";
    case "Z":
      return "z";
    case "!":
      return "1";
    case "@":
      return "2";
    case "#":
      return "3";
    case "$":
      return "4";
    case "%":
      return "5";
    case "^":
      return "6";
    case "&":
      return "7";
    case "*":
      return "8";
    case "(":
      return "9";
    case ")":
      return "0";
    case "_":
      return "-";
    case "+":
      return "=";
    case "{":
      return "[";
    case "}":
      return "]";
    case "|":
      return "\\";
    case ":":
      return ";";
    case '"':
      return "'";
    case "<":
      return ",";
    case ">":
      return ".";
    case "?":
      return "/";
    case "~":
      return "`";
    default:
      return char;
  }
}

export function getPrintableChars(
  {
    number = false,
    alphaLower = false,
    alphaUpper = false,
    punc = false,
  }: {
    number?: boolean;
    alphaLower?: boolean;
    alphaUpper?: boolean;
    punc?: boolean;
  } = {
    number: true,
    alphaLower: true,
    alphaUpper: true,
    punc: true,
  }
) {
  const cnumber = "1234567890";
  const calphaLower = "qwertyuiopzxcvbnmasdfghjkl";
  const calphaUpper = "QWERTYUIOPZXCVBNMASDFGHJKL";
  const cpunc = '`-=[]\\;\',./~!@#$%^&*()_+{}|:"<>?"` ';
  let input = "";
  if (number) input += cnumber;
  if (alphaLower) input += calphaLower;
  if (alphaUpper) input += calphaUpper;
  if (punc) input += cpunc;
  return input.split("").map((c) => c.charCodeAt(0));
}

export function getPhysicalKeyMap() {
  return ["qwertyuiop[]\\", "asdfghjkl;'", "zxcvbnm,./"].reduce<
    Record<string, number>
  >((previous, current, row) => {
    for (let column = 0; column < current.length; column++) {
      const char = current[column];
      const charCode = char.charCodeAt(0);
      const k = column + ":" + row;
      previous[k] = charCode;
    }
    return previous;
  }, {});
}
