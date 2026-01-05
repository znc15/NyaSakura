#!/bin/sh
set -eu

APP_NAME="nyasakura"
NEXT_PORT_DEFAULT="3001"

say() { printf '%s\n' "$*"; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
need_cmd() { command -v "$1" >/dev/null 2>&1; }

as_root() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif need_cmd sudo; then
    sudo "$@"
  else
    die "需要 root 权限执行：$*（请用 root 运行脚本或安装 sudo）"
  fi
}

remove_nginx_conf() {
  conf_path="/etc/nginx/conf.d/${APP_NAME}.conf"
  if [ -f "$conf_path" ]; then
    say "移除 nginx 配置：$conf_path"
    as_root rm -f "$conf_path"
  else
    say "未找到 nginx 配置：$conf_path（跳过）"
  fi

  if need_cmd nginx; then
    if as_root nginx -t; then
      if need_cmd systemctl; then
        as_root systemctl restart nginx || true
      else
        as_root nginx -s reload || true
      fi
      say "nginx 已重载"
    else
      say "nginx -t 失败，未自动重载（请手动检查 nginx 配置）"
    fi
  else
    say "未安装 nginx（跳过重载）"
  fi
}

remove_systemd_service() {
  service_path="/etc/systemd/system/${APP_NAME}.service"

  if ! need_cmd systemctl; then
    say "未检测到 systemd（systemctl 不存在），跳过服务卸载"
    return
  fi

  if systemctl list-unit-files | grep -q "^${APP_NAME}\.service"; then
    say "停止并禁用服务：${APP_NAME}.service"
    as_root systemctl stop "${APP_NAME}.service" || true
    as_root systemctl disable "${APP_NAME}.service" || true
  else
    say "未注册 ${APP_NAME}.service（跳过 stop/disable）"
  fi

  if [ -f "$service_path" ]; then
    say "删除 unit 文件：$service_path"
    as_root rm -f "$service_path"
  else
    say "未找到 unit 文件：$service_path（跳过）"
  fi

  as_root systemctl daemon-reload
  say "systemd 已 reload"
}

maybe_remove_source() {
  REMOVE_SOURCE=${REMOVE_SOURCE:-0}
  INSTALL_DIR=${INSTALL_DIR:-}

  if [ "$REMOVE_SOURCE" -eq 0 ]; then
    return
  fi

  [ -n "$INSTALL_DIR" ] || die "要删除源码请提供 INSTALL_DIR（或 --dir <path>）"

  if [ -d "$INSTALL_DIR" ]; then
    say "删除源码目录：$INSTALL_DIR"
    as_root rm -rf "$INSTALL_DIR"
  else
    say "源码目录不存在：$INSTALL_DIR（跳过）"
  fi
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --remove-source)
        REMOVE_SOURCE=1
        ;;
      --dir)
        shift
        [ "$#" -gt 0 ] || die "--dir 需要一个目录路径"
        INSTALL_DIR="$1"
        ;;
      -h|--help)
        say "用法："
        say "  ./uninstall.sh                      # 移除 systemd 服务与 nginx 配置"
        say "  ./uninstall.sh --remove-source --dir /opt/nyasakura"
        say "环境变量：REMOVE_SOURCE=1, INSTALL_DIR"
        exit 0
        ;;
      *)
        die "未知参数：$1（使用 --help 查看用法）"
        ;;
    esac
    shift
  done
}

main() {
  parse_args "$@"
  remove_systemd_service
  remove_nginx_conf
  maybe_remove_source

  say "完成。"
  say "如需确认端口占用（默认 ${NEXT_PORT_DEFAULT}）：使用 ss/netstat 查看。"
}

main "$@"
