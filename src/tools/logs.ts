/**
 * 根据日志字符串获取日志类型。
 * @param logString - 要分析的日志字符串。
 * @returns 返回对应的日志类型（'DEBUG', 'INFO', 'WARN', 'ERROR'），如果没有匹配的前缀则返回 null。
 */
export function getLogType(logString: string) {
    const prefixes = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    for (const prefix of prefixes) {
        if (logString.startsWith(`[${prefix}]`)) {
            return prefix;
        }
    }
    return null; // 如果没有匹配的前缀，返回null或其他适当的值
}