param (
    [string]$PackageName,
    [string]$DistDir,
    [string]$ReleasesDir,
    [string]$UnpackedDir
)

# --- Ensure output directories exist ---
if (-not (Test-Path $ReleasesDir)) {
    New-Item -ItemType Directory -Path $ReleasesDir *>$null
}
if (-not (Test-Path $UnpackedDir)) {
    New-Item -ItemType Directory -Path $UnpackedDir *>$null
}

# --- Resolve full paths ---
$releasesFullPath = (Resolve-Path $ReleasesDir).Path
$distFullPath = (Resolve-Path $DistDir).Path
$unpackedFullPath = (Resolve-Path $UnpackedDir).Path

# --- Create a unique file name ---
$date = Get-Date -Format 'yyyyMMdd'
$buildNum = @(Get-ChildItem -Path $releasesFullPath -Filter ($PackageName + '-' + $date + '-*.zip')).Count + 1
$fileName = "$($PackageName)-$($date)-$($buildNum).zip"
$zipPath = Join-Path -Path $releasesFullPath -ChildPath $fileName

# --- Navigate into the build dir and create the archive from there ---
Set-Location $distFullPath
Compress-Archive -Path * -DestinationPath $zipPath -Force
Write-Output "[SUCCESS] Created new release: $($zipPath)"

# --- Create the unpacked version for development ---
if (Test-Path $unpackedFullPath) {
    Remove-Item -Recurse -Force -Path $unpackedFullPath
}
New-Item -ItemType Directory -Path $unpackedFullPath
Expand-Archive -Path $zipPath -DestinationPath $unpackedFullPath
Write-Output "[SUCCESS] Created unpacked version for testing at: $($unpackedFullPath)" 