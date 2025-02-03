import {XYPosition} from "@vue-flow/core";

/**
 * `NodeData` 接口定义了节点的数据结构。
 * 每个节点具有唯一的标识符、类型、位置以及包含基础信息、组件和自定义数据的详细数据对象。
 * 
 * @interface NodeData
 * @property {string} id - 节点的唯一标识符。
 * @property {string} type - 节点的类型。
 * @property {XYPosition} position - 节点在界面上的位置。
 * @property {Object} data - 包含节点详细信息的对象。
 * @property {Object} data.basic - 节点的基础信息。
 * @property {string} data.basic.id - 基础信息的唯一标识符。
 * @property {string} data.basic.label - 节点的标签。
 * @property {string} data.basic.handler - 节点的处理器。
 * @property {boolean} data.basic.disabled - 节点是否被禁用。
 * @property {string[]} data.basic.downstream - 节点的下游节点标识符数组。
 * @property {string[]} data.basic.redress_stream - 节点的纠正流标识符数组。
 * @property {any} data.component - 节点的组件信息。
 * @property {any} data.custom - 节点的自定义数据。
 */
export interface NodeData {
    id: string;
    type: string;
    position: XYPosition;
    data: {
        basic: {
            id: string;
            label: string;
            handler: string;
            disabled: boolean;
            downstream: string[];
            redress_stream: string[];
        };
        component: any;
        custom: any;
    };
}