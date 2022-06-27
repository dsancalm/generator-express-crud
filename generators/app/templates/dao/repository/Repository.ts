import I<%= modelName %> from "@models/entities/<%= modelName %>";
import { Document, Schema, model } from "mongoose";

interface I<%= modelName %>Document extends I<%= modelName %>, Document {}

const <%= modelName %>Fields: Record<keyof I<%= modelName %>, any> = <%= modelFields %>;

const <%= modelName %>Schema = new Schema(<%= modelName %>Fields, {
  toObject: {
    transform: function (_doc, ret) {

      const <%= modelVar %>KeysFields = Object.keys(<%= modelName %>Fields);
      const mongoKeysFields = Object.keys(ret);
      
      mongoKeysFields.forEach((key) => {
        if(!<%= modelVar %>KeysFields.includes(key)){
          delete ret[key];
        }
      })
      return ret;
    },
  },
});




const <%= modelName %>Repository = model<I<%= modelName %>Document>("<%= modelName %>", <%= modelName %>Schema);

export { <%= modelName %>Repository, I<%= modelName %>Document };