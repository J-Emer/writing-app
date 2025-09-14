<?php
$rootDir = __DIR__; // Change to the path of your project root if needed

function scanDirTree($dir, $prefix = '') {
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..' || $item === 'node_modules' || $item === ".git") {
            continue;
        }
        $path = $dir . DIRECTORY_SEPARATOR . $item;
        echo $prefix . $item . PHP_EOL;
        if (is_dir($path)) {
            scanDirTree($path, $prefix . '  '); // indent subfolders
        }
    }
}

scanDirTree($rootDir);
