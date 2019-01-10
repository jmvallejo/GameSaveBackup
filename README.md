# GameSaveBackup
A small customizable utility for backing up game saves

## Why?
* Many PC games don't have cloud saves even on steam.
* If you play on different computers it's likely that you have faced the issue of backing up / transferring save games.
* Some games have cloud saves in Windows and Mac, but saves are handled separately.
* Works for emulators.

This tool is aimed at making the process a bit easier. A normal use case would be to set up a backup folder in Dropbox, OneDrive or any other service which you can copy files to. You'll be able to monitor both the save folder and backup folder for changes and copy files where needed. If trying to overwrite a more recent file you will be prompted first, files are always compared based on their modification date.

## Usage
Simply install and run. You'll get a tray icon with different options. Select "Show config file" and edit it with your editor of choice.

```javascript
{
  "games": {
    "SampleGameTitle": {
      "ignore": true,
      "watch": false,
      "fileList": [
        {
          "sourcePath": "C:\\path\\to\\your\\save\\folder",
          "destPath": "C:\\path\\to\\your\\backup\\folder",
          "files": [
            "*"
          ]
        }
      ]
    }
  }
}
```
Add more games by replicating "SampleGameTitle" with your desired game.

Ignore the game entry:
```
ignore: true | false
```

Setup watch, this will monitor both backup and save folders for changes:
```
watch: true | false
```

Define the folders and files:
```
fileList: Array
```
### Each element should have
```
sourcePath: String - game save folder
destPath: String - backup folder
files: Array - an array of patterns
```

Pattern examples:
```
"*" -> All files
"!*.xml" -> Ignore .xml files
```
You can use any console pattern (not regex)

## Future plans
* Adding a user interface for managing games.
* Including game templates.
* Connecting to different storage services for backing up files.

## Contributing
* Feel free to create a PR and let me know what it is about...
