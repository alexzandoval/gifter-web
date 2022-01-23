import { Rules, Participant } from 'components/exchanges/NewExchangeForm'

type ParticipantWithPotentialDraws = Participant & {
  potentialDraws: { name: string }[]
}

const NUMBER_OF_TIMES_TO_TRY_TO_FIND_A_DRAWING_CLASH = 25

// Brute force algorithm to find a clash of participants
const randomlyCheckForDrawingClashes = (
  participants: ParticipantWithPotentialDraws[],
  numberOfDraws: number,
): boolean => {
  const checkForClash = () => {
    const drawnNames: { gifter: string; giftees: string[] }[] = []
    const canEveryoneDrawAName = participants.every((participant) => {
      // Removing names that have met the draw limit
      const namesLeftToDraw = participant.potentialDraws.filter(({ name }) => {
        let numberOfTimesNameHasBeenDrawn = 0
        // Checking if a name has been drawn n times
        return !drawnNames.some(({ giftees }) => {
          if (giftees.includes(name)) {
            numberOfTimesNameHasBeenDrawn += 1
          }
          return numberOfTimesNameHasBeenDrawn >= numberOfDraws
        })
      })
      if (namesLeftToDraw.length < numberOfDraws) {
        // Every name this participant can draw has already been drawn
        return false
      }
      drawnNames.push({
        gifter: participant.name,
        // Shuffling the potential names to draw and taking the first n
        giftees: namesLeftToDraw
          .sort(() => 0.5 - Math.random())
          .slice(0, numberOfDraws)
          .map(({ name }) => name),
      })
      return true
    })
    return canEveryoneDrawAName
  }
  let loopCounter = 0
  let everyoneCanDrawAName = false

  while (!everyoneCanDrawAName && NUMBER_OF_TIMES_TO_TRY_TO_FIND_A_DRAWING_CLASH > loopCounter) {
    loopCounter += 1
    everyoneCanDrawAName = checkForClash()
  }
  return everyoneCanDrawAName
}

// TODO: Develop algorithm to check every combination for validity
// const methodicallyCheckForDrawingClashes = (
//   participants: ParticipantWithPotentialDraws[],
// ): boolean => {
//   return true
// }

export const isDrawPossible = (participants: Participant[], rules: Rules): boolean => {
  const numberOfParticipants = participants.length
  const { numberOfDraws, addExclusions } = rules
  const participantsWithPotentialDraws: ParticipantWithPotentialDraws[] = []

  if (numberOfParticipants < 3) return false
  if (!addExclusions) return true

  // Check that everyone can draw enough names to match the exchange settings
  const everyoneHasEnoughNamesToDraw = participants.every((currentParticipant) => {
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

  const everyoneCanDrawAName = randomlyCheckForDrawingClashes(
    participantsWithPotentialDraws,
    numberOfDraws,
  )
  if (!everyoneCanDrawAName) return false

  return true
}
