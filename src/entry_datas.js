import { EntryModel } from "./entry_model.js"

export class EntryDatas{
  datas = []
  constructor(data){
    if(!data || !data.feed || !data.feed.entry){return}
    for(const entry of data.feed.entry){
      const model = new EntryModel(entry)
      this.datas.push(model)
    }
  }
}