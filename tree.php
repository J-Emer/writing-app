<?php
$rootDir = __DIR__; // Change to project root if needed

// ----------------- Exclusion arrays -----------------
$excludeDirArray  = ['node_modules', '.git', 'vendor'];
$excludeFileArray = ['tree.php', 'notes.md'];

// ----------------- Scan function -----------------
function scanDirTree($dir, $prefix = '', $isLast = true) {
    global $excludeDirArray, $excludeFileArray;

    $items = array_diff(scandir($dir), ['.', '..']);
    $items = array_values($items); // reindex

    $total = count($items);
    foreach ($items as $index => $item) {
        $path = $dir . DIRECTORY_SEPARATOR . $item;

        // Skip excluded dirs/files
        if (is_dir($path) && in_array($item, $excludeDirArray)) continue;
        if (is_file($path) && in_array($item, $excludeFileArray)) continue;

        // Determine tree prefix
        $connector = ($index === $total - 1) ? '└── ' : '├── ';
        echo $prefix . $connector . $item . PHP_EOL;

        // Recurse into subdirectories
        if (is_dir($path)) {
            $newPrefix = $prefix . (($index === $total - 1) ? '    ' : '│   ');
            scanDirTree($path, $newPrefix);
        }
    }
}

// ----------------- Execute -----------------
echo $rootDir . PHP_EOL;
scanDirTree($rootDir);
