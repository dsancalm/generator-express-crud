import I<%= modelName %>Dao from "@interfaces/dao/I<%= modelName %>Dao";
import { <%= modelName %>Repository } from "@repository/<%= modelName %>Repository";
import I<%= modelName %> from "@models/entities/<%= modelName %>";
import { Singleton, OnlyInstantiableByContainer } from "typescript-ioc";

@Singleton
@OnlyInstantiableByContainer
export default class <%= modelName %>DaoImpl implements I<%= modelName %>Dao {
  public async save<%= modelName %>(<%= modelVar %>: I<%= modelName %>): Promise<I<%= modelName %>> {
    const res = await <%= modelName %>Repository.create(<%= modelVar %>);
    return res ? res.toObject() : Promise.reject();
  }

  public async get<%= modelName %>ById(id: string): Promise<I<%= modelName %>> {
    const res = await <%= modelName %>Repository.findOne({ id<%= modelName %>: id })
      .exec();
    return res ? res.toObject() : Promise.reject();
  }

  public async update<%= modelName %>(<%= modelVar %>: I<%= modelName %>): Promise<I<%= modelName %>> {
    const res = await <%= modelName %>Repository.findOneAndUpdate({ id<%= modelName %>: <%= modelVar %>.id<%= modelName %> }, <%= modelVar %>, {
      new: true,
    }).exec();
    return res ? Promise.resolve(res.toObject()) : Promise.reject();
  }

  public async delete<%= modelName %>ById(id: string): Promise<I<%= modelName %>> {
    const res = await <%= modelName %>Repository.findOneAndDelete({
      id<%= modelName %>: id,
    }).exec();
    return res ? res.toObject() : Promise.reject();
  }
}
