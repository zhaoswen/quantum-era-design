import {ElMessage} from "element-plus";

/**
 * 显示一个信息类型的消息提示框。
 * @param message - 要显示的消息内容。
 * 内容为纯文本格式。
 */
function info(message: string) {
  ElMessage({
    message: message,
    showClose: true,
    type: "info",
    plain: true,
  });
}

/**
 * 显示警告消息。
 * @param message 要显示的警告消息内容。
 * 
 * 消息类型为 "warning"，并且以纯文本形式呈现。
 */
function warn(message: string) {
  ElMessage({
    message: message,
    showClose: true,
    type: "warning",
    plain: true,
  });
}

/**
 * 显示错误消息的函数。
 * @param message - 要显示的错误消息字符串。
 * @param code - 可选的错误代码，默认值为1001。
 * 包含错误代码和消息内容，并允许用户关闭消息。
 */
function error(message: string, code: number = 1001) {
  ElMessage({
    message: "[ " + code + " ] " + message,
    showClose: true,
    type: "error",
    plain: true,
  });
}

/**
 * 显示成功消息。
 * @param message 要显示的成功消息内容。
 */
function success(message: string) {
  ElMessage({
    message: message,
    showClose: true,
    type: "success",
    plain: true,
  });
}

export { info, warn, error, success };
