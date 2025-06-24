PACKAGE_NAME=htzone-sorting-extension
FILES=main.js, manifest.json, icons, index.html, popup.js

build:
	powershell -Command "Compress-Archive -Path $(FILES) -DestinationPath $(PACKAGE_NAME).zip -Force"

.PHONY: build 