// Import the createRouter function from TanStack React Router to set up routing
import { createRouter } from '@tanstack/react-router'
// Import the auto-generated route tree that maps all application routes
import { routeTree } from './routeTree.gen'

// Create and configure the application's router with the generated route tree
// scrollRestoration: true enables automatic scroll position restoration on navigation
export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })
  return router
}
