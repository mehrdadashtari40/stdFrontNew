// Create a polyfill for findDOMNode in React 19
export function findDOMNode(component) {
  // In React 19, findDOMNode is removed, so we need to use refs instead
  if (component && component.refs && component.refs.container) {
    return component.refs.container;
  }
  
  // For class components with createRef
  if (component && component.containerRef && component.containerRef.current) {
    return component.containerRef.current;
  }
  
  // For functional components, this won't work - need to refactor to use refs
  console.warn('findDOMNode is deprecated. Please refactor to use refs directly.');
  return null;
}

// Export as default for backward compatibility
export default { findDOMNode };