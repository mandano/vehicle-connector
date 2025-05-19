import ContextInterface from "../context/ContextInterface.ts";

async function loadContext(): Promise<ContextInterface> {
  if (process.env.INTERNAL === 'true') {
    return (await import('./bootstrap.internal.ts')).default as ContextInterface;
  } else {
    return (await import('./bootstrap.ts')).default as ContextInterface;
  }
}

export default loadContext;
