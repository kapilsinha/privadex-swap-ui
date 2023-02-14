#!/usr/bin/env bash

yarn build && firebase deploy --only hosting
