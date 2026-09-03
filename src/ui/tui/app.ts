import {
  BoxRenderable,
  InputRenderable,
  InputRenderableEvents,
  TextRenderable,
  createCliRenderer,
} from '@opentui/core'
import { createAIProvider } from '~/ai/provider'
import { runAgentTurn } from '~/agent/loop'
import { createDefaultToolRegistry } from '~/agent/agent'
import { detectProject } from '~/project/detector'
import { permissionGate } from '~/security/permissions'
import { createCodeSmithSession } from '~/session/session'
import type { CodeSmithSession } from '~/session/types'
import { formatProjectSummary } from '~/ui/shared/messages'

export interface TuiOptions {
  projectPath: string
}

function statusLabel(session: CodeSmithSession): string {
  if (session.errors.length > 0) return 'Error'
  if (session.state === 'thinking') return 'Thinking'
  if (session.state === 'executing') return 'Running'
  return 'Ready'
}

function renderConversation(session: CodeSmithSession): string {
  const lines = session.messages.flatMap((message) => {
    const label = message.role === 'user' ? 'You' : 'CodeSmith'
    return [`${label} > ${message.content}`]
  })

  if (lines.length === 0) {
    return [
      formatProjectSummary(session),
      '',
      'You >',
      '',
      'CodeSmith > Phase 1 terminal foundation is ready.',
    ].join('\n')
  }

  return lines.slice(-16).join('\n')
}

function renderToolStatus(session: CodeSmithSession): string {
  if (session.tools.length === 0) return 'Tools: idle'
  const lastTool = session.tools.at(-1)
  if (!lastTool) return 'Tools: idle'
  return `Tool: ${lastTool.toolName} ${lastTool.result?.ok ? 'completed' : 'failed'}`
}

export async function runCodeSmithTui(options: TuiOptions): Promise<void> {
  const project = detectProject(options.projectPath)
  let session = createCodeSmithSession(project)

  // Smoke mode lets automated checks verify the CLI path without opening a TTY UI.
  if (!process.stdin.isTTY || process.argv.includes('--smoke')) {
    process.stdout.write(`CodeSmith Agent TUI\n${formatProjectSummary(session)}\n`)
    return
  }

  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    targetFps: 30,
    backgroundColor: '#0B1020',
  })

  // The render tree is deliberately small: a frame, text areas, status line,
  // and one input. Richer panels can be added without changing agent state.
  const root = new BoxRenderable(renderer, {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#0B1020',
    padding: 1,
  })

  const frame = new BoxRenderable(renderer, {
    width: '100%',
    height: '100%',
    border: true,
    borderStyle: 'rounded',
    borderColor: '#6EA8FE',
    flexDirection: 'column',
    backgroundColor: '#101827',
  })

  const header = new TextRenderable(renderer, {
    content: '',
    height: 1,
    fg: '#E6EDF7',
  })

  const body = new TextRenderable(renderer, {
    content: '',
    flexGrow: 1,
    fg: '#D5E1F2',
  })

  const status = new TextRenderable(renderer, {
    content: '',
    height: 1,
    fg: '#8FB3FF',
  })

  const input = new InputRenderable(renderer, {
    id: 'codesmith-input',
    width: '100%',
    placeholder: '> Type a task...',
    textColor: '#FFFFFF',
    cursorColor: '#8FF0A4',
    backgroundColor: '#151F32',
    focusedBackgroundColor: '#1D2A42',
  })

  function refresh(): void {
    // OpenTUI renderables update when their content properties change.
    header.content = `CodeSmith Agent                              * ${statusLabel(session)}`
    body.content = renderConversation(session)
    status.content = `${renderToolStatus(session)} | q or Ctrl+C exits safely`
  }

  async function submit(value: string): Promise<void> {
    const message = value.trim()
    if (!message) return

    input.value = ''
    session = {
      ...session,
      state: 'thinking',
      updatedAt: Date.now(),
    }
    refresh()

    // The TUI calls the shared agent loop directly; no HTTP server is required.
    const result = await runAgentTurn(
      {
        session,
        aiProvider: createAIProvider({ provider: 'placeholder' }),
        permissions: permissionGate,
        tools: createDefaultToolRegistry(),
      },
      { message },
    )

    session = result.session
    refresh()
    input.focus()
  }

  input.on(InputRenderableEvents.ENTER, () => {
    void submit(input.value)
  })

  renderer.keyInput.on('keypress', (key) => {
    if (key.name === 'q' && !input.value) {
      renderer.destroy()
    } else if (key.name === '/') {

    }
  })

  frame.add(header)
  frame.add(body)
  frame.add(status)
  frame.add(input)
  root.add(frame)
  renderer.root.add(root)
  input.focus()
  refresh()
}
