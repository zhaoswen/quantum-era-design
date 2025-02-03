/**
 * @fileoverview 描述了插件接口的定义，用于定义插件的基本信息。
 * @interface
 * @property {string} id - 插件的唯一标识符。
 * @property {string} name - 插件的名称。
 * @property {string} description - 插件的描述信息。
 * @property {string} version - 插件的版本号。
 * @property {string} update_date - 插件的更新日期。
 * @property {string} author - 插件的作者。
 * @property {string} email - 作者的电子邮件地址。
 * @property {string} homepage - 插件的主页链接。
 * @property {string} [license] - 插件的许可证信息（可选）。
 */
export interface SimxPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  update_date: string;
  author: string;
  email: string;
  homepage: string;
  license?: string;
}

/**
 * @description 描述了 SimxPluginHandlers 接口，该接口定义了插件处理程序的基本结构。
 * 每个插件处理程序都有一个唯一的 id 和名称，以及一个处理函数数组。
 * 这些处理函数可以在插件激活时被调用，以执行特定的任务或逻辑。
 * @interface
 */
export interface SimxPluginHandlers {
  id: string;
  name: string;
  func: SimxPluginHandler[];
}

/**
 * @description 描述了一个插件处理器的接口，包括处理器的名称、描述、参数等信息。
 * @interface
 */
export interface SimxPluginHandler {
  handler: string;
  name: string;
  desc: string;
  params: SimxPluginParam[];
}

/**
 * @fileoverview 描述插件参数的接口定义
 * 
 * @interface SimxPluginParam
 * 描述了一个插件参数应具备的属性，包括键名、名称、描述、类型、默认值、是否必填以及可选的选项列表。
 */
export interface SimxPluginParam {
  key: string;
  name: string;
  desc: string;
  type: string;
  default_value: string;
  require: boolean;
  options?: string[];
}
