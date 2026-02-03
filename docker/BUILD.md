# Docker 构建说明

## 问题排查

如果遇到 `COPY failed: no source files were specified` 错误，请检查：

1. **确保在正确的目录执行构建**
   - 使用 docker-compose：必须在 `docker/` 目录下执行
   - 使用 docker build：必须在项目根目录执行

2. **检查构建上下文**
   - docker-compose.yml 中 `context: ..` 表示项目根目录
   - Dockerfile 中的 COPY 路径是相对于构建上下文的

## 正确的构建方法

### 方法1: 使用 Docker Compose（推荐）

```bash
# 步骤1: 进入 docker 目录
cd /Users/sean/dailyfood/docker

# 步骤2: 构建并启动
docker-compose up -d --build
```

### 方法2: 使用 Dockerfile 直接构建

```bash
# 步骤1: 进入项目根目录（重要！）
cd /Users/sean/dailyfood

# 步骤2: 构建镜像
docker build -f docker/Dockerfile -t dailyfood:latest .

# 步骤3: 运行容器
docker run -d -p 8080:80 --name dailyfood-app dailyfood:latest
```

## 验证构建上下文

执行以下命令验证文件是否存在：

```bash
# 在项目根目录执行
cd /Users/sean/dailyfood
ls -la package*.json  # 应该能看到 package.json 和 package-lock.json
```

## 常见错误

### 错误1: COPY failed: no source files were specified

**原因**: 在错误的目录执行构建

**解决**: 
- 如果使用 docker-compose，必须在 `docker/` 目录下执行
- 如果使用 docker build，必须在项目根目录执行

### 错误2: 找不到 Dockerfile

**原因**: 没有指定正确的 Dockerfile 路径

**解决**: 使用 `-f docker/Dockerfile` 指定路径

