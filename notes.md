## Core Functions

[x]1. The app needs a specific place it stores and loads all files from (like most other apps do)
[x]2. Electron app has a horizontal & vertical scroll bar. The textarea also has a scroll bar. The app scrollbars hide the
       textarea scroll bars. Lets remove the "app" scroll bars
[x]3. Word count. At the bottom of the app is a grey bar (it says "loaded: The Sanctuary.txt" right now) lets add a word cound to that bar.
[x]4. (Open Project, New File, Save File, Delete File) buttons should be moved to the main menu (the one at the top of the app)
[x]5. Remove the old buttons (Open Project, New File, Save File, Delete File)
[x]6. Make a "New Project" button -> this will create a new folder/directory inside of our "working/app" directory. Then the app will jump into that directory/project.
[/]7. Spell checker -> works, notices misspelled words. Need to add some sort of "suggestion box"
[x]8. Bottom of app (bottom data bar area?) we should tell the user when autosaving is happening. Say something like "Auto saving file: test.txt", after save then say "Saved: test.txt"
    ("test.txt" is the name of whatever file the user has selected)
[x]9. Bottom of app (bottom data bar area?) we also need to add the word count for this file.
[x]10. App to start in full screen mode instead of minimized (small screen?)
[x]11. Add more padding to "side-bar toggle button" when it is in the closed position (padding left)
[x]12. Sidebar should NOT be able to be dragged (manually expanded) while it is in the "toggle/hide" position
[x]13. WYSIWYG editor -> use a free/open source one. No register keys or anything like that. Also no cdn.
[]14. Themes -> the current workaround (multiple .css files) isn't cutting it.
[]15. Settings -> save directory (main directory)
    will need a new .html page for this?
[]16. breaking up ui.js -> it is bloated and hard to read/understand
[]17. dev-mode vs production-mode -> mainley shows the devTools.

## Errors

## Issues

[x] Open Project button (menu item) opens the ~/MyWrittingApp directory, and retrieves the .txt files in that directory.
    Instead it should show a dialog, and let the user select which sub-directry (projects) they want to open. Then grab the .txt files.
[x] Spell checker works (red squigly underline), but how about adding in a word suggestion box? -> fixed

## UI Improvments

[]1. UI sucks, make it look better
    [x] sidebar needs to be able to be hidden -> also needs to be able to adjust width (think VS codes explorer)
    [x] main menu (top) -> background color needs to be the same color as the apps background.
    [x] editor (textarea) border color turns orange when focused. change it to a better color that reflects our ui style/color choices
[x]2. Theme support:
    [x] add a darktheme.css file and use that for now -> KISS rule
[]3. Update app icon
[x]4. File dropdown (main menu) needs to be wider...it looks funny being that narrow. lets widen it by 15% or equivelent
[x]5. "currentProject" & "currentFile" (index.html) currently shows the full path of the project & text file -> lets move "currentProject"
        to the "sideBar" (above the fileList & below the  toggleButton).
        [x] Lets only show the directory name (project name), and name of the file (without extension)
