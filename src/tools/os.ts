import {platform} from '@tauri-apps/plugin-os';

/**
 * 获取操作系统信息。
 * 根据平台返回相应的操作系统类型，支持 macOS、Windows 和 Linux。
 * 不关心具体的系统版本，对于非 macOS 和 Windows 的情况，默认返回 Linux 类型。
 * @returns 返回一个表示操作系统类型的枚举值。
 */
export function getOsInfo(): OsType {
    switch (platform()) {
        case 'macos':
            return OsType.Macos;
        case 'windows':
            return OsType.Windows;
        default:
            // 仅支持macos、windows和linux，不关心具体系统版本
            return OsType.Linux;
    }
}

export enum OsType {
    Linux = 'linux',
    Macos = 'macos',
    Windows = 'windows',
    Ios = 'ios',
    Android = 'android',
}