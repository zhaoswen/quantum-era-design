import useProjectStore from "../store/project";
import {success, warn} from "../tools/message";
import {compile_blueprint, run_blueprint, save_blueprint} from "./blueprint";


/**
 * 处理键盘事件的函数，用于监听特定的快捷键组合来执行相应的操作。
 * 目前支持的快捷键包括：
 * - Ctrl + S 或 Command + S：保存当前打开的蓝图文件。
 * - Ctrl + R 或 Command + R：运行当前打开的蓝图文件。
 * - Ctrl + B 或 Command + B：编译当前打开的蓝图文件。
 * 如果没有打开任何蓝图文件，将会显示警告信息提示用户先打开一个蓝图文件。
 *
 * @param event - 键盘事件对象，用于检测按下的键和组合键。
 */
export const handleKeyboardEvent = (event: KeyboardEvent,) => {
    const project = useProjectStore();
    // 检查是否按下了 Ctrl + S 或 Command + S，运行蓝图
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault(); // 阻止默认的保存行为
        // 判断是否已经打开了蓝图
        if (project.active_blueprint == "") {
            warn('请打开一个蓝图文件');
            return;
        } else {
            save_blueprint().then(_ => {
                success('当前蓝图已保存');
            });
        }
    }
    // Ctrl + R 运行蓝图
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r') {
        event.preventDefault(); // 阻止默认行为
        // 判断是否已经打开了蓝图
        if (project.active_blueprint == "") {
            warn('请打开一个蓝图文件');
            return;
        } else {
            run_blueprint();
        }
    }
    // Ctrl + B 编译蓝图
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault(); // 阻止默认行为
        // 判断是否已经打开了蓝图
        if (project.active_blueprint == "") {
            warn('请打开一个蓝图文件');
            return;
        } else {
            compile_blueprint().then(_ => {
                success('当前蓝图已编译');
            });
        }
    }
};