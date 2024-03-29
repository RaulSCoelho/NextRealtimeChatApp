export async function delay(seconds: number = 1) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

export async function runPotentialPromise<T, R>(fn?: (props: T) => R, props?: T) {
  const res = fn?.(props as T)

  if (res instanceof Promise) await res

  return res
}
