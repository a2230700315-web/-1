#!/usr/bin/env bash
# Ubuntu 24.04 一键部署：Node 24 + Caddy(自动 HTTPS) + systemd。需用 root 运行。
# 用法：bash deploy/setup.sh ethics.a1sc.cn https://github.com/a2230700315-web/-1.git
set -euo pipefail
DOMAIN="${1:?用法: setup.sh <域名> <git仓库地址>}"
REPO="${2:?用法: setup.sh <域名> <git仓库地址>}"
APP=/opt/socialwork

# 1) 2GB 内存构建 Next.js 较紧，加 2GB swap
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# 2) Node 24 与 Caddy
apt-get update -y && apt-get install -y curl git ca-certificates gnupg debian-keyring debian-archive-keyring apt-transport-https
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt-get update -y && apt-get install -y caddy

# 3) 拉代码并构建
if [ -d "$APP/.git" ]; then git -C "$APP" pull --ff-only; else git clone "$REPO" "$APP"; fi
cd "$APP"
npm ci
npm run build
mkdir -p /var/lib/socialwork

# 4) 密钥文件（不存在才创建；之后手动编辑填入）
if [ ! -f /etc/socialwork.env ]; then
  cat > /etc/socialwork.env <<'ENVEOF'
ARK_API_KEY=
ARK_MODEL=
SQLITE_PATH=/var/lib/socialwork/app.db
NODE_ENV=production
ENVEOF
  chmod 600 /etc/socialwork.env
  echo ">>> 请编辑 /etc/socialwork.env 填入 ARK_API_KEY 与 ARK_MODEL，然后 systemctl restart socialwork"
fi

# 5) systemd 服务
cat > /etc/systemd/system/socialwork.service <<UNIT
[Unit]
Description=Social Work AI Lab
After=network.target
[Service]
WorkingDirectory=$APP
EnvironmentFile=/etc/socialwork.env
ExecStart=/usr/bin/npx next start -p 3000 -H 127.0.0.1
Restart=always
User=root
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload && systemctl enable --now socialwork && systemctl restart socialwork

# 6) Caddy 反向代理 + 自动 HTTPS
cat > /etc/caddy/Caddyfile <<CADDY
$DOMAIN {
  encode gzip
  reverse_proxy 127.0.0.1:3000
}
CADDY
systemctl restart caddy
echo "完成。检查：systemctl status socialwork caddy"
