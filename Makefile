PACKAGE_NAME=htzone-sorting-extension
FILES=main.js, manifest.json, icons, index.html, popup.js
OUTPUT_DIR=dist

build:
	powershell -Command " \
		if (-not (Test-Path -Path '$(OUTPUT_DIR)')) { New-Item -ItemType Directory -Path '$(OUTPUT_DIR)' }; \
		$$date = Get-Date -Format 'yyyyMMdd'; \
		$$buildNum = @(Get-ChildItem -Path '$(OUTPUT_DIR)' -Filter ('$(PACKAGE_NAME)-' + $$date + '-*.zip')).Count + 1; \
		$$fileName = ('$(PACKAGE_NAME)-' + $$date + '-' + $$buildNum + '.zip'); \
		$$destination = Join-Path -Path '$(OUTPUT_DIR)' -ChildPath $$fileName; \
		Compress-Archive -Path $(FILES) -DestinationPath $$destination -Force; \
		Write-Output ('Created build: ' + $$destination) \
	"

.PHONY: build 