# Git 提交指南

## 目录优化总结

### ✅ 已完成的优化

1. **文档整理**
   - ✅ 创建 `docs/` 目录
   - ✅ 移动 `QUICK_TEST.md` → `docs/QUICK_TEST.md`
   - ✅ 移动 `TEST_REPORT.md` → `docs/TEST_REPORT.md`
   - ✅ 移动 `WEB_TEST_GUIDE.md` → `docs/WEB_TEST_GUIDE.md`
   - ✅ 创建 `docs/PROJECT_STRUCTURE.md` 项目结构说明

2. **Docker 文件整理**
   - ✅ 创建 `docker/` 目录
   - ✅ 移动 `Dockerfile` → `docker/Dockerfile`
   - ✅ 移动 `docker-compose.yml` → `docker/docker-compose.yml`
   - ✅ 移动 `nginx.conf` → `docker/nginx.conf`
   - ✅ 更新 `docker-compose.yml` 中的路径引用
   - ✅ 更新 `README.md` 中的 Docker 部署说明

3. **配置文件优化**
   - ✅ 更新 `.gitignore` 添加更完整的忽略规则
   - ✅ 创建 `.dockerignore` 文件

## 提交步骤

### 1. 初始化 Git 仓库（如果还没有）

```bash
git init
```

### 2. 检查文件状态

```bash
git status
```

### 3. 添加所有文件

```bash
git add .
```

### 4. 提交更改

```bash
git commit -m "feat: 初始提交 - 孕妇饮食记录应用

功能特性:
- 🍽️ 食物记录：支持记录早餐、午餐、晚餐和加餐
- 📊 血糖记录：支持每日4次测量（空腹、三餐后2h）
- 📈 营养分析：自动计算10+种营养素摄入情况
- 📅 日历视图：快速查看历史记录
- 🔐 账号管理：管理员登录保护
- 🗄️ 食物数据库：管理食物营养信息

技术栈:
- React 18 + TypeScript
- Vite + Tailwind CSS
- Docker + Nginx 部署支持

目录优化:
- 整理文档到 docs/ 目录
- 整理 Docker 文件到 docker/ 目录
- 更新 .gitignore 和配置文件"
```

### 5. 添加远程仓库（如果需要）

```bash
git remote add origin <your-repository-url>
```

### 6. 推送到远程仓库

```bash
git branch -M main
git push -u origin main
```

## 提交信息规范

### 提交类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

### 提交示例

```bash
# 功能提交
git commit -m "feat: 添加血糖记录功能"

# 修复提交
git commit -m "fix: 修复日期格式显示问题"

# 文档提交
git commit -m "docs: 更新 README 添加 Docker 部署说明"

# 重构提交
git commit -m "refactor: 优化项目目录结构"
```

## 注意事项

1. **不要提交的文件**
   - `node_modules/` - 依赖包
   - `dist/` - 构建输出
   - `.DS_Store` - macOS 系统文件
   - `*.log` - 日志文件

2. **建议提交的文件**
   - 所有源代码文件
   - 配置文件（package.json, tsconfig.json 等）
   - 文档文件
   - Docker 相关文件

3. **可选提交的文件**
   - `package-lock.json` - 建议提交以确保依赖版本一致

## 验证提交

提交后可以验证：

```bash
# 查看提交历史
git log --oneline

# 查看文件变更
git show --stat

# 查看特定文件的变更
git diff HEAD~1 <filename>
```

