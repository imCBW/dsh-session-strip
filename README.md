# dsh-session-strip

A compact **session strip** docked above the message composer in DeepSeek Harness (DSH) Web: it shows the current session's live state, and keeps an eye on the other sessions that need you — without leaving the conversation.

把一条「会话概览条」停靠在消息输入框上方：随时看到当前会话的状态，以及其它需要你处理的会话，不用离开对话。

## Features · 功能

- **Current session**: status (running / sub-agents running / waiting for you / idle), title, workspace, turns · steps, context usage. 当前会话状态、标题、工作目录、轮次/步数、上下文占用。
- **One clickable box**: click anywhere to expand or collapse; the usage line under it shows total tokens, cache hit rate, model and tool time. 整块可点折叠/展开，下方一行显示 token 总量、缓存命中、模型/工具耗时。
- **Sub-agents in place**: the current session's own sub-agents appear inside the box (click to jump); they never pollute "Other sessions". 当前会话的子代理显示在条内，点击直接跳转，不会混入「其他会话」。
- **Other sessions**: only sessions that need attention (awaiting a decision, new result, running, or marked unfinished), with sub-agents nested as second-level rows under their parent. 「其他会话」只列需要关注的会话，子代理按二级缩进挂在父会话下。
- **Unfinished marks**: right-click a session row (or the strip itself, or a sidebar row) to toggle an unfinished flag; the flag also shows in the left sidebar. 右键标记未完成，左侧会话条同步显示小旗。
- **Options**: show session id / parent id (hidden by default). 可在插件设置里显示会话 ID / 父会话 ID（默认隐藏）。

## Install · 安装

From the DSH plugin market: search **Session Strip**, or install the package into your profile:

```
dsh plugin install dsh-session-strip
```

The plugin is client-only (`conversation.input.dock`, order 5); it needs no host configuration beyond the optional `showSessionId` switch.

## Requirements · 依赖

- DeepSeek Harness with a Web client (desktop app or `dsh web`).
- No build step, no runtime dependencies.

## License

MIT
