Get-ChildItem -Path "c:\Healthcare-CRM\frontend\src\app\departments\services" -Filter "*.tsx" -Recurse |
ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "http://localhost:5000") {
        if ($content -notmatch "const API_URL") {
            $content = $content -replace "^('use client';)", "`$1`n`nconst API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';"
        }
        $content = $content -replace "fetch\('http://localhost:5000/api", "fetch(\`\${API_URL}"
        $content = $content -replace 'fetch\("http://localhost:5000/api', 'fetch(`${API_URL}'
        $content = $content -replace "fetch\(\`http://localhost:5000/api", "fetch(\`\${API_URL}"
        $content = $content -replace "(\`\$\{API_URL\}[^`]*?)'", "`1`""
        Set-Content $_.FullName -Value $content
        Write-Host "Fixed: $($_.FullName)"
    }
}

Get-ChildItem -Path "c:\Healthcare-CRM\frontend\src\app\inventory" -Filter "*.tsx" -Recurse |
ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "http://localhost:5000") {
        if ($content -notmatch "const API_URL") {
            $content = $content -replace "^('use client';)", "`$1`n`nconst API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';"
        }
        $content = $content -replace "fetch\('http://localhost:5000/api", "fetch(\`\${API_URL}"
        $content = $content -replace 'fetch\("http://localhost:5000/api', 'fetch(`${API_URL}'
        $content = $content -replace "fetch\(\`http://localhost:5000/api", "fetch(\`\${API_URL}"
        Set-Content $_.FullName -Value $content
        Write-Host "Fixed: $($_.FullName)"
    }
}

Get-ChildItem -Path "c:\Healthcare-CRM\frontend\src\app\room-allotment" -Filter "*.tsx" -Recurse |
ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "http://localhost:5000") {
        if ($content -notmatch "const API_URL") {
            $content = $content -replace "^('use client';)", "`$1`n`nconst API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';"
        }
        $content = $content -replace "fetch\('http://localhost:5000/api", "fetch(\`\${API_URL}"
        $content = $content -replace 'fetch\("http://localhost:5000/api', 'fetch(`${API_URL}'
        $content = $content -replace "fetch\(\`http://localhost:5000/api", "fetch(\`\${API_URL}"
        Set-Content $_.FullName -Value $content
        Write-Host "Fixed: $($_.FullName)"
    }
}

Write-Host "✅ Batch fix complete!"
