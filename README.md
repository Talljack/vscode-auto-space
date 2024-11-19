<p align="center">
  <img src="./res/icon.png" width='160px'/>
</p>

<h1 align="center">Auto Add Space between Chinese and English</h1>

<a href="https://marketplace.visualstudio.com/items?itemName=talljack.vscode-auto-space" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/talljack.vscode-auto-space.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

Auto add space between Chinese and English.

![autoAddSpace](https://user-images.githubusercontent.com/34439652/230905590-b70f26dd-8ea8-4d5b-a4ea-b414c259edee.jpg)

## Configuration

| key                          | default-value | type               | description                                  |
| ---------------------------- | ------------- | ------------------ | -------------------------------------------- |
| autoAddSpace.formatOnSave    | true          | boolean            | Execute auto add space when on file save     |
| autoAddSpace.formatOnDocument | false         | boolean            | Execute add space on Format Document command |
| autoAddSpace.spaceType       | 'all'         | 'all' \| 'comment' | Auto Add Space's type                        |
| autoAddSpace.excludedExtensions | []           | string[]           | List of file extensions to exclude from processing (e.g., ['txt', 'md']). Do not include the dot in the extension. |

### Excluding Files

You can exclude specific file types from being processed by adding their extensions to the `autoAddSpace.excludedExtensions` setting. For example:

```json
{
  "autoAddSpace.excludedExtensions": ["txt", "md"]
}
```

This will prevent the extension from modifying files with `.txt` and `.md` extensions, preserving their original content.

## CHALNGELOG

更多的更新日志请查看 [CHANGELOG](./CHANGELOG.md)

## License

[MIT](./LICENSE) License  2023 [Talljack](https://github.com/talljack)
