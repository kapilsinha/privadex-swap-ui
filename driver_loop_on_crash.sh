#!/usr/bin/env bash

while true; do
    echo "$(date +%Y-%m-%d_%H:%M:%S) Started..."
    node drive_privadex_phat_contract.js >> privadex_driver.out 2>&1
    echo "$(date +%Y-%m-%d_%H:%M:%S) CRASHED. Will restart"
    sleep 4
done

