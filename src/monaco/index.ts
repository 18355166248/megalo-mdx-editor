import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { getColor, makeTheme } from "./utils"
import { getTheme } from "@/utils/theme"
import { monacoConfig } from "./monaco.config"
import { initKeyBindings } from "./keybindings"

export interface CreateMonacoEditorProps {
  container: HTMLElement
}

export function createMonacoEditor({ container }: CreateMonacoEditorProps) {
  const disposables: any[] = [] // 销毁列表

  // 自定义主题 (白天)
  monaco.editor.defineTheme("light", {
    base: "vs",
    inherit: true,
    rules: [
      ...makeTheme({
        comment: "gray.400",
        string: "indigo.600",
        number: "gray.800",
        tag: "sky.600",
        delimiter: "gray.400",
        // HTML
        "attribute.name.html": "sky.500",
        "attribute.value.html": "indigo.600",
        "delimiter.html": "gray.400",
        // JS
        "keyword.js": "sky.600",
        "identifier.js": "gray.800",
        // CSS
        "attribute.name.css": "indigo.600",
        "attribute.value.unit.css": "teal.600",
        "attribute.value.number.css": "gray.800",
        "attribute.value.css": "gray.800",
        "attribute.value.hex.css": "gray.800",
        "keyword.css": "sky.600",
        "function.css": "teal.600",
        "pseudo.css": "sky.600",
        "variable.css": "gray.800",
      }),
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.selectionBackground": "#" + getColor("slate.200"),
      "editor.inactiveSelectionBackground": "#" + getColor("slate.200/0.4"),
      "editorLineNumber.foreground": "#" + getColor("gray.400"),
      "editor.lineHighlightBorder": "#" + getColor("slate.100"),
      "editorBracketMatch.background": "#00000000",
      "editorBracketMatch.border": "#" + getColor("slate.300"),
      "editorSuggestWidget.background": "#" + getColor("slate.50"),
      "editorSuggestWidget.selectedBackground": "#" + getColor("slate.400/0.1"),
      "editorSuggestWidget.selectedForeground": "#" + getColor("slate.700"),
      "editorSuggestWidget.foreground": "#" + getColor("slate.700"),
      "editorSuggestWidget.highlightForeground": "#" + getColor("indigo.500"),
      "editorSuggestWidget.focusHighlightForeground":
        "#" + getColor("indigo.500"),
      "editorHoverWidget.background": "#" + getColor("slate.50"),
      "editorError.foreground": "#" + getColor("red.500"),
      "editorWarning.foreground": "#" + getColor("yellow.500"),
    },
  })
  // 自定义主题 (夜间)
  monaco.editor.defineTheme("dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      ...makeTheme({
        comment: "slate.400",
        string: "sky.300",
        number: "slate.50",
        tag: "pink.400",
        delimiter: "slate.500",
        // HTML
        "attribute.name.html": "slate.300",
        "attribute.value.html": "sky.300",
        "delimiter.html": "slate.500",
        // JS
        "keyword.js": "slate.300",
        // CSS
        "attribute.name.css": "sky.300",
        "attribute.value.unit.css": "teal.400",
        "attribute.value.number.css": "teal.500",
        "attribute.value.css": "slate.300",
        "attribute.value.hex.css": "slate.300",
        "keyword.css": "slate.300",
        "function.css": "slate.200",
        "pseudo.css": "slate.300",
        "variable.css": "slate.50",
      }),
    ],
    colors: {
      "editor.background": "#" + getColor("slate.800"),
      "editor.selectionBackground": "#" + getColor("slate.700"),
      "editor.inactiveSelectionBackground": "#" + getColor("slate.700/0.6"),
      "editorLineNumber.foreground": "#" + getColor("slate.600"),
      "editor.lineHighlightBorder": "#" + getColor("slate.700"),
      "editorBracketMatch.background": "#00000000",
      "editorBracketMatch.border": "#" + getColor("slate.500"),
      "editorSuggestWidget.background": "#" + getColor("slate.700"),
      "editorSuggestWidget.selectedBackground":
        "#" + getColor("slate.400/0.12"),
      "editorSuggestWidget.foreground": "#" + getColor("slate.300"),
      "editorSuggestWidget.selectedForeground": "#" + getColor("slate.300"),
      "editorSuggestWidget.highlightForeground": "#" + getColor("sky.400"),
      "editorSuggestWidget.focusHighlightForeground": "#" + getColor("sky.400"),
      "editorHoverWidget.background": "#" + getColor("slate.700"),
      "editorError.foreground": "#" + getColor("red.400"),
      "editorWarning.foreground": "#" + getColor("yellow.400"),
    },
  })

  monaco.editor.addKeybindingRules([
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      command: "editor.action.formatDocument", // ID
      when: "textInputFocus", // When
    },
  ])

  // 初始化编辑器
  const editor = monaco.editor.create(container, {
    theme: getTheme() === "dark" ? "dark" : "light",
    wordWrap: "on", // 文本换行配置
    lineHeight: monacoConfig.lineHeight,
    fontSize: monacoConfig.fontSize,
    minimap: {
      enabled: false, // 隐藏
    },
    fixedOverflowWidgets: true, // 我的编辑器整体宽度较小，而提示项的宽度较大，导致提示框的一部分被覆盖。查了一下issues，没有直接把提示框限定在编辑器范围内的配置项。但有一个相关的配置项，设置为true后，可以把隐藏的部分显示出来
    unicodeHighlight: {
      ambiguousCharacters: false, // 取消 unicode ASCII编码 字符串高亮问题
    },
  })

  disposables.push(editor)

  // 初始化快捷键
  initKeyBindings(editor)
  console.log((editor as any)._standaloneKeybindingService.addDynamicKeybinding)

  // ;(editor as any)._standaloneKeybindingService.addDynamicKeybinding(
  //   "-editor.action.formatDocument", // command ID prefixed by '-'

  // )

  return {
    dispose: () => {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}
