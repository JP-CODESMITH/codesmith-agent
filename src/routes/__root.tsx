/// <reference types="vite/client" />
// Import TanStack Router primitives for building the root route
import {
  HeadContent,    // Injects content into the document <head>
  Outlet,        // Renders child routes within the layout
  Scripts,       // Injects client-side JavaScript bundles
  createRootRoute, // Creates the root route that all other routes are nested under
} from '@tanstack/react-router'
// Import React for JSX rendering
import * as React from 'react'
// Import the global CSS stylesheet
import appCss from '~/styles/app.css?url'

// Create the root route with metadata and document shell configuration
export const Route = createRootRoute({
  head: () => ({
    // Standard meta tags for the HTML document
    meta: [
      { charSet: 'utf-8' },                              // Character encoding
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // Mobile responsive viewport
      { title: 'CodeSmith Agent' },                      // Browser tab title
    ],
    // Link tags for loading stylesheets
    links: [
      { rel: 'stylesheet', href: appCss }, // Load the global CSS file
    ],
  }),
  // The layout component that wraps all child routes
  shellComponent: RootDocument,
})

// Root document shell that provides the HTML structure for all pages
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />     // Render head content (meta tags, title, etc.)
      </head>
      <body>
        {children}          // Render the matched child route content
        <Scripts />         // Inject the client-side JavaScript bundle
      </body>
    </html>
  )
}
