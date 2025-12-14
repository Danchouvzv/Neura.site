#!/bin/bash
cd /Users/danialtalgatov/Downloads/neura-map-2
for file in /Users/danialtalgatov/Downloads/logo/*.jpg; do
  cp "$file" logos/
done
ls logos/*.jpg | wc -l

