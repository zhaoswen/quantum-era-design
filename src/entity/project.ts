
interface Project {
    name: string,
    path: string,
    description: string,
    // 允许为空
    blueprints?: Blueprint[],
    configs?: Config[],
    dependencies: Dependency[],
}

interface Blueprint {
    name: string,
    path: string,
}

interface Config {
    name: string,
    path: string,
}

interface Dependency {
    name: string,
    path: string,
}