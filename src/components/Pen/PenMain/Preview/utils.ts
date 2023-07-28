import { MouseEventType } from "./IframeContent"

export const minView = { minWidth: 50, minHeight: 50 }
export const handlerSize = 17 // 操作预览区域宽高的高度或者宽度
// 获取鼠标移动位置
export function getPointerPosition(e: MouseEventType) {
  return { x: e.clientX, y: e.clientY }
}

// 计算缩小比例和宽度
export function getZoomWithWidth(screenWidth: number, previewWidth: number) {
  const zoom = previewWidth > screenWidth ? screenWidth / previewWidth : 1
  return {
    zoom,
    width: Math.min(
      Math.max(minView.minWidth, Math.round(previewWidth * (1 / zoom))),
      Math.round(screenWidth * (1 / zoom))
    ),
  }
}
// 计算缩小比例和高度
export function getZoomWithHeight(screenHeight: number, previewHeight: number) {
  const zoom = previewHeight > screenHeight ? screenHeight / previewHeight : 1
  return {
    zoom,
    height: Math.min(
      Math.max(minView.minHeight, Math.round(previewHeight * (1 / zoom))),
      Math.round(screenHeight * (1 / zoom))
    ),
  }
}
