$mediaDir = "c:\Users\henry\OneDrive\Documents\GitHub\hankfoot.github.io\public\media"

$downloads = @(
  @{ name = "ARISE Hero"; url = "https://images.squarespace-cdn.com/content/v1/5ea9e5d68ae3d768c0fffe00/1621697868289-6G87WVEXQQRGUM539PJL/Slide+16_9+-+2.png"; file = "$mediaDir\projects\arise\hero.png" },
  @{ name = "Use Your Melon Hero"; url = "https://images.squarespace-cdn.com/content/v1/5ea9e5d68ae3d768c0fffe00/1592678630734-5LN4GKMTAGU5N8JDFPT7/elliot.png"; file = "$mediaDir\projects\use-your-melon\hero.png" },
  @{ name = "Safecracker Hero"; url = "https://images.squarespace-cdn.com/content/v1/5ea9e5d68ae3d768c0fffe00/1592161682646-ZV3NA1VW42NTQ1FU3T5R/Safe2Edits-10%2Bcopy.jpg"; file = "$mediaDir\projects\safecracker\hero.jpg" },
  @{ name = "Depth Charge Hero"; url = "https://images.squarespace-cdn.com/content/v1/5ea9e5d68ae3d768c0fffe00/1623284481258-1H71F3A0KHBF108PHWH4/7EFFB8D3-ED88-471A-980E-B738D5D8AEAA.jpeg"; file = "$mediaDir\projects\depth-charge\hero.jpeg" },
  @{ name = "Home Hero"; url = "https://images.squarespace-cdn.com/content/v1/5ea9e5d68ae3d768c0fffe00/1620353325167-ZLN3DEBWQYR3MYA020LD/89DCAE02-8624-447B-A5B4-DCC54BCDEF15.png"; file = "$mediaDir\home\hero.png" }
)

$successCount = 0
$failCount = 0

Write-Host "Downloading media files..."
foreach ($item in $downloads) {
  Write-Host $item.name -ForegroundColor Cyan
  try {
    Invoke-WebRequest -Uri $item.url -OutFile $item.file -ErrorAction Stop -TimeoutSec 30
    if (Test-Path $item.file) {
      $size = (Get-Item $item.file).Length / 1KB
      Write-Host "  Downloaded: $([int]$size) KB" -ForegroundColor Green
      $successCount++
    }
  } catch {
    Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
  }
  Start-Sleep -Milliseconds 300
}

Write-Host "`nComplete - Success: $successCount, Failed: $failCount"
