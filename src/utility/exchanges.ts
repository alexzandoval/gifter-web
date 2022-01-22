import { Rules, Participant } from 'components/exchanges/NewExchangeForm'

type ParticipantWithPotentialDraws = Participant & {
  potentialDraws: { name: string }[]
}

export const isDrawPossible = (participants: Participant[], rules: Rules): boolean => {
  const numberOfParticipants = participants.length
  let totalNumberOfExclusions = 0
  const { numberOfDraws, addExclusions } = rules
  const participantsWithPotentialDraws: ParticipantWithPotentialDraws[] = []

  if (numberOfParticipants < 3) return false
  if (!addExclusions) return true

  // Check that everyone can draw enough names to match the exchange settings
  const everyoneHasEnoughNamesToDraw = participants.every((currentParticipant, index) => {
    totalNumberOfExclusions += currentParticipant.excludes.length
    const peopleThisParticipantCanDraw = participants.filter(
      (p) =>
        currentParticipant.name !== p.name &&
        !currentParticipant.excludes.some((e) => e.name === p.name),
    )
    if (peopleThisParticipantCanDraw.length < numberOfDraws) {
      return false
    }
    participantsWithPotentialDraws.push({
      ...currentParticipant,
      potentialDraws: peopleThisParticipantCanDraw,
    })
    return true
  })
  if (!everyoneHasEnoughNamesToDraw) return false

  // Sort participantsWithEligibleDraws by who has the least amount of names to draw
  participantsWithPotentialDraws.sort((a, b) => a.potentialDraws.length - b.potentialDraws.length)

  if (numberOfDraws === 1) {
    const drawnNames: { gifter: string; giftee: string }[] = []
    const everyoneCanDrawAName = participantsWithPotentialDraws.every((participant) => {
      const drawnName = participant.potentialDraws.find(
        ({ name }) => !drawnNames.some(({ giftee }) => name === giftee),
      )
      if (drawnName) {
        drawnNames.push({ gifter: participant.name, giftee: drawnName.name })
        return true
      }
      return false
    })
    console.log({
      drawnNames,
      everyoneCanDrawAName,
      participantsWithPotentialDraws: participantsWithPotentialDraws.map(
        ({ name, potentialDraws }) =>
          `${name} can draw ${potentialDraws.map((p) => p.name).join(', ')}`,
      ),
    })
    // TODO: Find the participant who cannot draw a name and see if there is a way to make this more efficient
    if (!everyoneCanDrawAName) return false
  }

  console.log(participantsWithPotentialDraws)
  console.log({ totalNumberOfExclusions })

  return true
}
