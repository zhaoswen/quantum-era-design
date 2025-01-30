import {ref} from 'vue';

/**
 * `useOpenFileDialog` 是一个自定义 Hook，用于处理文件选择对话框的打开和文件内容的读取。
 * 它返回一个对象，包含以下属性和方法：
 * - `openFileDialog`: 一个异步函数，用于触发文件选择对话框并读取选中的文件内容。
 * - `selectedFile`: 一个响应式引用，存储选中的文件对象，类型为 `File | null`。
 * - `fileContent`: 一个响应式引用，存储文件的内容，类型可以是 `string | ArrayBuffer | null`。
 * - `filePath`: 一个响应式引用，存储文件的路径或名称，类型为 `string | null`。
 * 
 * 当调用 `openFileDialog` 函数时，会创建一个隐藏的文件输入元素，并模拟点击该元素以打开文件选择对话框。
 * 用户选择文件后，会读取文件的内容，并通过 Promise 的 resolve 返回文件内容和文件路径。
 * 如果用户取消选择或读取文件失败，则会相应地处理并返回 null 值。
 * 
 * @returns 返回包含 openFileDialog 函数和文件相关引用的对象。
 */
export function useOpenFileDialog() {
    const selectedFile = ref<File | null>(null);
    const fileContent = ref<string | ArrayBuffer | null>(null);
    const filePath = ref<string | null>(null);

    const openFileDialog = async () => {
        return new Promise<{ fileContent: string | ArrayBuffer | null; filePath: string | null }>((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.click();

            input.onchange = (event) => {
                const file = (event.target as HTMLInputElement)?.files?.[0];
                if (file) {
                    selectedFile.value = file;
                    filePath.value = file.name;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target && e.target.result !== undefined) {
                            fileContent.value = e.target.result;
                            resolve({ fileContent: fileContent.value, filePath: filePath.value });
                        } else {
                            fileContent.value = null;
                            resolve({ fileContent: null, filePath: filePath.value });
                        }
                    };
                    reader.onerror = () => {
                        fileContent.value = null;
                        reject(new Error('Failed to read file'));
                    };
                    reader.readAsText(file);
                } else {
                    fileContent.value = null;
                    resolve({ fileContent: null, filePath: null });
                }
            };

            input.oncancel = () => {
                fileContent.value = null;
                resolve({ fileContent: null, filePath: null });
            };

            // 清理临时元素
            input.addEventListener('change', () => {
                document.body.removeChild(input);
            });
        });
    };

    return { openFileDialog, selectedFile, fileContent, filePath };
}