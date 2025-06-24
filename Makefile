.SILENT:

PACKAGE_NAME=htzone-sorting-extension
OUTPUT_DIR=dist
RELEASES_DIR=releases
UNPACKED_DIR=unpacked

# Directories containing static assets to copy (will exclude .ts files)
STATIC_DIRS=icons popup

# Static files in the root to copy
STATIC_ROOT_FILES=manifest.json LICENSE privacy-policy.md

.PHONY: all build clean

all: build

build: clean
	@echo "[+] Compiling TypeScript..."
	npm run build --silent
	@echo "[+] Copying static assets to $(OUTPUT_DIR)..."
	powershell -Command " \
		'$(STATIC_ROOT_FILES)'.Split(' ') | ForEach-Object { if (Test-Path $$_) {Copy-Item -Path $$_ -Destination '$(OUTPUT_DIR)' -Force} }; \
		'$(STATIC_DIRS)'.Split(' ') | ForEach-Object { if (Test-Path $$_) {Copy-Item -Path $$_ -Destination '$(OUTPUT_DIR)' -Recurse -Force -Exclude *.ts} }; \
	"
	@echo "[*] Creating release package..."
	powershell -ExecutionPolicy Bypass -File scripts/create-release.ps1 -PackageName $(PACKAGE_NAME) -DistDir $(OUTPUT_DIR) -ReleasesDir $(RELEASES_DIR) -UnpackedDir $(UNPACKED_DIR)

clean:
	@echo "[-] Cleaning up build directories..."
	powershell -Command "if (Test-Path -Path '$(OUTPUT_DIR)') { Remove-Item -Recurse -Force -Path '$(OUTPUT_DIR)' }"
	powershell -Command "if (Test-Path -Path '$(UNPACKED_DIR)') { Remove-Item -Recurse -Force -Path '$(UNPACKED_DIR)' }" 