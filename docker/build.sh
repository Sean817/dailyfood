#!/bin/bash

# Docker 构建脚本
# 使用方法: 在 docker/ 目录下执行 ./build.sh

set -e

echo "🔨 开始构建 Docker 镜像..."
echo ""

# 检查是否在 docker 目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误: 请在 docker/ 目录下执行此脚本"
    exit 1
fi

# 检查项目根目录是否存在 package.json
if [ ! -f "../package.json" ]; then
    echo "❌ 错误: 找不到 ../package.json"
    echo "请确保在项目根目录存在 package.json 文件"
    exit 1
fi

echo "✅ 检查通过，开始构建..."
echo ""

# 使用 docker-compose 构建
docker-compose build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "启动容器:"
    echo "  docker-compose up -d"
    echo ""
    echo "查看日志:"
    echo "  docker-compose logs -f app"
    echo ""
    echo "访问应用:"
    echo "  前端: http://localhost:8080"
    echo "  后端 API: http://localhost:3001"
else
    echo ""
    echo "❌ 构建失败"
    exit 1
fi

