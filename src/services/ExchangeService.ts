import { ExclusionParticipant, Rules } from 'components/exchanges/NewExchangeForm'
import { apiAxios } from '@Context/Auth'
import { CreateExchangeDto, Exchange, ResourceId } from '@Types'
import { URLBuilder } from '@Utility'

const urlBuilder = new URLBuilder()

const ExchangeService = {
  getAll: async (): Promise<Exchange[]> => {
    const result = await apiAxios.get<Exchange[]>(urlBuilder.exchanges().build())
    return result.data
  },
  get: async (id: ResourceId): Promise<Exchange> => {
    const result = await apiAxios.get<Exchange>(urlBuilder.exchanges(id).build())
    return result.data
  },
  create: async (exchange: CreateExchangeDto): Promise<Exchange> => {
    const result = await apiAxios.post<Exchange>(urlBuilder.exchanges().build(), exchange)
    return result.data
  },
  update: async (exchange: Exchange): Promise<Exchange> => {
    const result = await apiAxios.patch<Exchange>(
      urlBuilder.exchanges(exchange.id).build(),
      exchange,
    )
    return result.data
  },
  delete: async (exchangeId: ResourceId): Promise<boolean> => {
    const result = await apiAxios.delete(urlBuilder.exchanges(exchangeId).build())
    if (result.status === 200) {
      return true
    }
    return false
  },
  getJoinExchangeInformation: async (exchangeId: ResourceId): Promise<Exchange> => {
    const result = await apiAxios.get<Exchange>(urlBuilder.joinExchange(exchangeId).build())
    return result.data
  },
  postJoinExchange: async (exchangeId: ResourceId, participantName: string): Promise<Exchange> => {
    const result = await apiAxios.post<Exchange>(urlBuilder.joinExchange(exchangeId).build(), {
      name: participantName,
    })
    return result.data
  },
  checkExclusions: async (
    participants: ExclusionParticipant[],
    rules: Rules,
  ): Promise<{ isValid: boolean }> => {
    const result = await apiAxios.post<{ isValid: boolean }>(
      urlBuilder.exchanges().addPath('check-exclusions').build(),
      {
        participants,
        ...rules,
      },
    )
    return result.data
  },
}

export default ExchangeService
