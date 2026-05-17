// 支持 CSS Modules（.module.scss）
declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };

    export default classes;
}

// 可选：支持全局 SCSS（非 Modules，如 reset.scss）
declare module '*.scss' {
    const content: Record<string, string>;

    export default content;
}

declare  module  '*.ts';
