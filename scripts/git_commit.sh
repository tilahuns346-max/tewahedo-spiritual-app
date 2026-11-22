#!/usr/bin/env bash
set -e

MSG="$1"
if [ -z "$MSG" ]; then
  echo "Error: commit message required"
  exit 1
fi

cd /home/solomon/Desktop/tewahedo-spiritual-app
git add -A
git commit -m "$MSG"
git push origin main
echo "Successfully committed and pushed: $MSG"
