import {defineStore} from 'pinia';
import {ref} from 'vue';

const useConfigStore = defineStore('config-pinia', () => {
    // 全局配置
    const global_config = ref<GlobalConfig>({
        // 默认主题
        theme: "classics",
        // 夜间模式
        dark_mode: false,
        // 多语言
        language: "zh-CN",
        // 主题颜色
        theme_color: "#69bcff",
    });

    // 中央仓库配置
    const rece_config = ref<ReceConfig>({
        // 中央仓库地址
        receptionist_server_url: 'http://127.0.0.1:8988/api',
        // 中央仓库接口版本
        receptionist_server_api_version: 'v1',
    });
    const engine_config = ref<EngineConfig>({
        engine_version: 'v1.0.0',
    });

    const design_config = ref<DesignConfig>({
        show_tool_bar: false,
        // 蓝图设计器版本
        show_minimap: false
    });
    return {
        global_config,
        engine_config,
        rece_config,
        design_config
    };
});

export default useConfigStore;

// 全局配置
export interface GlobalConfig {
    // 夜间模式
    dark_mode: boolean
    // 当前主题
    theme: string
    // 当前语言
    language: string
    // 主题色
    theme_color: string

}

// 中央仓库配置
export interface ReceConfig {
    receptionist_server_url: string;
    receptionist_server_api_version: string;
}

// 内置引擎配置
export interface EngineConfig {
    engine_version: string;
}

// 蓝图设计器配置
export interface DesignConfig {
    // 是否显示悬浮工具栏
    show_tool_bar: boolean;
    // 是否显示小地图
    show_minimap: boolean;
}