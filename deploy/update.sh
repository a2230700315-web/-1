#!/usr/bin/env bash
# 更新已部署的网站：bash /opt/socialwork/deploy/update.sh
set -euo pipefail
cd /opt/socialwork
git pull --ff-only
npm ci
npm run build
systemctl restart socialwork
systemctl status socialwork --no-pager | head -5
