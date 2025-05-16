export const formatDate = (date: Date): string => {
  // remove T00:00:00.000Z evitando de formatar a data passando um dia amais ou a menos
  return date.toISOString().split('T')[0]
}
