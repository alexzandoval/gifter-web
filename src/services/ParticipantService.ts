import { apiAxios } from '@Context/Auth'
import { Exchange, ResourceId, UpdateParticipantDto } from '@Types'
import { URLBuilder } from '@Utility'

const urlBuilder = new URLBuilder()

const ParticipantService = {
  addParticipantsToExchange: async (
    exchangeId: ResourceId,
    participantNames: string[],
  ): Promise<Exchange> => {
    const result = await apiAxios.post<Exchange>(urlBuilder.participants(exchangeId).build(), {
      participantNames,
    })
    return result.data
  },
  removeParticipantsFromExchange: async (
    exchangeId: ResourceId,
    participantIds: number[],
  ): Promise<Exchange> => {
    const result = await apiAxios.delete<Exchange>(urlBuilder.participants(exchangeId).build(), {
      data: { participantIds },
    })
    return result.data
  },
  updateParticipants: async (
    exchangeId: ResourceId,
    participants: UpdateParticipantDto[],
  ): Promise<Exchange> => {
    const result = await apiAxios.patch<Exchange>(
      urlBuilder.participants(exchangeId).build(),
      participants,
    )
    return result.data
  },
}

export default ParticipantService
