/**
 * Harbor Shop — Benchmark prices
 *
 * Sentry issue: TypeError destructuring a competitor benchmark entry that
 * may be undefined when the product has no competitor data.
 *
 * Products without competitor pricing cause the price benchmark
 * calculation to crash when destructuring the undefined benchmark.
 * Fix by providing a fallback for the missing benchmark.
 */

export const meta = {
  id: 'benchmark-prices',
  title: 'Benchmark prices',
  description: 'Destructures a competitor benchmark entry to compare prices.',
  resolved: false,
}

type BenchmarkEntry = { competitor: string; price: number }

function lookupBenchmark(_sku: string): BenchmarkEntry | undefined {
  return undefined
}

export function run(): void {
  const { price } = lookupBenchmark('unknown-sku')!
  void price
}