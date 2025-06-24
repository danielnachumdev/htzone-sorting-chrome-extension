PACKAGE_NAME=htzone-sorting-extension
FILES=main.js,manifest.json

build:
	powershell -Command "Compress-Archive -Path $(FILES) -DestinationPath $(PACKAGE_NAME).zip -Force"

.PHONY: build 