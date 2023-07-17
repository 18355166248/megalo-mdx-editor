import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { debounce } from "lodash-es"

export const HTML_URI = "file:///index.md"

export function setupMarkdownMode(
  content: string,
  onChange: () => void,
  getEditor: any
) {
  const disposables: monaco.IDisposable[] = []

  const model = monaco.editor.createModel(
    content || "",
    "markdown",
    monaco.Uri.parse(HTML_URI)
  )
  disposables.push(model)

  const updateDecorations = debounce(async () => {}, 100)

  disposables.push(
    model.onDidChangeContent(() => {
      onChange()
    })
  )

  return {
    getModel: () => model,
    updateDecorations,
    activate: () => {
      getEditor().setModel(model)
    },
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}

export const CSS_URI = "file:///index.css"

export function setupCssMode(
  content: string,
  onChange: () => void,
  getEditor: any
) {
  const disposables: monaco.IDisposable[] = []

  const model = monaco.editor.createModel(
    content || "",
    "css",
    monaco.Uri.parse(CSS_URI)
  )
  disposables.push(model)

  const updateDecorations = debounce(async () => {}, 100)

  disposables.push(
    model.onDidChangeContent(() => {
      onChange()
    })
  )

  return {
    getModel: () => model,
    updateDecorations,
    activate: () => {
      getEditor().setModel(model)
    },
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}

export const JS_URI = "file:///index.js"

export function setupJavaScriptMode(
  content: string,
  onChange: () => void,
  getEditor: any
) {
  const disposables: monaco.IDisposable[] = []

  const model = monaco.editor.createModel(
    content || "",
    "javascript",
    monaco.Uri.parse(JS_URI)
  )
  disposables.push(model)

  const updateDecorations = debounce(async () => {}, 100)

  disposables.push(
    model.onDidChangeContent(() => {
      onChange()
    })
  )

  return {
    getModel: () => model,
    updateDecorations,
    activate: () => {
      getEditor().setModel(model)
    },
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}