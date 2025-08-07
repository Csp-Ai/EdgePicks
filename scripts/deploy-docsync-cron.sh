#!/usr/bin/env bash
# Deploy a cron job that runs the docsync agent every 12 hours
set -e
SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
PROJECT_ROOT="$SCRIPT_DIR/.."
CMD="cd $PROJECT_ROOT && npx ts-node scripts/docsync-agent.ts >> docsync.log 2>&1"
SCHEDULE="0 */12 * * *"
( crontab -l 2>/dev/null | grep -v 'docsync-agent'; echo "$SCHEDULE $CMD # docsync-agent" ) | crontab -
echo "Cron job installed: $SCHEDULE $CMD"
