# WonderFut 字典远程更新方案

## 目标
- 不再每次更新翻译词典时都重新发布扩展。
- 词典文件托管在国内可匿名访问的地址，保证 Futbin 用户在国内访问稳定。
- 非技术同伴可以通过 Gitee 网页直接维护词典内容。

## 总体思路
1. 在 Gitee 创建公开仓库（示例：`wonderfut/wonderfut-dict`），把所有翻译 JSON 上传到仓库根目录。
2. 在浏览器扩展中增加远程拉取逻辑：先尝试访问 Gitee 原始文件，成功则缓存一天；失败时回退到扩展内置的 JSON。
3. 非技术同伴只需要在 Gitee 网页上编辑 JSON 并提交即可，无需命令行。

## 需要修改的代码
1. **manifest 配置**  
   ```json
   {
     "host_permissions": [
       "https://gitee.com/*"
     ]
   }
   ```
   如果将来换到 OSS / COS，按域名调整。

2. **`src/content/dictionaryLoader.js`**  
   - 每个字典（basicInfo / sixStat / roles / squad / chemistry / playstyles）都改成：
     1. 先读取 `chrome.storage.local` 缓存（缓存有效期 24 小时）。
     2. 超时后尝试 `fetch` Gitee Raw URL（例如 `https://gitee.com/wonderfut/wonderfut-dict/raw/master/futbinBasicInfoFromExcel.json`）。
     3. 失败时回退 `chrome.runtime.getURL('data/xxx.json')`。
     4. 远程结果写回缓存并存入内存字段。

   - 推荐封装一个 `loadDictWithCache(options)`，避免每个字典重复逻辑。

## Gitee 仓库准备步骤
1. 创建公开仓库（不要勾选“初始化 README”也无所谓）。
2. 上传当前 `wonderfut-translate/data/` 目录下的六个 JSON 文件，可直接在网页端 “上传文件” 或拖放。
3. 记下每个文件的 “原始文件地址”（Raw），例如：  
   `https://gitee.com/<用户名>/wonderfut-dict/raw/master/futbinRolesFromExcel.json`
4. 把这些 URL 写进 `dictionaryLoader.js` 的常量里。

## 非技术同伴的操作流程
1. 打开 Gitee 仓库，找到需要修改的 `*.json` 文件。
2. 点击“编辑”，在网页编辑器中粘贴或修改内容，保持 JSON 格式正确（可以先用在线 JSON 校验器检查）。
3. 编辑完成后填写提交说明（例：“更新 11 月球员俗称”），直接点击“提交”。
4. Commit 立即生效，插件端用户在 24 小时内会自动同步。

> 提示：如果担心直接编辑 JSON 容易出错，可以在仓库里提供一个示例文件或 README，说明字段含义（`professional`、`playerSlang`）和缩进规范。也可以让同伴先在 Excel 表里维护，再由你复制/粘贴到 JSON。

## 可选自动化
- 若未来希望由脚本自动把 Excel → JSON → 推送仓库，可编写一个 Node/Python CLI，结合 Windows 任务计划或 Gitee CI 定时跑。
- 如果字典体量增大，可以考虑引入版本号，URL 后加 `?v=20241128`，强制客户端立即刷新缓存。

## 提交给 AI 开发的说明
- 将本文件发送给负责实现的 AI/开发者，重点是：  
  1. 在 manifest 中声明远程域名。  
  2. 修改 `dictionaryLoader.js`，实现远程拉取 + 缓存 + 失败回退。  
  3. 确认 `chrome.storage.local` 已在 content script 中可用。  
  4. 测试：断网场景仍能回退本地，网络正常时 24 小时内只请求一次 Gitee。
