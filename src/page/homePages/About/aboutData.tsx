// aboutData.ts
export interface Skill {
    name: string;
    level?: number;
    category: 'frontend' | 'backend' | 'devops' | 'creative';
}

export interface Bookmark {
    title: string;
    url: string;
    icon: string;
}

export const personalInfo = {
    name: '具雪雲',
    nickname: 'neter',
    role: '全栈开发工程师 / 技术创作者',
    location: '中国 · 上海',
    email: 'juxueyun@example.com',
    github: 'github.com/juxueyun',
    bio: '拥有6年全栈开发经验，热爱探索前沿技术、系统架构与视频创作。热衷于将复杂的技术概念转化为通俗易懂的内容，分享给更多开发者。',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jueyun&backgroundColor=6c63ff',
};

export const skills: Skill[] = [
    { name: 'React', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 88, category: 'frontend' },
    { name: 'Java', level: 85, category: 'backend' },
    { name: 'Node.js', level: 82, category: 'backend' },
    { name: 'Linux系统', level: 80, category: 'devops' },
    { name: 'Docker/K8s', level: 75, category: 'devops' },
    { name: '视频剪辑', level: 85, category: 'creative' },
    { name: '内容创作', level: 90, category: 'creative' },
];

export const tools = ['VS Code', 'Git', 'Figma', 'Postman', 'Jenkins', 'Prometheus'];

export const bookmarks: Bookmark[] = [
    { title: 'React 官方文档', url: '#', icon: '⚛️' },
    { title: 'TypeScript 手册', url: '#', icon: '📘' },
    { title: 'Linux 内核文档', url: '#', icon: '🐧' },
    { title: 'MDN Web Docs', url: '#', icon: '🌐' },
    { title: 'Java 并发编程', url: '#', icon: '☕' },
    { title: '视频创作教程', url: '#', icon: '🎬' },
];

export const highlights = [
    {
        title: '从零配置Linux硬盘分区',
        description: '深入解析12.1版硬盘分区策略与LVM架构实战',
        type: 'video' as const,
        tags: ['Linux', '系统管理'],
    },
    {
        title: 'React 18 并发特性深度剖析',
        description: '新架构、Transition、Suspense最佳实践',
        type: 'article' as const,
        tags: ['React', '前端'],
    },
    {
        title: 'Java虚拟线程与高效并发',
        description: 'Project Loom 实战与性能对比',
        type: 'article' as const,
        tags: ['Java', '并发'],
    },
    {
        title: '视频创作工作流搭建指南',
        description: '从录制到剪辑，高效产出技术教程',
        type: 'video' as const,
        tags: ['创作', '工具链'],
    },
];

export const stats = [
    { label: '技术文章', value: '34', icon: '📝' },
    { label: '视频教程', value: '18', icon: '🎥' },
    { label: 'GitHub 仓库', value: '42', icon: '💻' },
    { label: '合作项目', value: '12', icon: '🤝' },
];