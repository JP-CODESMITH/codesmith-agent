// Import OpenTUI core renderable components for building the terminal UI
import {
  BoxRenderable,          // Container component for layout
  InputRenderable,        // Text input component
  InputRenderableEvents,  // Event types for the input component
  TextRenderable,         // Static text display component
  createCliRenderer,      // Factory for creating the CLI renderer
} from '@opentui/core'
// Import the AI provider factory for creating provider instances
import { createAIProvider } from '~/ai/provider'
// Import the agent turn function for processing user messages
import { runAgentTurn } from '~/agent/loop'
// Import the default tool registry for making tools available
import { createDefaultToolRegistry } from '~/agent/agent'
// Import the project detector to identify the user's project
import { detectProject } from '~/project/detector'
// Import the permission gate for security checks
import { permissionGate } from '~/security/permissions'
// Import the session factory for creating new conversations
import { createCodeSmithSession } from '~/session/session'
// Import the session type for type safety
import type { CodeSmithSession } from '~/session/types'
// Import the project summary formatter for display
import { formatProjectSummary } from '~/ui/shared/messages'

// Options for configuring the TUI instance
export interface TuiOptions {
  projectPath: string // Path to the project directory to work in
}

// Determine the status label based on the current session state
function statusLabel(session: CodeSmithSession): string {
  if (session.errors.length > 0) return 'Error'         // Errors present = Error status
  if (session.state === 'thinking') return 'Thinking'     // Agent is processing
  if (session.state === 'executing') return 'Running'     // Agent is running a tool
  return 'Ready'                                          // Default idle state
}

// Render the conversation messages as a formatted string
function renderConversation(session: CodeSmithSession): string {
  // Map each message to a labeled line (You > or CodeSmith >)
  const lines = session.messages.flatMap((message) => {
    const label = message.role === 'user' ? 'You' : 'CodeSmith'
    return [`${label} > ${message.content}`]
  })

  // If no messages yet, show the welcome/initial screen
  if (lines.length === 0) {
    return [
      formatProjectSummary(session), // Show detected project info
      '',
      'You >',                         // Prompt for user input
      '',
      'CodeSmith > Phase 1 terminal foundation is ready.', // Welcome message
    ].join('\n')
  }

  // Show only the last 16 messages to keep the display manageable
  return lines.slice(-16).join('\n')
}

// Render the most recent tool execution status
function renderToolStatus(session: CodeSmithSession): string {
  if (session.tools.length === 0) return 'Tools: idle' // No tools used yet
  const lastTool = session.tools.at(-1)
  if (!lastTool) return 'Tools: idle'
  // Show the last tool name and whether it succeeded or failed
  return `Tool: ${lastTool.toolName} ${lastTool.result?.ok ? 'completed' : 'failed'}`
}

// Main entry point: initialize and run the terminal UI
export async function runCodeSmithTui(options: TuiOptions): Promise<void> {
  // Detect the project at the given path for context
  const project = detectProject(options.projectPath)
  // Create a fresh in-memory session for this TUI session
  let session = createCodeSmithSession(project)

  // Smoke mode: run without a TTY for automated testing/CI checks
  if (!process.stdin.isTTY || process.argv.includes('--smoke')) {
    process.stdout.write(`CodeSmith Agent TUI\n${formatProjectSummary(session)}\n`)
    return
  }

  // Create the CLI renderer with configuration
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,     // Allow quitting with Ctrl+C
    targetFps: 30,         // Target 30 frames per second for smooth rendering
    backgroundColor: '#0B1020', // Dark background color
  })

  // The render tree is deliberately small: a frame, text areas, status line,
  // and one input. Richer panels can be added without changing agent state.

  // Root container filling the entire terminal
  const root = new BoxRenderable(renderer, {
    width: '100%',
    height: '100%',
    flexDirection: 'column',  // Stack children vertically
    backgroundColor: '#0B1020',
    padding: 1,
  })

  // Main frame with a border to contain the UI
  const frame = new BoxRenderable(renderer, {
    width: '100%',
    height: '100%',
    border: true,               // Enable border rendering
    borderStyle: 'rounded',     // Rounded corner style
    borderColor: '#6EA8FE',     // Blue border color
    flexDirection: 'column',
    backgroundColor: '#101827', // Slightly lighter dark background
  })

  // Header text area at the top showing the agent name and status
  const header = new TextRenderable(renderer, {
    content: '',
    height: 1,
    fg: '#E6EDF7', // Light text color
  })

  // Body text area for the conversation messages
  const body = new TextRenderable(renderer, {
    content: '',
    flexGrow: 1, // Take up all remaining vertical space
    fg: '#D5E1F2', // Slightly dimmer text for messages
  })

  // Status bar at the bottom showing tool status and quit instructions
  const status = new TextRenderable(renderer, {
    content: '',
    height: 1,
    fg: '#8FB3FF', // Blue-ish status text
  })

  // Input field at the bottom for typing commands
  const input = new InputRenderable(renderer, {
    id: 'codesmith-input',
    width: '100%',
    placeholder: '> Type a task...', // Hint text when empty
    textColor: '#FFFFFF',
    cursorColor: '#8FF0A4', // Green cursor
    backgroundColor: '#151F32',
    focusedBackgroundColor: '#1D2A42', // Darker when focused
  })

  // Refresh all renderable components with current session data
  function refresh(): void {
    // OpenTUI renderables update when their content properties change.
    header.content = `CodeSmith Agent                              * ${statusLabel(session)}`
    body.content = renderConversation(session)
    status.content = `${renderToolStatus(session)} | q or Ctrl+C exits safely`
  }

  // Handle user submission: trim input, clear field, and call the agent loop
  async function submit(value: string): Promise<void> {
    const message = value.trim()
    if (!message) return // Ignore empty submissions

    input.value = '' // Clear the input field
    // Update session state to 'thinking' before calling the agent
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

    session = result.session // Update session with the result
    refresh()                // Re-render with new data
    input.focus()            // Return focus to the input field
  }

  // Handle Enter key: submit the current input value
  input.on(InputRenderableEvents.ENTER, () => {
    void submit(input.value)
  })

  // Handle key presses: quit on 'q' when input is empty, '/' for future command palette
  renderer.keyInput.on('keypress', (key) => {
    if (key.name === 'q' && !input.value) {
      renderer.destroy() // Quit the application
    } else if (key.name === '/') {
      // TODO: Command palette placeholder
    }
  })

  // Build the UI tree: add components in order
  frame.add(header)
  frame.add(body)
  frame.add(status)
  frame.add(input)
  root.add(frame)
  renderer.root.add(root)
  input.focus()  // Focus the input field on start
  refresh()      // Initial render
}
