window.__ModuleLoader__.load({
  id: 'dsh-session-strip',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useState } = React

    /** Dictionary namespace owned by this plugin. */
    const NS = 'sessionView'
    /** Stable identity of the injected stylesheet. */
    const STYLE_ID = 'dsh-session-strip/session-view.css'

    const zh = {
      'aria.label': '会话概览',
      untitled: '未命名会话',
      'status.running': '运行中',
      'status.waiting': '等待输入',
      'status.error': '出错',
      'status.loading': '载入中',
      'status.blank': '新会话',
      'status.idle': '空闲',
      'status.subagent': '子代理运行中',
      'status.runningSubagents': '运行中 · {count} 个子代理',
      'others.subagents': '{count} 个子代理运行中',
      'meta.activity': '{turns} 轮 · {steps} 步',
      'meta.context': '上下文 {percent}%',
      'action.expand': '展开会话详情',
      'action.collapse': '收起会话详情',
      'detail.id': '会话 ID',
      'detail.workspace': '工作目录',
      'detail.activity': '活动',
      'detail.activity.value': '{turns} 轮 · {steps} 步',
      'detail.context': '上下文占用',
      'detail.context.value': '{used} / {window} tokens（{percent}%）',
      'detail.time': '耗时',
      'detail.time.value': '模型 {model} · 工具 {tools}',
      'detail.updated': '最近更新',
      'detail.parent': '父会话',
      'detail.none': '—',
      'children.title': '子代理',
      'stats.tokens': '{count} tokens',
      'stats.cache': '缓存命中 {percent}%',
      'stats.model': '模型 {time}',
      'stats.tool': '工具 {time}',
      'stats.total': '总 tokens',
      'stats.input': '未缓存输入',
      'stats.cacheRead': '缓存读取',
      'stats.cacheWrite': '缓存写入',
      'stats.output': '输出',
      'others.title': '其他会话',
      'others.running': '{count} 个运行中',
      'others.pending': '{count} 个待处理',
      'others.unread': '{count} 个有新结果',
      'others.more': '还有 {count} 个',
      'others.open': '打开会话：{title}',
      'others.state.pending': '待你处理',
      'others.state.unread': '有新结果',
      'others.subagent': '子代理',
      'others.subagent.parent': '父会话：{title}',
      'mark.pending': '未完成',
      'mark.count': '{count} 个未完成',
      'mark.hint': '右键切换未完成标记',
      'mark.add': '标记为未完成',
      'mark.remove': '取消未完成标记'
    }

    const en = {
      'aria.label': 'Session overview',
      untitled: 'Untitled session',
      'status.running': 'Running',
      'status.waiting': 'Waiting',
      'status.error': 'Error',
      'status.loading': 'Loading',
      'status.blank': 'New session',
      'status.idle': 'Idle',
      'status.subagent': 'Sub-agents running',
      'status.runningSubagents': 'Running · {count} sub-agents',
      'others.subagents': '{count} sub-agents running',
      'meta.activity': '{turns} turns · {steps} steps',
      'meta.context': 'Context {percent}%',
      'action.expand': 'Show session details',
      'action.collapse': 'Hide session details',
      'detail.id': 'Session ID',
      'detail.workspace': 'Working directory',
      'detail.activity': 'Activity',
      'detail.activity.value': '{turns} turns · {steps} steps',
      'detail.context': 'Context usage',
      'detail.context.value': '{used} / {window} tokens ({percent}%)',
      'detail.time': 'Wall time',
      'detail.time.value': 'Model {model} · Tools {tools}',
      'detail.updated': 'Last updated',
      'detail.parent': 'Parent session',
      'detail.none': '—',
      'children.title': 'Sub-agents',
      'stats.tokens': '{count} tokens',
      'stats.cache': 'Cache hit {percent}%',
      'stats.model': 'Model {time}',
      'stats.tool': 'Tools {time}',
      'stats.total': 'Total tokens',
      'stats.input': 'Uncached input',
      'stats.cacheRead': 'Cache read',
      'stats.cacheWrite': 'Cache write',
      'stats.output': 'Output',
      'others.title': 'Other sessions',
      'others.running': '{count} running',
      'others.pending': '{count} awaiting you',
      'others.unread': '{count} with new results',
      'others.more': '{count} more',
      'others.open': 'Open session: {title}',
      'others.state.pending': 'Needs you',
      'others.state.unread': 'New result',
      'others.subagent': 'Sub-agent',
      'others.subagent.parent': 'Parent: {title}',
      'mark.pending': 'Unfinished',
      'mark.count': '{count} unfinished',
      'mark.hint': 'Right-click to toggle unfinished',
      'mark.add': 'Mark as unfinished',
      'mark.remove': 'Unmark unfinished'
    }

    const css = `
.dshsv_dock{box-sizing:border-box;width:calc(100% - var(--dsh-composer-side-clearance,0px) - var(--dsh-composer-side-clearance,0px) - var(--dsh-composer-dock-inset,0px) - var(--dsh-composer-dock-inset,0px) - var(--dsh-composer-dock-inset,0px) - var(--dsh-composer-dock-inset,0px));margin:0 auto}
.dshsv_bar{box-sizing:border-box;width:100%;max-width:calc(var(--dsh-composer-card-max-width,100%) - var(--dsh-composer-dock-inset,0px) * 4);margin:0 auto;border:0;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-1,#1d2125));box-shadow:var(--dsw-elevation-panel,0 2px 10px rgba(0,0,0,.18));backdrop-filter:var(--dsw-menu-backdrop-filter,none);color:var(--dsw-alias-label-primary,#e6e6e6)}
.dshsv_head{box-sizing:border-box;display:block;width:100%;padding:0;border:0;border-radius:var(--dsw-radius-md,8px);background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dshsv_head:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.dshsv_head:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4c9ffe);outline-offset:-2px}
.dshsv_row{display:flex;align-items:center;gap:10px;min-height:36px;padding:4px 6px 4px 12px}
.dshsv_headDetail .dshsv_detailLine{padding:2px 12px 7px;font-size:11px;line-height:16px}
.dshsv_children{display:flex;flex-direction:column;gap:1px;padding:2px 12px 6px}
.dshsv_childrenTitle{font-size:10px;line-height:15px;color:var(--dsw-alias-label-tertiary,#8a8a8a);margin:2px 0 1px}
.dshsv_childRow{display:flex;align-items:center;gap:7px;width:100%;box-sizing:border-box;padding:2px 6px;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;font-size:11px;line-height:16px;text-align:left;cursor:pointer}
.dshsv_childRow:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.08))}
.dshsv_childRow:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4c9ffe);outline-offset:-2px}
.dshsv_childTitle{min-width:0;flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#a9a9a9)}
.dshsv_childState{flex:none;color:var(--dsw-alias-label-tertiary,#8a8a8a);font-size:10px;line-height:15px}
.dshsv_childrenMore{font-size:10px;line-height:15px;color:var(--dsw-alias-label-tertiary,#8a8a8a);padding:1px 6px 0}
.dshsv_stateDot{position:relative;display:inline-block;flex:none;width:10px;height:10px;color:var(--dsw-alias-state-idle-primary,#8a8a8a)}
.dshsv_stateDot:after{content:"";position:absolute;inset:20%;border-radius:50%;corner-shape:round;background:currentColor}
.dshsv_stateDot[data-tone=unread]{color:var(--dsw-alias-state-success-primary,#3fb950)}
.dshsv_stateDot[data-tone=pending]{color:var(--dsw-alias-state-error-primary,#f85149)}
.dshsv_stateDot[data-tone=error]{color:var(--dsw-alias-state-error-primary,#f85149)}
.dshsv_stateDot[data-tone=idle]{color:var(--dsw-alias-state-idle-primary,#8a8a8a)}
.dshsv_spinner{flex:none;color:#4c9ffe}
.dshsv_spinnerSub{color:var(--dsw-alias-label-tertiary,#8a8a8a)}
.dshsv_spinnerMotion{transform-origin:center;animation:dshsv-state-spin 1.5s linear infinite}
.dshsv_spinnerTrack,.dshsv_spinnerArc{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.dshsv_spinnerTrack{opacity:.25}
.dshsv_spinnerArc{stroke-dasharray:12 150;animation:dshsv-state-dash 1.5s ease-in-out infinite}
@keyframes dshsv-state-spin{to{transform:rotate(360deg)}}
@keyframes dshsv-state-dash{0%{stroke-dasharray:12 150;stroke-dashoffset:0}50%{stroke-dasharray:24 150;stroke-dashoffset:-6}to{stroke-dasharray:12 150;stroke-dashoffset:0}}
@media (prefers-reduced-motion: reduce){.dshsv_spinnerMotion,.dshsv_spinnerArc{animation:none}.dshsv_spinnerArc{stroke-dasharray:18 150;stroke-dashoffset:-3}}
.dshsv_status{flex:none;color:var(--dsw-alias-label-secondary,#a9a9a9);font-size:13px;font-weight:500;line-height:24px}
.dshsv_title{min-width:0;flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#e6e6e6);font-size:13px;font-weight:500;line-height:20px}
.dshsv_ws{flex:none;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#a9a9a9);font-size:12px;line-height:18px}
.dshsv_meta{flex:none;display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary,#a9a9a9);font-size:12px;line-height:18px;font-variant-numeric:tabular-nums;white-space:nowrap}
.dshsv_sep{width:1px;height:11px;background:var(--dsw-alias-border-l1,rgba(255,255,255,.14))}
.dshsv_chevronBox{flex:none;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-secondary,#a9a9a9)}
.dshsv_chevron{transition:transform .12s ease}
.dshsv_chevronOpen{transform:rotate(180deg)}
.dshsv_details{padding:2px 12px 10px;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:18px}
.dshsv_detailLine{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#a9a9a9);font-variant-numeric:tabular-nums}
.dshsv_idLine{font-family:var(--ds-font-family-code,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:11px;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary,#a9a9a9))}
.dshsv_othersBadges{flex:none;display:inline-flex;align-items:center;gap:8px}
.dshsv_othersBadge{flex:none;display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-label-secondary,#a9a9a9);font-size:12px;line-height:18px;font-variant-numeric:tabular-nums}
.dshsv_section{margin-top:2px;padding-top:6px;border-top:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.14));color:var(--dsw-alias-label-secondary,#a9a9a9);font-size:11px;line-height:16px}
.dshsv_otherRow{box-sizing:border-box;width:calc(100% + 12px);margin:0 -6px;padding:2px 6px;display:flex;align-items:center;gap:8px;min-width:0;border:0;border-radius:6px;background:transparent;color:inherit;font-family:inherit;font-size:12px;line-height:18px;text-align:left;cursor:pointer}
.dshsv_otherRow:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.08))}
.dshsv_otherRow:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4c9ffe);outline-offset:-2px}
.dshsv_otherChild{position:relative;padding-left:26px}
.dshsv_otherChild::before{content:"";position:absolute;left:13px;top:4px;bottom:4px;width:1px;background:var(--dsw-alias-border-l1,rgba(255,255,255,.14))}
.dshsv_otherTitle{min-width:0;flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#e6e6e6)}
.dshsv_subTag{flex:none;display:inline-flex;align-items:center;padding:0 5px;border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.14));border-radius:999px;color:var(--dsw-alias-label-secondary,#a9a9a9);font-size:10px;line-height:15px;white-space:nowrap}
.dshsv_otherMeta{flex:none;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#a9a9a9);font-variant-numeric:tabular-nums}
.dshsv_flag{flex:none;color:var(--dsw-alias-brand-primary,#4c9ffe)}
.dshsv_rowFlag{display:inline-flex;align-items:center;justify-content:center;flex:none;order:-1}
.dshsv_markTag{flex:none;display:inline-flex;align-items:center;gap:3px;padding:0 6px;border-radius:999px;background:var(--dsw-alias-state-business-tertiary,rgba(76,159,254,.12));color:var(--dsw-alias-label-bluish,var(--dsw-alias-brand-primary,#4c9ffe));font-size:11px;line-height:16px}
.dshsv_otherMark{flex:none;display:inline-flex;align-items:center;gap:3px;color:var(--dsw-alias-brand-primary,#4c9ffe);font-size:11px;line-height:16px}
@media (prefers-reduced-motion: reduce){.dshsv_chevron{transition:none}}
`

    /** Render a duration in a locale-neutral compact form. */
    function formatDuration(ms) {
      if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return null
      if (ms < 1000) return Math.round(ms) + 'ms'
      const seconds = ms / 1000
      if (seconds < 60) return (seconds < 10 ? seconds.toFixed(1) : String(Math.round(seconds))) + 's'
      const minutes = Math.floor(seconds / 60)
      const rest = Math.round(seconds - minutes * 60)
      if (rest === 60) return minutes + 1 + 'm'
      return minutes + 'm ' + String(rest).padStart(2, '0') + 's'
    }

    /** Render a token count with a compact K/M suffix. */
    function formatTokens(value) {
      if (typeof value !== 'number' || !Number.isFinite(value)) return null
      if (value < 1000) return String(Math.round(value))
      if (value < 1e6) {
        const scaled = value / 1000
        return (scaled < 10 ? scaled.toFixed(1) : String(Math.round(scaled))) + 'K'
      }
      const scaled = value / 1e6
      return (scaled < 10 ? scaled.toFixed(1) : String(Math.round(scaled))) + 'M'
    }

    /** Render one timestamp as a local clock time. */
    function formatClock(timestamp) {
      if (typeof timestamp !== 'number' || !Number.isFinite(timestamp) || timestamp <= 0) return null
      const date = new Date(timestamp)
      if (Number.isNaN(date.getTime())) return null
      try {
        return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(date)
      } catch {
        return date.toISOString().slice(11, 16)
      }
    }

    /** Last path segment of a working directory. */
    function basename(path) {
      if (typeof path !== 'string') return null
      const trimmed = path.replace(/[\\/]+$/, '')
      const index = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
      const name = index === -1 ? trimmed : trimmed.slice(index + 1)
      return name === '' ? null : name
    }

    /** Persisted "unfinished" marks, shared by every window of this origin. */
    const MARKS_KEY = 'dsh.session-view.marked'

    function createMarksStore() {
      let marked = new Set()
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(MARKS_KEY) : null
        if (raw !== null && raw !== '') {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) marked = new Set(parsed.filter((value) => typeof value === 'string'))
        }
      } catch {
        marked = new Set()
      }
      const listeners = new Set()
      const publish = () => {
        for (const listener of [...listeners]) listener(marked)
      }
      const persist = () => {
        try {
          if (typeof localStorage !== 'undefined') localStorage.setItem(MARKS_KEY, JSON.stringify([...marked]))
        } catch {}
      }
      const onStorage = (event) => {
        if (event === undefined || event.key !== MARKS_KEY) return
        try {
          const parsed = JSON.parse(event.newValue === null ? '[]' : event.newValue)
          marked = new Set(Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : [])
        } catch {
          marked = new Set()
        }
        publish()
      }
      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('storage', onStorage)
      }
      return {
        has: (id) => typeof id === 'string' && marked.has(id),
        size: () => marked.size,
        subscribe(listener) {
          listeners.add(listener)
          return () => {
            listeners.delete(listener)
          }
        },
        toggle(id) {
          if (typeof id !== 'string' || id === '') return
          if (marked.has(id)) marked.delete(id)
          else marked.add(id)
          persist()
          publish()
        },
        dispose() {
          listeners.clear()
          if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
            window.removeEventListener('storage', onStorage)
          }
        }
      }
    }

    /** Bounded context occupancy from the token-meter projection. */
    function contextOccupancy(pressure) {
      if (pressure == null) return null
      const used = typeof pressure.projectedTokens === 'number' ? pressure.projectedTokens : pressure.pressureTokens
      const window = pressure.contextWindow
      if (typeof used !== 'number' || typeof window !== 'number' || window <= 0) return null
      return { percent: Math.min(100, Math.round((used / window) * 100)), used, window }
    }

    /** Bar status → the shared session state glyph tone. */
    const STATUS_TONE = {
      running: 'running',
      subagent: 'subagent',
      waiting: 'pending',
      error: 'error',
      loading: 'idle',
      blank: 'idle',
      idle: 'idle'
    }

    /** Attention tone of one other Session: awaiting a decision, unseen result, running, or sub-agents running. */
    const OTHER_TONES = {
      pending: {
        labelKey: 'others.state.pending',
        badgeKey: 'others.pending'
      },
      unread: {
        labelKey: 'others.state.unread',
        badgeKey: 'others.unread'
      },
      subagent: {
        labelKey: 'status.subagent',
        badgeKey: 'others.subagents'
      },
      running: {
        labelKey: 'status.running',
        badgeKey: 'others.running'
      }
    }

    /** The shell's session state glyph: a spinner while running, a colored dot otherwise. */
    function SessionStateGlyph({ tone, size, sub }) {
      const subagentSpinner = sub === true
      if (tone === 'marked') {
        return h(
          'svg',
          { className: 'dshsv_flag', viewBox: '0 0 16 16', width: size ?? 12, height: size ?? 12, 'aria-hidden': true },
          h('path', { d: 'M4.6 2.3v11.4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
          h('path', { d: 'M5.4 3h6.3l-1.5 2.6 1.5 2.6H5.4z', fill: 'currentColor' })
        )
      }
      if (tone === 'running' || tone === 'subagent') {
        const px = size ?? 14
        return h(
          'svg',
          {
            className: subagentSpinner ? 'dshsv_spinner dshsv_spinnerSub' : 'dshsv_spinner',
            'data-state': 'ongoing',
            width: px,
            height: px,
            viewBox: '0 0 24 24',
            'aria-hidden': true
          },
          h(
            'g',
            { className: 'dshsv_spinnerMotion' },
            h('circle', { className: 'dshsv_spinnerTrack', cx: '12', cy: '12', r: '9.5' }),
            h('circle', { className: 'dshsv_spinnerArc', cx: '12', cy: '12', r: '9.5' })
          )
        )
      }
      return h('span', { className: 'dshsv_stateDot', 'data-tone': tone ?? 'idle', 'aria-hidden': true })
    }

    /** Render-time boundary that keeps a data-shape surprise visible instead of blanking the slot. */
    class SessionViewBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }

      static getDerivedStateFromError(error) {
        return { error }
      }

      componentDidCatch(error) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
          console.error('[session-view] render failed', error)
        }
      }

      render() {
        if (this.state.error !== null) {
          return h(
            'div',
            { className: 'dshsv_dock' },
            h(
              'div',
              {
                className: 'dshsv_bar',
                style: { padding: '8px 12px', color: 'var(--dsw-alias-state-error-primary, #f85149)' }
              },
              'session-view: ' + String((this.state.error && this.state.error.message) || this.state.error)
            )
          )
        }
        return this.props.children
      }
    }

    /**
     * Compact session overview docked above the composer: lifecycle status,
     * title, workspace, activity counts, and context usage, with a details
     * panel for identifiers and wall times.
     */
    function SessionViewContent({ useSession, useSessions, useSessionStatus, useProjection, useSessionViewOptions, marks, onOpenSession, sessionId, t }) {
      const [open, setOpen] = useState(false)
      const translate = typeof t === 'function' ? t : (key) => key
      const [, setMarkTick] = useState(0)
      useEffect(() => {
        if (marks === undefined || marks === null || typeof marks.subscribe !== 'function') return undefined
        return marks.subscribe(() => setMarkTick((value) => value + 1))
      }, [marks])
      const isMarked = (id) => (marks !== undefined && marks !== null && typeof marks.has === 'function' ? marks.has(id) === true : false)
      const markedCurrent = isMarked(sessionId)
      const useOptions = typeof useSessionViewOptions === 'function' ? useSessionViewOptions : () => undefined
      const showSessionId =
        useOptions((snapshot) =>
          snapshot === undefined || snapshot === null || snapshot.value === undefined || snapshot.value === null
            ? false
            : snapshot.value.showSessionId === true
        ) === true

      const running = useSession((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.running)) === true
      const blank = useSession((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.blank)) === true
      const openState = useSession((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.openState))
      const promptError = useSession((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.promptError))

      const pendingInteraction = useSessionStatus((snapshot) =>
        sessionId === undefined || snapshot === undefined || snapshot === null
          ? undefined
          : snapshot.get(sessionId)?.pendingInteraction
      )

      const title = useSessions((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.byId[sessionId]?.displayTitle))
      const cwd = useSessions((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.byId[sessionId]?.cwd))
      const updatedAt = useSessions((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.byId[sessionId]?.updatedAt))
      const parentId = useSessions((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot.byId[sessionId]?.parentId))
      const sessionIndex = useSessions((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot))
      const sessionStatus = useSessionStatus((snapshot) => (snapshot === undefined || snapshot === null ? undefined : snapshot))
      const statusOf = (id) =>
        sessionStatus !== undefined && sessionStatus !== null && typeof sessionStatus.get === 'function' ? sessionStatus.get(id) : undefined
      /** Count the Session's sub-agents that are still running (child rows first, then the catalog projection). */
      const runningChildrenOf = (id) => {
        if (sessionIndex === undefined || sessionIndex === null) return 0
        const byId = sessionIndex.byId
        let count = 0
        if (byId !== undefined && byId !== null) {
          for (const key of Object.keys(byId)) {
            const row = byId[key]
            if (row === undefined || row === null || row.parentId !== id) continue
            const entry = statusOf(key)
            const childRunning = entry !== undefined && entry !== null && entry.running !== undefined ? entry.running : row.running === true
            if (childRunning === true) count += 1
          }
        }
        if (count > 0) return count
        const projections = sessionIndex.projectionsBySession
        const catalog = projections !== undefined && projections !== null ? projections[id]?.values?.subagentCatalog : undefined
        if (!Array.isArray(catalog)) return 0
        for (const child of catalog) {
          const childId = child !== null && typeof child === 'object' ? child.id : undefined
          if (typeof childId !== 'string') continue
          const entry = statusOf(childId)
          const childRunning =
            entry !== undefined && entry !== null && entry.running !== undefined
              ? entry.running
              : byId !== undefined && byId !== null
                ? byId[childId]?.running
                : undefined
          if (childRunning === true) count += 1
        }
        return count
      }
      const subagentRunning = runningChildrenOf(sessionId)

      const stats = useProjection('sessionStats')
      const pressure = useProjection('contextPressure')
      const tokenUsage = useProjection('tokenUsage')

      const status =
        promptError != null || openState === 'error'
          ? 'error'
          : pendingInteraction !== undefined && pendingInteraction !== null
            ? 'waiting'
            : running
              ? 'running'
              : subagentRunning > 0
                ? 'subagent'
                : openState === 'loading'
                  ? 'loading'
                  : blank
                    ? 'blank'
                    : 'idle'

      /** One label that covers "this session runs", "its sub-agents run", and both at once. */
      const subagentCountText = (count) => translate('others.subagents', { count: String(count) })
      const statusText =
        status === 'running' && subagentRunning > 0
          ? translate('status.runningSubagents', { count: String(subagentRunning) })
          : status === 'subagent'
            ? subagentCountText(subagentRunning)
            : translate('status.' + status)

      const titleText = typeof title === 'string' && title !== '' ? title : translate('untitled')
      const workspace = basename(cwd)
      const context = contextOccupancy(pressure)
      const turns = stats != null && typeof stats.turns === 'number' ? stats.turns : null
      const steps = stats != null && typeof stats.steps === 'number' ? stats.steps : null
      const hasActivity = (turns ?? 0) + (steps ?? 0) > 0
      const activityText = hasActivity
        ? translate('meta.activity', { turns: String(turns ?? 0), steps: String(steps ?? 0) })
        : null
      const contextText = context === null ? null : translate('meta.context', { percent: String(context.percent) })
      const showsMeta = activityText !== null || contextText !== null

      const otherSessions = []
      const otherCounts = { pending: 0, unread: 0, running: 0, subagent: 0, marked: 0 }
      let markedOthers = 0
      const indexUsable =
        sessionIndex !== undefined && Array.isArray(sessionIndex.ids) && sessionIndex.byId !== undefined && sessionIndex.byId !== null
      /** One list row for a Session summary; counts are only consumed for directly listed Sessions. */
      const itemOf = (id, row) => {
        const entry = statusOf(id)
        const pending = entry !== undefined && entry !== null && entry.pendingInteraction !== undefined && entry.pendingInteraction !== null
        const unread = entry !== undefined && entry !== null && entry.completionUnread === true
        const isRunning = row.running === true
        const marked = isMarked(id)
        const childrenRunning = runningChildrenOf(id)
        const tone = pending
          ? 'pending'
          : unread
            ? 'unread'
            : isRunning
              ? 'running'
              : childrenRunning > 0
                ? 'subagent'
                : marked
                  ? 'marked'
                  : 'idle'
        const rowParentId = typeof row.parentId === 'string' && row.parentId !== '' ? row.parentId : undefined
        const subagent = row.origin === 'subagent' || rowParentId !== undefined
        const parentRow = subagent && rowParentId !== undefined ? sessionIndex.byId[rowParentId] : undefined
        const parentTitle =
          typeof parentRow?.displayTitle === 'string' && parentRow.displayTitle !== '' ? parentRow.displayTitle : rowParentId
        return {
          item: {
            id,
            title: typeof row.displayTitle === 'string' && row.displayTitle !== '' ? row.displayTitle : String(id),
            tone,
            marked,
            subagent,
            childrenRunning,
            parentId: rowParentId,
            parentTitle,
            cwd: typeof row.cwd === 'string' ? row.cwd : undefined,
            updatedAt: row.updatedAt
          },
          pending,
          unread,
          isRunning,
          marked
        }
      }
      if (indexUsable) {
        for (const id of sessionIndex.ids) {
          if (id === sessionId) continue
          const row = sessionIndex.byId[id]
          if (row === undefined || row === null || row.blank === true) continue
          if (row.parentId === sessionId) continue
          const info = itemOf(id, row)
          if (!info.pending && !info.unread && !info.isRunning && !info.marked && info.item.childrenRunning === 0) continue
          otherCounts[info.item.tone] += 1
          if (info.marked) markedOthers += 1
          otherSessions.push(info.item)
        }
      }

      // Sub-agent rows become children of their parent row; a parent that is not
      // otherwise listed still appears as the group header so the child is reachable.
      const listedById = new Map(otherSessions.map((item) => [item.id, item]))
      const childrenByParent = new Map()
      const topSessions = []
      for (const item of otherSessions) {
        const parentKnown =
          item.parentId !== undefined &&
          sessionIndex !== undefined &&
          sessionIndex.byId !== undefined &&
          sessionIndex.byId !== null &&
          sessionIndex.byId[item.parentId] !== undefined &&
          sessionIndex.byId[item.parentId] !== null
        if (item.subagent && item.parentId !== undefined && parentKnown) {
          const bucket = childrenByParent.get(item.parentId)
          if (bucket === undefined) childrenByParent.set(item.parentId, [item])
          else bucket.push(item)
        } else {
          topSessions.push(item)
        }
      }
      if (indexUsable) {
        for (const parentId of childrenByParent.keys()) {
          if (listedById.has(parentId)) continue
          const parentRow = sessionIndex.byId[parentId]
          if (parentRow === undefined || parentRow === null || parentRow.blank === true) continue
          topSessions.push(itemOf(parentId, parentRow).item)
        }
      }
      const rank = (item) => (item.tone === 'pending' ? 4 : item.tone === 'unread' ? 3 : item.marked ? 2 : 1)
      topSessions.sort((a, b) => rank(b) - rank(a) || (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
      for (const children of childrenByParent.values()) children.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
      const shownOthers = topSessions.slice(0, 8)

      // The current Session's own sub-agents belong to it, so they live in this box
      // instead of the "other sessions" list; only the active ones are shown.
      const currentChildren = []
      if (indexUsable) {
        for (const key of Object.keys(sessionIndex.byId)) {
          const row = sessionIndex.byId[key]
          if (row === undefined || row === null || row.blank === true || row.parentId !== sessionId) continue
          const info = itemOf(key, row)
          if (!info.pending && !info.unread && !info.isRunning && !info.marked && info.item.childrenRunning === 0) continue
          currentChildren.push(info.item)
        }
        currentChildren.sort((a, b) => rank(b) - rank(a) || (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
      }
      const shownChildren = currentChildren.slice(0, 5)
      const otherBadges = []
      const markedTotal = markedOthers + (markedCurrent ? 1 : 0)
      if (markedTotal > 0) {
        otherBadges.push({
          key: 'marked',
          label: translate('mark.count', { count: String(markedTotal) }),
          count: markedTotal
        })
      }
      for (const tone of ['pending', 'unread', 'subagent']) {
        if (otherCounts[tone] > 0) {
          otherBadges.push({
            key: tone,
            label: translate(OTHER_TONES[tone].badgeKey, { count: String(otherCounts[tone]) }),
            count: otherCounts[tone]
          })
        }
      }
      if (otherCounts.running > 0 && otherCounts.pending === 0 && otherCounts.unread === 0) {
        otherBadges.push({
          key: 'running',
          label: translate(OTHER_TONES.running.badgeKey, { count: String(otherCounts.running) }),
          count: otherCounts.running
        })
      }

      const modelTime = stats == null ? null : formatDuration(stats.llmMs)
      const toolTime = stats == null ? null : formatDuration(stats.toolMs)
      const clock = formatClock(updatedAt)

      // Usage replaces the metrics already shown in the row's top-right corner.
      const usageInput = tokenUsage == null ? null : (tokenUsage.uncachedInputTokens ?? 0) + (tokenUsage.cacheReadTokens ?? 0) + (tokenUsage.cacheWriteTokens ?? 0)
      const usageOutput = tokenUsage == null ? null : tokenUsage.outputTokens ?? 0
      const usageTotal = usageInput === null || usageOutput === null ? null : usageInput + usageOutput
      const cachePercent =
        tokenUsage == null || usageInput === null || usageInput <= 0
          ? null
          : Math.round(((tokenUsage.cacheReadTokens ?? 0) / usageInput) * 1000) / 10

      const usageParts = []
      if (usageTotal !== null && usageTotal > 0) {
        usageParts.push(translate('stats.tokens', { count: formatTokens(usageTotal) ?? String(usageTotal) }))
      }
      if (cachePercent !== null) usageParts.push(translate('stats.cache', { percent: String(cachePercent) }))
      if (modelTime !== null) usageParts.push(translate('stats.model', { time: modelTime }))
      if (toolTime !== null) usageParts.push(translate('stats.tool', { time: toolTime }))
      const detailLine = usageParts.join(' · ')

      const detailTitleParts = []
      if (usageTotal !== null && usageTotal > 0) {
        detailTitleParts.push(translate('stats.total') + ': ' + (formatTokens(usageTotal) ?? String(usageTotal)))
        detailTitleParts.push(translate('stats.input') + ': ' + String(tokenUsage.uncachedInputTokens ?? 0))
        detailTitleParts.push(translate('stats.cacheRead') + ': ' + String(tokenUsage.cacheReadTokens ?? 0))
        detailTitleParts.push(translate('stats.cacheWrite') + ': ' + String(tokenUsage.cacheWriteTokens ?? 0))
        detailTitleParts.push(translate('stats.output') + ': ' + String(tokenUsage.outputTokens ?? 0))
      }
      if (typeof cwd === 'string' && cwd !== '') detailTitleParts.push(translate('detail.workspace') + ': ' + cwd)
      if (hasActivity) {
        detailTitleParts.push(
          translate('detail.activity') +
            ': ' +
            translate('detail.activity.value', { turns: String(turns ?? 0), steps: String(steps ?? 0) })
        )
      }
      if (context !== null) {
        detailTitleParts.push(
          translate('detail.context') +
            ': ' +
            translate('detail.context.value', {
              used: formatTokens(context.used) ?? String(context.used),
              window: formatTokens(context.window) ?? String(context.window),
              percent: String(context.percent)
            })
        )
      }
      if (modelTime !== null || toolTime !== null) {
        detailTitleParts.push(
          translate('detail.time') +
            ': ' +
            translate('detail.time.value', { model: modelTime ?? translate('detail.none'), tools: toolTime ?? translate('detail.none') })
        )
      }
      if (clock !== null) detailTitleParts.push(translate('detail.updated') + ': ' + clock)
      if (showSessionId && typeof sessionId === 'string' && sessionId !== '') {
        detailTitleParts.push(translate('detail.id') + ': ' + sessionId)
      }
      if (showSessionId && typeof parentId === 'string' && parentId !== '') {
        detailTitleParts.push(translate('detail.parent') + ': ' + parentId)
      }
      const detailTitle = detailTitleParts.join('\n')

      const otherNodes = []
      if (shownOthers.length > 0) {
        otherNodes.push(h('div', { key: 'others-title', className: 'dshsv_section' }, translate('others.title')))
        const visited = new Set()
        const pushOtherRow = (item, depth) => {
          if (visited.has(item.id)) return
          visited.add(item.id)
          const tone = OTHER_TONES[item.tone]
          const otherWorkspace = basename(item.cwd)
          const otherMeta = []
          if (item.tone !== 'marked') {
            if (item.tone === 'running' && item.childrenRunning > 0) {
              otherMeta.push(translate('status.runningSubagents', { count: String(item.childrenRunning) }))
            } else if (item.tone === 'subagent') {
              otherMeta.push(translate('others.subagents', { count: String(item.childrenRunning) }))
            } else {
              otherMeta.push(translate(tone !== undefined ? tone.labelKey : 'status.idle'))
            }
          }
          if (item.marked) otherMeta.push(translate('mark.pending'))
          if (otherWorkspace !== null) otherMeta.push(otherWorkspace)
          const otherClock = formatClock(item.updatedAt)
          if (otherClock !== null) otherMeta.push(otherClock)
          otherNodes.push(
            h(
              'button',
              {
                key: 'other-' + item.id,
                type: 'button',
                className: depth > 0 ? 'dshsv_otherRow dshsv_otherChild' : 'dshsv_otherRow',
                title: translate('others.open', { title: item.title }),
                'aria-label': translate('others.open', { title: item.title }),
                onClick: () => {
                  if (typeof onOpenSession === 'function') onOpenSession(item.id)
                },
                onContextMenu: (event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  if (marks !== undefined && marks !== null && typeof marks.toggle === 'function') marks.toggle(item.id)
                }
              },
              h(SessionStateGlyph, { tone: item.tone, sub: item.subagent === true }),
              h('span', { className: 'dshsv_otherTitle' }, item.title),
              item.subagent
                ? h(
                    'span',
                    {
                      className: 'dshsv_subTag',
                      title: translate('others.subagent.parent', { title: item.parentTitle ?? item.parentId ?? translate('detail.none') })
                    },
                    translate('others.subagent')
                  )
                : null,
              h('span', { className: 'dshsv_otherMeta' }, otherMeta.join(' · '))
            )
          )
          for (const child of childrenByParent.get(item.id) ?? []) pushOtherRow(child, depth + 1)
        }
        for (const item of shownOthers) pushOtherRow(item, 0)
        if (topSessions.length > shownOthers.length) {
          otherNodes.push(
            h(
              'div',
              { key: 'others-more', className: 'dshsv_section' },
              translate('others.more', { count: String(topSessions.length - shownOthers.length) })
            )
          )
        }
      }

      return h(
        'div',
        { className: 'dshsv_dock', 'data-session-view': sessionId },
        h(
          'section',
          { className: 'dshsv_bar', 'aria-label': translate('aria.label') },
          h(
            'div',
            {
              className: 'dshsv_head',
              role: 'button',
              tabIndex: 0,
              'aria-expanded': open ? 'true' : 'false',
              'aria-label': open ? translate('action.collapse') : translate('action.expand'),
              title: open ? translate('action.collapse') : translate('action.expand'),
              onClick: () => setOpen((value) => !value),
              onKeyDown: (event) => {
                if (event.target !== event.currentTarget) return
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                setOpen((value) => !value)
              },
              onContextMenu: (event) => {
                event.preventDefault()
                if (marks !== undefined && marks !== null && typeof marks.toggle === 'function') marks.toggle(sessionId)
              }
            },
            h(
              'div',
              { className: 'dshsv_row' },
              h(SessionStateGlyph, { tone: STATUS_TONE[status] ?? 'idle', sub: typeof parentId === 'string' && parentId !== '' }),
              h('span', { className: 'dshsv_status' }, statusText),
              h('span', { className: 'dshsv_title', title: titleText }, titleText),
              markedCurrent
                ? h(
                    'span',
                    { className: 'dshsv_markTag', title: translate('mark.hint') },
                    h(SessionStateGlyph, { tone: 'marked', size: 11 }),
                    translate('mark.pending')
                  )
                : null,
              workspace === null ? null : h('span', { className: 'dshsv_ws', title: cwd }, workspace),
              showsMeta
                ? h(
                    'div',
                    { className: 'dshsv_meta' },
                    activityText === null ? null : h('span', null, activityText),
                    activityText !== null && contextText !== null
                      ? h('span', { className: 'dshsv_sep', 'aria-hidden': true })
                      : null,
                    contextText === null ? null : h('span', null, contextText)
                  )
                : null,
              otherBadges.length > 0
                ? h(
                    'span',
                    { className: 'dshsv_othersBadges' },
                    otherBadges.map((badge) =>
                      h(
                        'span',
                        { key: badge.key, className: 'dshsv_othersBadge', title: badge.label },
                        h(SessionStateGlyph, { tone: badge.key, size: 12 }),
                        String(badge.count)
                      )
                    )
                  )
                : null,
              h(
                'span',
                { className: 'dshsv_chevronBox', 'aria-hidden': true },
                h(
                  'svg',
                  {
                    className: open ? 'dshsv_chevron dshsv_chevronOpen' : 'dshsv_chevron',
                    viewBox: '0 0 16 16',
                    width: 14,
                    height: 14,
                    'aria-hidden': true
                  },
                  h('path', {
                    d: 'M4 6.5 8 10.5 12 6.5',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 1.5,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  })
                )
              )
            ),
            open && detailLine !== ''
              ? h(
                  'div',
                  { className: 'dshsv_headDetail' },
                  h('div', { className: 'dshsv_detailLine', title: detailTitle }, detailLine)
                )
              : null,
            shownChildren.length > 0
              ? h(
                  'div',
                  { className: 'dshsv_children' },
                  h('div', { className: 'dshsv_childrenTitle' }, translate('children.title')),
                  shownChildren.map((child) => {
                    const childState =
                      child.tone === 'pending'
                        ? translate('others.state.pending')
                        : child.tone === 'unread'
                          ? translate('others.state.unread')
                          : child.tone === 'running'
                            ? translate('status.running')
                            : child.tone === 'subagent'
                              ? translate('status.subagent')
                              : child.marked
                                ? translate('mark.pending')
                                : null
                    return h(
                      'button',
                      {
                        key: 'child-' + child.id,
                        type: 'button',
                        className: 'dshsv_childRow',
                        title: translate('others.open', { title: child.title }),
                        onClick: (event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          if (typeof onOpenSession === 'function') onOpenSession(child.id)
                        },
                        onContextMenu: (event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          if (marks !== undefined && marks !== null && typeof marks.toggle === 'function') marks.toggle(child.id)
                        }
                      },
                      h(SessionStateGlyph, { tone: child.tone, size: 11, sub: true }),
                      h('span', { className: 'dshsv_childTitle' }, child.title),
                      childState === null ? null : h('span', { className: 'dshsv_childState' }, childState)
                    )
                  }),
                  currentChildren.length > shownChildren.length
                    ? h(
                        'div',
                        { className: 'dshsv_childrenMore' },
                        translate('others.more', { count: String(currentChildren.length - shownChildren.length) })
                      )
                    : null
                )
              : null
          ),
          open && ((showSessionId && typeof sessionId === 'string' && sessionId !== '') || otherNodes.length > 0)
            ? h(
                'div',
                { className: 'dshsv_details' },
                [
                  showSessionId && typeof sessionId === 'string' && sessionId !== ''
                    ? h('div', { key: 'detail-id', className: 'dshsv_detailLine dshsv_idLine', title: sessionId }, sessionId)
                    : null,
                  ...otherNodes
                ].filter((node) => node !== null)
              )
            : null
        )
      )
    }

    /** Public slot component: keeps a render failure observable inside the dock. */
    function SessionView(props) {
      return h(SessionViewBoundary, null, h(SessionViewContent, props))
    }

    return {
      inject: ['slots', 'locale', 'configForms', 'uiWorkspace'],
      apply(ctx) {
        let optionsForm
        try {
          optionsForm = ctx.configForms !== undefined && typeof ctx.configForms.get === 'function' ? ctx.configForms.get('session-view') : undefined
        } catch {
          optionsForm = undefined
        }

        const workspaceUi = ctx.uiWorkspace !== undefined && ctx.uiWorkspace !== null ? ctx.uiWorkspace : typeof ctx.get === 'function' ? ctx.get('uiWorkspace') : undefined
        /** Switch the main view to another Session; the dock stays usable when the service is absent. */
        const openSession = (id) => {
          if (workspaceUi === undefined || workspaceUi === null || typeof workspaceUi.openSession !== 'function') {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
              console.warn('[session-view] uiWorkspace.openSession is unavailable; cannot open Session', id)
            }
            return
          }
          try {
            workspaceUi.openSession(id)
          } catch (error) {
            if (typeof console !== 'undefined' && typeof console.error === 'function') {
              console.error('[session-view] open session failed', error)
            }
          }
        }

        const marks = createMarksStore()
        ctx.effect(() => () => marks.dispose(), 'session-view: unfinished marks')

        const contextMenus = typeof ctx.get === 'function' ? ctx.get('contextMenus') : undefined
        const boundT = typeof ctx.locale.bind === 'function' ? ctx.locale.bind(NS) : (key) => key
        if (contextMenus !== undefined && contextMenus !== null && typeof contextMenus.register === 'function') {
          ctx.effect(
            () =>
              contextMenus.register({
                id: 'session-view.mark',
                target: 'session',
                order: 350,
                resolve: (target) => {
                  const owner =
                    target !== null && typeof target === 'object' && typeof target.sessionId === 'string'
                      ? target
                      : target !== null && typeof target === 'object' && target.value !== null && typeof target.value === 'object' && typeof target.value.sessionId === 'string'
                        ? target.value
                        : undefined
                  if (owner === undefined) return []
                  const marked = marks.has(owner.sessionId) === true
                  return [
                    {
                      id: 'mark-unfinished',
                      label: boundT(marked ? 'mark.remove' : 'mark.add'),
                      icon: { key: 'session-view.mark' },
                      run: () => {
                        marks.toggle(owner.sessionId)
                      }
                    }
                  ]
                }
              }),
            'session-view: session menu action'
          )
          ctx.slots.inject('contextMenu.icon', () =>
            ctx.slots.register(
              { name: 'contextMenu.icon', key: 'session-view.mark' },
              function SessionViewMarkIcon() {
                return h(SessionStateGlyph, { tone: 'marked' })
              }
            )
          )
        }
        ctx.effect(
          () => ctx.locale.register(NS, { zh, en }),
          'session-view: dictionaries'
        )
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          const existing = document.querySelector('style[data-plugin-css=' + JSON.stringify(STYLE_ID) + ']')
          if (existing !== null) existing.remove()
          const tag = document.createElement('style')
          tag.dataset.plugin = 'dsh-session-strip'
          tag.dataset.pluginCss = STYLE_ID
          tag.textContent = css
          document.head.appendChild(tag)
          return () => {
            tag.remove()
          }
        }, 'session-view: styles')

        /** Small unfinished flag in the left sidebar Session row. */
        function SessionRowMark({ sessionId }) {
          const [, setMarkTick] = useState(0)
          useEffect(() => marks.subscribe(() => setMarkTick((value) => value + 1)), [])
          if (marks.has(sessionId) !== true) return null
          return h(
            'span',
            { className: 'dshsv_rowFlag', title: boundT('mark.pending') },
            h(SessionStateGlyph, { tone: 'marked', size: 12 })
          )
        }
        ctx.slots.inject('sidebar.session.row.trailing', () =>
          ctx.slots.register(
            { name: 'sidebar.session.row.trailing', id: 'session-view-mark', order: 50, locale: NS },
            SessionRowMark
          )
        )

        ctx.slots.inject('conversation.input.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.input.dock',
              id: 'session-view',
              order: 5,
              locale: NS,
              inject: () => ({
                ...(optionsForm === undefined ? {} : { hooks: { sessionViewOptions: optionsForm } }),
                marks,
                onOpenSession: openSession
              })
            },
            SessionView
          )
        )
      }
    }
  }
})
