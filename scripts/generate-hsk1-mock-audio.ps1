param(
  [string]$TestId = "HSK1-mock-01",
  [double]$Rate = -4
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$jsonPath = Join-Path $root "source\data-model\mock-tests\$TestId.json"
$outDir = Join-Path $root "source\data-model\mock-tests\audio"

if (!(Test-Path $jsonPath)) {
  throw "Mock test JSON not found: $jsonPath"
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Add-Type -AssemblyName System.Speech

$test = Get-Content -Raw -Encoding UTF8 $jsonPath | ConvertFrom-Json
$items = @()
foreach ($section in $test.sections) {
  foreach ($item in $section.items) {
    $items += $item
  }
}

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice = $synth.GetInstalledVoices() |
  ForEach-Object { $_.VoiceInfo } |
  Where-Object { $_.Culture.Name -eq "zh-CN" } |
  Select-Object -First 1

if ($voice) {
  $synth.SelectVoice($voice.Name)
}
$synth.Rate = [int]$Rate
$synth.Volume = 100

foreach ($part in $test.audioParts) {
  $partItems = $items | Where-Object { $_.part -eq $part.part } | Sort-Object number
  if (!$partItems.Count) { continue }

  $outPath = Join-Path $root ($part.file -replace "^\.\./", "source/")
  New-Item -ItemType Directory -Force -Path (Split-Path $outPath) | Out-Null

  $script = New-Object System.Text.StringBuilder
  [void]$script.AppendLine(("Part {0}" -f (($part.itemNumbers[0] - 1) / 5 + 1)))
  [void]$script.AppendLine("")
  foreach ($item in $partItems) {
    [void]$script.AppendLine(("{0} {1} {2}{3}" -f ([char]0x7B2C), $item.number, ([char]0x9898), ([char]0x3002)))
    [void]$script.AppendLine($item.audioText)
    [void]$script.AppendLine("")
  }

  $synth.SetOutputToWaveFile($outPath)
  $synth.Speak($script.ToString())
  $synth.SetOutputToNull()
  Write-Host "Wrote $outPath"
}
