# 项目结构说明

## 目录结构

```
dailyfood/
├── src/                    # 源代码目录
│   ├── components/         # React 组件
│   │   ├── FoodForm.tsx           # 食物记录表单
│   │   ├── FoodList.tsx            # 食物列表
│   │   ├── BloodSugarForm.tsx     # 血糖记录表单
│   │   ├── BloodSugarList.tsx     # 血糖列表
│   │   ├── NutritionAnalysis.tsx   # 营养分析
│   │   ├── CalendarView.tsx        # 日历视图
│   │   ├── Navbar.tsx              # 导航栏
│   │   ├── Login.tsx               # 登录组件
│   │   ├── AccountManager.tsx      # 账号管理
│   │   ├── FoodDatabaseManager.tsx # 食物数据库管理
│   │   └── FoodDetailModal.tsx     # 食物详情模态框
│   ├── data/               # 数据文件
│   │   └── foodDatabase.ts  # 食物数据库
│   ├── utils/              # 工具函数
│   │   ├── storage.ts              # 存储工具
│   │   ├── nutrition.ts            # 营养计算
│   │   ├── auth.ts                 # 认证工具
│   │   ├── bloodSugarStorage.ts    # 血糖存储
│   │   └── foodDatabaseStorage.ts  # 食物数据库存储
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx             # 入口文件
│   ├── types.ts             # TypeScript 类型定义
│   └── index.css            # 全局样式
│
├── docker/                 # Docker 相关文件
│   ├── Dockerfile          # Docker 构建文件
│   ├── docker-compose.yml  # Docker Compose 配置
│   └── nginx.conf          # Nginx 配置文件
│
├── docs/                   # 文档目录
│   ├── QUICK_TEST.md       # 快速测试指南
│   ├── TEST_REPORT.md      # 测试报告
│   ├── WEB_TEST_GUIDE.md   # Web 测试指南
│   └── PROJECT_STRUCTURE.md # 项目结构说明（本文件）
│
├── dist/                   # 构建输出目录（不提交到 Git）
├── node_modules/           # 依赖包目录（不提交到 Git）
│
├── .gitignore             # Git 忽略文件
├── .dockerignore          # Docker 忽略文件
├── README.md              # 项目说明文档
├── package.json           # 项目配置和依赖
├── package-lock.json      # 依赖锁定文件（不提交到 Git）
├── tsconfig.json          # TypeScript 配置
├── tsconfig.node.json     # Node.js TypeScript 配置
├── vite.config.ts         # Vite 构建配置
├── tailwind.config.js     # Tailwind CSS 配置
├── postcss.config.js      # PostCSS 配置
└── index.html             # HTML 入口文件
```

## 目录说明

### src/
源代码目录，包含所有应用的核心代码。

### docker/
Docker 部署相关文件，包括：
- `Dockerfile`: 多阶段构建配置
- `docker-compose.yml`: Docker Compose 配置
- `nginx.conf`: Nginx 服务器配置

### docs/
项目文档目录，包含：
- 测试文档
- 使用指南
- 项目结构说明

### 根目录配置文件
- `package.json`: 项目依赖和脚本配置
- `tsconfig.json`: TypeScript 编译配置
- `vite.config.ts`: Vite 构建工具配置
- `tailwind.config.js`: Tailwind CSS 样式配置

## 提交说明

### 需要提交的文件
- 所有源代码文件（src/）
- 配置文件（package.json, tsconfig.json 等）
- Docker 相关文件（docker/）
- 文档文件（docs/, README.md）
- Git 配置文件（.gitignore, .dockerignore）

### 不需要提交的文件
- `node_modules/` - 依赖包（通过 npm install 安装）
- `dist/` - 构建输出（通过 npm run build 生成）
- `package-lock.json` - 依赖锁定文件（可选，建议提交）

## Git 提交步骤

```bash
# 1. 初始化 Git 仓库（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交更改
git commit -m "feat: 初始提交 - 孕妇饮食记录应用

- 添加食物记录功能
- 添加血糖记录功能（每日4次测量）
- 添加营养分析功能
- 添加日历视图
- 添加账号管理功能
- 添加食物数据库管理
- 添加 Docker 部署支持
- 优化项目目录结构"

# 4. 添加远程仓库（如果需要）
git remote add origin <repository-url>

# 5. 推送到远程仓库
git push -u origin main
```

## 目录优化说明

### 优化内容
1. **文档整理**: 将测试文档和指南移动到 `docs/` 目录
2. **Docker 文件整理**: 将 Docker 相关文件移动到 `docker/` 目录
3. **更新 .gitignore**: 添加更完整的忽略规则
4. **更新 README**: 更新 Docker 部署说明以反映新的目录结构

### 优化优势
- 项目结构更清晰
- 文件分类更明确
- 便于维护和扩展
- 符合常见项目组织规范

