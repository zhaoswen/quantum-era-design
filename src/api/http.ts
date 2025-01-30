import {invoke} from '@tauri-apps/api/core';
import useConfigStore from '../store/configuration';
import {error, warn} from '../tools/message';

/**
 * 由于项目的特殊性，无法直接使用axios
 *
 * 需要通过rust调用http
 * */

// 检查中央仓库连通性
export async function checkReceptionistLink() {
    const config = useConfigStore();
    let basic = config.rece_config.receptionist_server_url;
    let response: any;
    try {
        response = await invoke('request', {
            path: basic + "/era/test",
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response);
        if (!response.success as boolean) {
            warn("中央仓库无法连接，设计器进入离线模式");
        }
    } catch (e) {
        warn("中央仓库无法连接，设计器进入离线模式");
    }
}

// 获取指定的配置
export async function getProfileByReceptionist(extensionId: string) {
    const config = useConfigStore();
    let basic = config.rece_config.receptionist_server_url;
    // Send a GET request
    let response: any;
    try {
        response = await invoke('request', {
            path: basic + "/era/getExtensionConfig?extensionId=" + extensionId,
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.success as boolean) {
            error("请求失败：" + response.message, response.code);
        }
    } catch (e) {
        error(e as string, 1980);
    }
    return response;
}

