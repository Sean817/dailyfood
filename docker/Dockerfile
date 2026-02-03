# ============================================
# 前端构建阶段
# ============================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端 package 文件
COPY package*.json ./

# 安装前端依赖
RUN npm ci

# 复制前端源代码
COPY src ./src
COPY index.html ./
COPY vite.config.ts tsconfig.json tsconfig.node.json ./
COPY tailwind.config.js postcss.config.js ./

# 构建前端应用
RUN npm run build

# ============================================
# 后端构建阶段
# ============================================
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# 复制后端 package 文件
COPY backend/package*.json ./

# 安装后端依赖（生产环境）
RUN npm ci --only=production

# 复制后端源代码
COPY backend/ ./

# ============================================
# 最终运行阶段
# ============================================
FROM node:18-alpine

WORKDIR /app

# 安装 nginx
RUN apk add --no-cache nginx

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# 从后端构建阶段复制后端代码和依赖
COPY --from=backend-builder /app/backend /app/backend

# 复制 nginx 配置文件
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 安装 supervisor 来管理多个进程
RUN apk add --no-cache supervisor

# 创建 supervisor 配置文件
RUN echo '[supervisord]' > /etc/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisord.conf && \
    echo 'user=root' >> /etc/supervisord.conf && \
    echo '' >> /etc/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/var/log/nginx/error.log' >> /etc/supervisord.conf && \
    echo 'stdout_logfile=/var/log/nginx/access.log' >> /etc/supervisord.conf && \
    echo '' >> /etc/supervisord.conf && \
    echo '[program:backend]' >> /etc/supervisord.conf && \
    echo 'command=node server.js' >> /etc/supervisord.conf && \
    echo 'directory=/app/backend' >> /etc/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/var/log/backend/error.log' >> /etc/supervisord.conf && \
    echo 'stdout_logfile=/var/log/backend/access.log' >> /etc/supervisord.conf && \
    mkdir -p /var/log/backend

# 暴露端口
EXPOSE 80 3001

# 启动服务
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

