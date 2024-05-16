import { Api } from "./axios"

export interface Medicine {
  id:string
  name:string
  published_at:string
  company:string
  documents: [{
    id: string,
    expedient: string,
    type: string,
    url: string
  }],
  active_principles: [{
    id: string,
    name: string
  }]
}



const getAll =  async (): Promise<Medicine[]> => {
    const {data} =  await Api().get('/data')
    return data
}


export const ApiSercive = {
    getAll,
}