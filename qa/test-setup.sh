#!/bin/bash

# ZANYSURF Testing & Deployment Setup Script
# This script validates the environment and prepares for testing

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  ZANYSURF Testing & Deployment Setup                          ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print status
print_status() {
  local status=$1
  local message=$2

  if [ "$status" == "PASS" ]; then
    echo -e "${GREEN}✓${NC} $message"
  elif [ "$status" == "FAIL" ]; then
    echo -e "${RED}✗${NC} $message"
  elif [ "$status" == "WARN" ]; then
    echo -e "${YELLOW}⚠${NC} $message"
  else
    echo -e "${BLUE}→${NC} $message"
  fi
}

# 1. Check Node.js
echo -e "${BLUE}Checking dependencies...${NC}"
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  print_status "PASS" "Node.js installed: $NODE_VERSION"
else
  print_status "FAIL" "Node.js not found. Install from https://nodejs.org/"
  exit 1
fi

# 2. Check npm
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  print_status "PASS" "npm installed: $NPM_VERSION"
else
  print_status "FAIL" "npm not found"
  exit 1
fi

# 3. Check OLLAMA
echo ""
echo -e "${BLUE}Checking OLLAMA installation...${NC}"
if command -v ollama &> /dev/null; then
  OLLAMA_VERSION=$(ollama --version)
  print_status "PASS" "OLLAMA installed: $OLLAMA_VERSION"
else
  print_status "FAIL" "OLLAMA not installed"
  echo -e "${YELLOW}Install OLLAMA from https://ollama.com${NC}"
  exit 1
fi

# 4. Check if OLLAMA service is running
echo ""
echo -e "${BLUE}Checking OLLAMA service...${NC}"
if timeout 2 bash -c 'echo > /dev/tcp/127.0.0.1/11434' 2>/dev/null; then
  print_status "PASS" "OLLAMA service is running on localhost:11434"
else
  print_status "WARN" "OLLAMA service not running. Start with: ollama serve"
  OLLAMA_RUNNING=0
fi

# 5. Check available models
echo ""
echo -e "${BLUE}Checking available OLLAMA models...${NC}"
if [ "${OLLAMA_RUNNING}" != "0" ]; then
  MODELS=$(curl -s http://localhost:11434/api/tags 2>/dev/null | grep -o '"name":"[^"]*"' | sed 's/"name":"//' | sed 's/"//' | head -10)

  if [ -z "$MODELS" ]; then
    print_status "WARN" "No OLLAMA models found"
    echo ""
    echo -e "${YELLOW}Pull a model to continue:${NC}"
    echo "  ollama pull llama3.2:1b     # Fast, lightweight (recommended)"
    echo "  ollama pull mistral         # Balanced"
    echo "  ollama pull llama3          # Full size"
  else
    COUNT=$(echo "$MODELS" | wc -l)
    print_status "PASS" "Found $COUNT model(s):"
    echo "$MODELS" | while read model; do
      echo "      - $model"
    done
  fi
else
  print_status "WARN" "Cannot check models (OLLAMA not running)"
fi

# 6. Check Chrome/Chromium
echo ""
echo -e "${BLUE}Checking Chrome browser...${NC}"
CHROME_PATHS=(
  "/usr/bin/google-chrome"
  "/usr/bin/chromium-browser"
  "/usr/bin/chromium"
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
)

CHROME_FOUND=0
for path in "${CHROME_PATHS[@]}"; do
  if [ -f "$path" ] 2>/dev/null; then
    print_status "PASS" "Chrome found at: $path"
    CHROME_FOUND=1
    break
  fi
done

if [ "$CHROME_FOUND" == "0" ]; then
  print_status "FAIL" "Chrome not found. Install from https://www.google.com/chrome/"
  exit 1
fi

# 7. Check project structure
echo ""
echo -e "${BLUE}Checking project structure...${NC}"
PROJECT_ROOT=$(pwd)

for dir in "extension" "src" "qa" "docs"; do
  if [ -d "$PROJECT_ROOT/$dir" ]; then
    print_status "PASS" "Directory: $dir"
  else
    print_status "FAIL" "Missing directory: $dir"
    exit 1
  fi
done

# 8. Check key files
echo ""
echo -e "${BLUE}Checking key files...${NC}"
KEY_FILES=(
  "extension/manifest.json"
  "extension/background.js"
  "extension/popup.js"
  "extension/content.js"
  "src/agent/gateway.js"
  "qa/zanysurf.test.js"
)

for file in "${KEY_FILES[@]}"; do
  if [ -f "$PROJECT_ROOT/$file" ]; then
    print_status "PASS" "File: $file"
  else
    print_status "FAIL" "Missing file: $file"
  fi
done

# 9. Test manifest validity
echo ""
echo -e "${BLUE}Validating manifest.json...${NC}"
if command -v jq &> /dev/null; then
  if jq empty < "$PROJECT_ROOT/extension/manifest.json" 2>/dev/null; then
    MANIFEST_VERSION=$(jq '.manifest_version' < "$PROJECT_ROOT/extension/manifest.json")
    print_status "PASS" "manifest.json is valid (v$MANIFEST_VERSION)"
  else
    print_status "FAIL" "manifest.json is invalid JSON"
  fi
else
  print_status "WARN" "jq not installed, skipping manifest validation"
fi

# 10. Summary and next steps
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Setup Summary                                                ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}✓ System ready for testing!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. ${YELLOW}Start OLLAMA service:${NC}"
echo "   ollama serve"
echo ""
echo "2. ${YELLOW}Pull a model (if not already done):${NC}"
echo "   ollama pull llama3.2:1b"
echo ""
echo "3. ${YELLOW}Load extension in Chrome:${NC}"
echo "   - Open chrome://extensions/"
echo "   - Enable Developer mode"
echo "   - Click Load unpacked"
echo "   - Select: $PROJECT_ROOT/extension"
echo ""
echo "4. ${YELLOW}Run automated tests:${NC}"
echo "   node qa/test-integration.js"
echo ""
echo "5. ${YELLOW}Manual testing checklist:${NC}"
echo "   See: DEPLOYMENT.md and qa/test-features.md"
echo ""
echo "6. ${YELLOW}Run unit tests:${NC}"
echo "   npm test"
echo ""

echo -e "${CYAN}For more information, see:${NC}"
echo "  - DEPLOYMENT.md (setup & deployment guide)"
echo "  - qa/test-features.md (feature testing checklist)"
echo "  - README.md (project overview)"
echo ""
