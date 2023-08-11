import { MDXProvider } from "@mdx-js/react"
import { renderToReadableStream } from "react-dom/server"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import remarkFrontmatter from "remark-frontmatter"
import remarkDirective from "remark-directive"
import remarkMath from "remark-math"
import rehypePrism from "rehype-prism-plus"
import rehypeKatex from "rehype-katex" // Render math with KaTeX.
import { evaluate, nodeTypes } from "@mdx-js/mdx"
import { VFile } from "vfile"
import { VFileMessage } from "vfile-message"
import * as runtime from "react/jsx-runtime"
import type { PluggableList } from "unified"
import { Fragment, createContext } from "react"
import { defaultComponents } from "./DefaultComponents"
import rehypeAddLineNumbers from "./customRehypePlugins"

export const Context = createContext({ isMac: true })

export interface CompileMdxProps {
  mdx: string
}

async function compileMdx({ mdx }: CompileMdxProps) {
  const file = new VFile({ basename: "example.mdx", value: mdx })
  let html = ""
  let error

  const remarkPlugins = [
    remarkGfm,
    remarkFrontmatter,
    remarkMath,
    remarkDirective,
  ]

  const rehypePlugins: PluggableList = [
    rehypeKatex,
    rehypePrism,
    rehypeAddLineNumbers,
    [rehypeRaw, { passThrough: nodeTypes }],
  ]

  try {
    const Content = (
      await evaluate(file, {
        ...runtime,
        useDynamicImport: true,
        remarkPlugins,
        rehypePlugins,
        Fragment,
      })
    ).default
    // MDN https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream
    const res = renderToReadableStream(
      <Context.Provider value={{ isMac: true }}>
        <MDXProvider components={{ ...defaultComponents }}>
          <section
            data-tool="编辑器"
            data-website="https://bing.com"
            className="markdown-body"
          >
            <Content />
          </section>
        </MDXProvider>
      </Context.Provider>
    )
    await res
      .then((rb) => {
        const reader = rb.getReader()
        return new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                // If there is no more data to read
                if (done) {
                  controller.close()
                  return
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value)
                // Check chunks by logging to the console
                push()
              })
            }
            push()
          },
        })
      })
      .then((stream) =>
        // Respond with our stream
        new Response(stream, {
          headers: { "Content-Type": "text/html" },
        }).text()
      )
      .then((result) => {
        html = result
      })
      .catch((err) => {
        error = err
      })
  } catch (error: any) {
    const message =
      error instanceof VFileMessage ? error : new VFileMessage(error)

    if (!file.messages.includes(message)) {
      file.messages.push(message)
    }

    message.fatal = true
  }

  return { error, html }
}

export { compileMdx }