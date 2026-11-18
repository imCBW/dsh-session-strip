import z from '@deepseek-ai/schemastery'

/** Options for the Session view bundle, editable in Settings → Plugins. */
export const Config = z.object({
  showSessionId: z
    .boolean()
    .default(false)
    .volatile()
    .description('Show the full session ID in the session details panel')
})

/**
 * Host half of the Session view bundle.
 *
 * It contributes the option schema and binds it to the profile settings document so
 * the Plugin Manager can present it. This half deliberately owns no Session
 * capability: the plugin renders and reads, and never creates or edits a Session.
 * Cross-Session reading is done outside the plugin by `tools/session-browse.mjs`,
 * which only decompresses existing logs.
 */
export function apply(ctx) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
